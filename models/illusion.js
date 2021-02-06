const mongoose = require('mongoose');
const categorySchema = require('./category.js');

const illusionSchema = new mongoose.Schema({
  name: String,
  content: String,
  update_at: {type: Date, default: Date.now},
  categories: [mongoose.ObjectId],
});
illusionSchema.methods.getContentString = function() {
  return this.content.toString('utf8');
};
illusionSchema.methods.getContentBlob = function() {
  return this.content;
};
illusionSchema.methods.attachCategories = async function(tagTree) {
  for (let i=0; i<tagTree.length; i++) {
    const tags = tagTree[i];
    console.log(`Attach Tags: ${tags}`);
    const foundCategories = await Promise.all(tags.map( async (tag) => {
      const foundCategory = await categorySchema.model
          .findOne({name: tag}, '_id').exec();
      return foundCategory._id;
    }));
    console.log(foundCategories);
    this.categories = this.categories.concat(foundCategories);
  }
  return this.save();
};

module.exports = {
  model: mongoose.model('Illusion', illusionSchema),
  schema: illusionSchema,
};
