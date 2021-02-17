const mongoose = require('mongoose');
const schemas = {
  categories: require('./category.js'),
  effects: require('./effect.js'),
};

const traverseAttrArray = async (illusionInstance, attrName, attrArray) => {
  for (let i=0; i<attrArray.length; i++) {
    const attrs = attrArray[i];
    console.log(`Attach ${attrName}: ${attrs}`);
    const foundAttrs = await Promise.all(attrs.map( async (a) => {
      const foundAttr = await schemas[attrName].model
          .findOne({name: a}, '_id').exec();
      if (!foundAttr) throw new ReferenceError(`Invalid ${attrName}: "${a}"`);
      return foundAttr._id;
    }));
    console.log(foundAttrs);
    illusionInstance[attrName] = illusionInstance[attrName].concat(foundAttrs);
  }
};

const illusionSchema = new mongoose.Schema({
  name: String,
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
  try {
    await traverseAttrArray(this, 'categories', categoriesArray);
    await traverseAttrArray(this, 'effects', effectsArray);
    return this.save();
  } catch (e) {
    console.log(e);
  };
};

module.exports = {
  model: mongoose.model('Illusion', illusionSchema),
  schema: illusionSchema,
};
