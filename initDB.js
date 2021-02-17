const mongoose = require('mongoose');
const Schemas = {
  categories: require('./models/category.js').model,
  effects: require('./models/effect.js').model,
};

const fs = require('fs').promises;

const recursiveAddAttributes = async (attr, attrName, level=0) => {
  const selfName = Object.keys(attr)[0];
  const child = attr[selfName];
  const newAttribute = new Schemas[attrName]({level: level});
  if (typeof child === 'object') {
    newAttribute.name = selfName;
    newAttribute[`sub${attrName}`] = await Promise
        .all(
            child
                .map((key) => recursiveAddAttributes(key, attrName, level+1)),
        );
  } else {
    newAttribute.name = attr;
  }
  await newAttribute.save();
  return newAttribute._id;
};

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async function() {
  const categoryObj = JSON.parse(
      await fs.readFile('test_data/categories.json', 'utf-8'),
  );
  const effectObj = JSON.parse(
      await fs.readFile('test_data/effects.json', 'utf-8'),
  );
  try {
    await Promise.all(
        categoryObj.categories
            .map((cat) => recursiveAddAttributes(cat, 'categories', 0)),
    );
    await Promise.all(
        effectObj.effects
            .map((e) => recursiveAddAttributes(e, 'effects', 0)),
    );
    console.log('I\'ve planted two trees in your DB :P');
  } catch (e) {
    console.log(e);
  } finally {
    process.exit(0);
  };
});
