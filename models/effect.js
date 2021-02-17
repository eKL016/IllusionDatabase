const mongoose = require('mongoose');

const effectSchema = new mongoose.Schema({
  name: String,
  level: Number,
  subeffects: [mongoose.ObjectId],
});

module.exports = {
  model: mongoose.model('Effect', effectSchema),
  schema: effectSchema,
};
