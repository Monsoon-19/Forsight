const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now, index: true },
  cpu: { type: Number, required: true },
  memory: { type: Number, required: true },
  disk: { type: Number, required: true },
  networkUp: { type: Number, required: true },
  networkDown: { type: Number, required: true },
  responseTime: { type: Number, default: 0 }
});

module.exports = mongoose.model('Metric', metricSchema);
