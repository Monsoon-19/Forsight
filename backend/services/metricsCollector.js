const si = require('systeminformation');
const Metric = require('../models/Metric');
const Prediction = require('../models/Prediction');
const Alert = require('../models/Alert');
const SystemLog = require('../models/SystemLog');
const { calculateHealthScore, getHealthStatus } = require('./healthScoreService');
const { calculateLinearRegression, predictFutureValue } = require('../prediction/linearRegression');
const { calculateMovingAverage } = require('../prediction/movingAverage');
const { classifyTrend, classifyRisk } = require('../prediction/trendAnalysis');
const { detectZScoreAnomaly, detectMonotonicTrend } = require('../prediction/anomalyDetector');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

let io; // Socket.io instance
let collectionInterval;
let predictionInterval;

// In-memory buffer for the rolling windows
const WINDOW_SIZE = 300; // 300 samples for prediction
const ANOMALY_WINDOW = 60; // 60 samples for z-score
const MONOTONIC_WINDOW = 300; // 5 mins at 1 sample/sec

const history = {
  cpu: [],
  memory: [],
  disk: [],
  network: [] // using total network traffic (up+down) for simplicity
};

// Alert cooldown tracking: "metric-severity" -> timestamp
const alertCooldowns = new Map();
const ALERT_COOLDOWN_MS = 5 * 60 * 1000;

const init = (socketIoInstance) => {
  io = socketIoInstance;
};

const start = () => {
  if (collectionInterval) return;

  // Collect metrics every second
  collectionInterval = setInterval(collectMetrics, 1000);
  
  // Run predictions every 10 seconds
  predictionInterval = setInterval(runPredictions, 10000);
  
  logger.info('Metrics collector started');
};

const stop = () => {
  if (collectionInterval) clearInterval(collectionInterval);
  if (predictionInterval) clearInterval(predictionInterval);
  collectionInterval = null;
  predictionInterval = null;
  logger.info('Metrics collector stopped');
};

const collectMetrics = async () => {
  try {
    const [cpuLoad, mem, fsSize, netStats, inetLatency] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
      si.inetChecksite('https://google.com').catch(() => ({ ms: 0 }))
    ]);

    const cpu = cpuLoad.currentLoad;
    const memory = (mem.active / mem.total) * 100;
    
    // Average disk use
    const disk = fsSize.length > 0 ? (fsSize.reduce((acc, fs) => acc + fs.use, 0) / fsSize.length) : 0;
    
    // Total network throughput in MB/s
    const networkUp = netStats.length > 0 ? (netStats.reduce((acc, net) => acc + net.tx_sec, 0) / (1024 * 1024)) : 0;
    const networkDown = netStats.length > 0 ? (netStats.reduce((acc, net) => acc + net.rx_sec, 0) / (1024 * 1024)) : 0;
    
    const responseTime = inetLatency.ms || Math.random() * 50;

    const metricData = {
      cpu,
      memory,
      disk,
      networkUp,
      networkDown,
      responseTime
    };

    // Calculate Health Score
    const healthScore = calculateHealthScore(metricData);
    const status = getHealthStatus(healthScore);

    // Save to DB
    const newMetric = new Metric(metricData);
    await newMetric.save();

    // Update in-memory history
    updateHistory('cpu', cpu);
    updateHistory('memory', memory);
    updateHistory('disk', disk);
    updateHistory('network', networkUp + networkDown);

    // Run anomaly detection on every tick
    checkAnomalies();

    // Broadcast to /live namespace
    if (io) {
      const metricState = {
        ...metricData,
        healthScore,
        status,
        timestamp: newMetric.timestamp
      };
      
      io.of('/live').emit('metrics:update', metricState);
      io.of('/live').emit('healthScoreUpdate', { healthScore, status });
    }
  } catch (err) {
    logger.error('Error collecting metrics:', err);
  }
};

const updateHistory = (metricName, value) => {
  history[metricName].push(value);
  if (history[metricName].length > Math.max(WINDOW_SIZE, MONOTONIC_WINDOW)) {
    history[metricName].shift();
  }
};

const checkAnomalies = () => {
  const metricsToCheck = ['cpu', 'memory', 'disk', 'network'];

  metricsToCheck.forEach(metric => {
    const data = history[metric];
    if (data.length < ANOMALY_WINDOW) return;
    
    const anomalyData = data.slice(-ANOMALY_WINDOW);
    const isZAnomaly = detectZScoreAnomaly(anomalyData);
    
    const monotonicData = data.slice(-MONOTONIC_WINDOW);
    const isMonotonic = detectMonotonicTrend(monotonicData);

    if (isZAnomaly || isMonotonic) {
      const reason = isZAnomaly ? 'Z-Score Anomaly Detected' : 'Monotonic Rising Trend (Possible Leak)';
      handleDetectedIssue(metric, 'Critical', reason, `Immediate attention required for ${metric}`);
    }
  });
};

const runPredictions = async () => {
  const metricsToPredict = ['cpu', 'memory', 'disk', 'network'];
  const futureStepsList = [
    { steps: 300, time: '5m' }, // 5 mins = 300 secs
    { steps: 600, time: '10m' },
    { steps: 1800, time: '30m' }
  ];

  for (const metric of metricsToPredict) {
    const data = history[metric];
    if (data.length < 60) continue; // Need minimum data

    // Smooth data
    const smoothedData = calculateMovingAverage(data, 10);
    
    // Calculate regression
    const { slope, intercept, rSquared } = calculateLinearRegression(smoothedData);
    const trend = classifyTrend(slope);

    for (const { steps, time } of futureStepsList) {
      const predictedValue = predictFutureValue(slope, intercept, smoothedData.length, steps);
      const risk = classifyRisk(metric, predictedValue);

      const predictionData = {
        id: uuidv4(),
        metric,
        name: `${metric.toUpperCase()} Forecast (${time})`,
        prediction: `Predicted ${metric} at ${predictedValue.toFixed(2)}% in ${time}`,
        predictedValue,
        confidence: parseFloat(rSquared.toFixed(2)),
        trend,
        risk,
        timeframe: time,
        details: `Linear regression with slope ${slope.toFixed(4)}`
      };

      try {
        const doc = new Prediction(predictionData);
        await doc.save();
        
        if (io) {
          io.of('/live').emit('prediction:update', predictionData);
        }

        if (risk === 'High' || risk === 'Critical') {
          handleDetectedIssue(metric, risk, `Predicted ${risk} risk in ${time}`, `Investigate ${metric} trend immediately`, predictionData.id);
        }
      } catch (err) {
        logger.error('Error saving prediction', err);
      }
    }
  }
};

const handleDetectedIssue = async (metric, severity, reason, suggestedAction, predictionId = null) => {
  const cooldownKey = `${metric}-${severity}`;
  const lastAlertTime = alertCooldowns.get(cooldownKey) || 0;
  
  if (Date.now() - lastAlertTime < ALERT_COOLDOWN_MS) {
    return; // Cooldown active
  }
  
  alertCooldowns.set(cooldownKey, Date.now());

  const alertData = {
    id: uuidv4(),
    severity,
    message: `${metric.toUpperCase()} Issue: ${reason}`,
    node: 'Primary-Node-1',
    category: 'System',
    predictionId,
    suggestedAction
  };

  try {
    const alertDoc = new Alert(alertData);
    await alertDoc.save();

    const logDoc = new SystemLog({
      id: uuidv4(),
      category: predictionId ? 'Prediction' : 'Alert',
      message: `Generated alert for ${metric}: ${reason}`,
      level: severity === 'Critical' ? 'error' : 'warning'
    });
    await logDoc.save();

    if (io) {
      io.of('/live').emit('alert:new', alertData);
      io.of('/live').emit('anomaly:detected', logDoc);
    }
  } catch (err) {
    logger.error('Error generating alert/log', err);
  }
};

module.exports = {
  init,
  start,
  stop
};
