const mongoose = require('mongoose');
const schemas = {
  categories: require('./category.js'),
  effects: require('./effect.js'),
};

const cheakAttrExists = async (illusionInstance, attrName, attrArray) => {
  for (let i=0; i<attrArray.length; i++) {
    const attrs = attrArray[i];
    console.log(`Attach ${attrName}: ${attrs}`);
    const foundAttrs = await Promise.all(attrs.map( async (id) => {
      const foundAttr = await schemas[attrName].model
          .findOne({_id: id}, '_id').exec();
      if (!foundAttr) {
        throw new ReferenceError(`Invalid ${attrName} ID: "${a}"`);
      }
      return foundAttr._id;
    }));
    console.log(foundAttrs);
    return;
  }
};

const illusionSchema = new mongoose.Schema({
  name: String,
  title: String,
  content: String,
  update_at: {type: Date, default: Date.now},
  categories: [mongoose.ObjectId],
  effects: [mongoose.ObjectId],
});
illusionSchema.methods.getContentString = function() {
  return this.content.toString('utf8');
};
illusionSchema.methods.getContentBlob = function() {
  return this.content;
};
illusionSchema.methods.assignAttributes = async function(
    {categoriesArray, effectsArray},
) {
  await Promise.all([
    cheakAttrExists(this, 'categories', categoriesArray),
    cheakAttrExists(this, 'effects', effectsArray),
  ]);
  this.categories = categoriesArray.reduce((acc, cur) => acc.concat(cur), []);
  this.effects = effectsArray.reduce((acc, cur) => acc.concat(cur), []);
  return this.save();
};

module.exports = {
  model: mongoose.model('Illusion', illusionSchema),
  schema: illusionSchema,
};
