const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  timestamp: { type: Date, default: Date.now, index: true },
  category: { type: String, enum: ['System', 'Prediction', 'Alert', 'Stress'], required: true },
  message: { type: String, required: true },
  level: { type: String, enum: ['info', 'warning', 'error'], required: true }
});

module.exports = mongoose.model('SystemLog', systemLogSchema);
