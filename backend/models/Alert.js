const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  timestamp: { type: Date, default: Date.now, index: true },
  severity: { type: String, enum: ['Critical', 'Warning', 'Info'], required: true },
  message: { type: String, required: true },
  node: { type: String, required: true },
  category: { type: String, required: true },
  resolved: { type: Boolean, default: false },
  predictionId: { type: String }, // Links to the prediction if applicable
  suggestedAction: { type: String }
});

module.exports = mongoose.model('Alert', alertSchema);
