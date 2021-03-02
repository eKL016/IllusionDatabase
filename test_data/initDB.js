const mongoose = require('mongoose');
const Schemas = {
  elements: require('../models/element.js').model,
  effects: require('../models/effect.js').model,
};
const regex = /\s&\s/;
const fs = require('fs').promises;

const recursiveAddAttributes = async (attr, attrName, iconURL, level=0) => {
  let curName;
  const selfName = Object.keys(attr)[0];
  const child = attr[selfName];
  const newAttribute = new Schemas[attrName]({level: level});
  if (typeof child === 'object') {
    splitedName = selfName.split('/');
    newAttribute.name = splitedName[splitedName.length-1];
    if (iconURL!=='') {
      curName = [iconURL, newAttribute.name].join('_');
    } else {
      curName = newAttribute.name;
    }
    newAttribute[`sub${attrName}`] = await Promise
        .all(
            child
                .map((key) => recursiveAddAttributes(
                    key, attrName, curName, level+1),
                ),
        );
  } else {
    splitedName = attr.split('/');
    newAttribute.name = splitedName[splitedName.length-1];
    if (iconURL!=='') {
      curName = [iconURL, newAttribute.name].join('_');
    } else {
      curName = newAttribute.name;
    }
  }
  newAttribute.iconURL = `/icons/${curName.replaceAll(/&/ig, '_')}.PNG`;
  await newAttribute.save();
  return newAttribute._id;
};

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async function() {
  const elementObj = JSON.parse(
      await fs.readFile('./elements.json', 'utf-8'),
  );
  const effectObj = JSON.parse(
      await fs.readFile('./effects.json', 'utf-8'),
  );
  try {
    await Promise.all(
        elementObj.elements
            .map((cat) => recursiveAddAttributes(cat, 'elements', '', 0)),
    );
    await Promise.all(
        effectObj.effects
            .map((e) => recursiveAddAttributes(e, 'effects', '', 0)),
    );
    console.log('I\'ve planted two trees in your DB :P');
  } catch (e) {
    console.log(e);
  } finally {
    process.exit(0);
  };
});
