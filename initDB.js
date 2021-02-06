const mongoose = require('mongoose');
const Category = require('./models/category.js').model;
const fs = require('fs').promises;

const recursiveAddCatagories = async (cat) => {
  const selfName = Object.keys(cat)[0];
  const child = cat[selfName];
  const newCategory = new Category();
  if (typeof child === 'object') {
    newCategory.name = selfName;
    console.log(child);
    newCategory.subcategory = await Promise
        .all(
            child
                .map((key) => recursiveAddCatagories(key)),
        );
  } else {
    console.log(cat);
    newCategory.name = cat;
  }
  await newCategory.save();
  return newCategory._id;
};

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async function() {
  const categoryObj = JSON.parse(
      await fs.readFile('test_data/categories.json', 'utf-8'),
  );
  try {
    await Promise.all(
        categoryObj.categories
            .map((cat) => recursiveAddCatagories(cat)),
    );
    console.log('I\'ve planted a tree in your DB :P');
  } catch (e) {
    console.log(e);
  };
});
