const { startStressTest, stopStressTest, getStressStatus } = require('../services/stressTestService');
const SystemLog = require('../models/SystemLog');
const { v4: uuidv4 } = require('uuid');

const startTest = async (req, res) => {
  const started = startStressTest();
  if (started) {
    const logDoc = new SystemLog({
      id: uuidv4(),
      category: 'Stress',
      message: 'Stress test started manually via API',
      level: 'warning'
    });
    await logDoc.save();
    res.json({ message: 'Stress test started' });
  } else {
    res.status(400).json({ message: 'Stress test is already running' });
  }
};

const stopTest = async (req, res) => {
  const stopped = stopStressTest();
  if (stopped) {
    const logDoc = new SystemLog({
      id: uuidv4(),
      category: 'Stress',
      message: 'Stress test stopped manually via API',
      level: 'info'
    });
    await logDoc.save();
    res.json({ message: 'Stress test stopped' });
  } else {
    res.status(400).json({ message: 'Stress test is not running' });
  }
};

const getStatus = (req, res) => {
  res.json({ isStressing: getStressStatus() });
};

module.exports = {
  startTest,
  stopTest,
  getStatus
};
