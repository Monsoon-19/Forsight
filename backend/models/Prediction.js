const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  timestamp: { type: Date, default: Date.now, index: true },
  metric: { type: String, enum: ['cpu', 'memory', 'disk', 'network'], required: true },
  name: { type: String, required: true },
  prediction: { type: String, required: true },
  predictedValue: { type: Number, required: true },
  confidence: { type: Number, required: true }, // e.g. 0.89
  trend: { type: String, enum: ['Rising', 'Falling', 'Stable'], required: true },
  risk: { type: String, enum: ['Low', 'Moderate', 'High', 'Critical'], required: true },
  timeframe: { type: String, required: true },
  details: { type: String, required: true }
});

module.exports = mongoose.model('Prediction', predictionSchema);
