const mongoose = require('mongoose');

const scenarioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  keywords: [{ type: String, required: true }],
  rights_text: { type: String, required: true },
  law_reference: { type: String, required: true },
  script: { type: String, required: true }
});

module.exports = mongoose.model('Scenario', scenarioSchema);