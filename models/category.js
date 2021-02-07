const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: String,
  level: Number,
  subcategories: [mongoose.ObjectId],
});

module.exports = {
  model: mongoose.model('Category', categorySchema),
  schema: categorySchema,
};
