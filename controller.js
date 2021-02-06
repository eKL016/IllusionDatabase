const IllusionModel = require('./models/illusion');
const CategoryModel = require('./models/category');


module.exports = {
  searchByTags: async (paramsObj) => {
    const tagTree = paramsObj.map((level) => level.split('&'));
    console.log(tagTree);
    while (tagTree.length > 0) {
      const tags = tagTree[0];
      if (tags[tags.length-1] === '') {
        tags.pop();
      }
      if (tags.length > 0) {
        
      }
      tagTree.shift();
    }
  },
  insertNewEntry: async (ctx, next) => {
    const illusion = new IllusionModel.model();
    const unsplitedTags = ctx.params[0].split('/');
    const name = unsplitedTags[unsplitedTags.length - 1];
    unsplitedTags.pop();

    const tagTree = unsplitedTags.map((level) => level.split('&'));
    tagTree.slice(0, tagTree.length-2);
    illusion.name = name;
    illusion.content = ctx.request.body;

    await illusion.save();
    await illusion.attachCategories(tagTree);
  },
};
