const mongoose = require('mongoose');

const illusionSchema = new mongoose.Schema({
  name: String,
  content: String,
  update_at: {type: Date, default: Date.now},
  tags: [[String]],
});
illusionSchema.methods.get_content_string = function() {
  return this.content.toString('utf8');
};
illusionSchema.methods.get_content_blob = function() {
  return this.content;
};


module.exports = mongoose.model('Illusion', illusionSchema);
