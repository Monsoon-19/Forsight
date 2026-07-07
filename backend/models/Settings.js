const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  cpuThreshold: { type: Number, default: 80 },
  memoryThreshold: { type: Number, default: 85 },
  diskThreshold: { type: Number, default: 90 },
  refreshInterval: { type: Number, default: 1000 }, // in ms
  predictionWindow: { type: Number, default: 30 }, // in minutes
  enableNotifications: { type: Boolean, default: true },
  darkMode: { type: Boolean, default: true }
});

module.exports = mongoose.model('Settings', settingsSchema);
