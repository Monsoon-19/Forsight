# Foresight Development Spec

## Overview
Foresight is an AI-powered predictive infrastructure monitoring dashboard modeled after Grafana, Datadog, and Linear.

## Backend Architecture
- **Stack**: Node.js + Express + Socket.IO + MongoDB (Mongoose) + JWT auth + bcrypt.
- **Pattern**: Strict MVC with a service layer. Max 300 lines per file.

## Folder Structure
```
backend/
  config/ (db.js, env.js)
  controllers/ (auth, metrics, alerts, predictions, reports)
  middleware/ (authGuard, rateLimiter, errorHandler, validateRequest)
  models/ (User, Metric, Alert, Prediction, SystemLog, Settings)
  routes/
  services/ (metricsCollector.js, healthScoreService.js, reportService.js, stressTestService.js)
  prediction/ (linearRegression.js, movingAverage.js, trendAnalysis.js, anomalyDetector.js)
  sockets/
  utils/ (logger.js)
```

## Features
- **Real Metrics**: Use `systeminformation` to collect actual CPU, memory, disk, and network stats every second. Write to MongoDB and broadcast over Socket.IO on `/live` namespace as `metrics:update`.
- **Prediction Engine**: Linear regression over rolling 300-sample window to forecast CPU/memory/disk/network 5/10/30 minutes out. Confidence score from R². Smoothing with moving average. Classify trend (rising/falling/stable) and risk (low/moderate/high/critical). Emit `prediction:update` every 10 seconds.
- **Anomaly Detection**: Rolling z-score (|z| > 3 = anomaly) over last 60 samples. Monotonic-trend check over 5-minute window for memory leaks. Log to SystemLogs and emit `anomaly:detected`.
- **Alerts**: Only generated from predictions or anomalies. Cooldown of 5 minutes per metric+severity.
- **Health Score**: 100 − cpu%×0.3 − memory%×0.25 − disk%×0.2 − network%×0.15 − responseTimePenalty×0.1. Status bands: 90–100 Excellent, 70–89 Healthy, 40–69 Warning, <40 Critical.
- **Auth**: register/login/logout, JWT access token (15 min) + refresh token (7 days, httpOnly cookie), bcrypt cost factor 12.
- **Stress Test**: POST `/api/stress-test/start` and `/stop` to simulate load.

## Data Models (Mongoose)
Match frontend types: MetricState, Alert, Forecast, LogEntry, SystemSettings.

## Database
MongoDB (Atlas or local via MONGODB_URI). Indexes on timestamps. Scheduled cleanup for raw metrics > 24 hours.
