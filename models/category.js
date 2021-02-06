const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: String,
  subcategory: [mongoose.ObjectId],
});

module.exports = {
  model: mongoose.model('Category', categorySchema),
  schema: categorySchema,
};
