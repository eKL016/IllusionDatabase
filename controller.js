const IllusionModel = require('./models/illusion');
const CategoryModel = require('./models/category');


module.exports = {
  // Category Controllers
  getAllTags:
    async (ctx, next) => {
      if (ctx.query.populate === 'true') {
        return await CategoryModel.model
            .find({}, 'name _id subcategories')
            .populate({
              path: 'subcategories',
              populate: {
                path: 'subcategories',
                select: 'name _id subcategories',
              },
              select: 'name _id subcategories',
            })
            .exec();
      } else {
        return await CategoryModel.model.find({}, 'name _id').exec();
      }
    },
  searchByTags: async (ctx, next) => {
    const tagTree = ctx.params[0]
        .split('/')
        .map((level) => level.split('&'));
    const flattenedTagTree = tagTree.reduce((acc, val) => acc.concat(val), []);
    const populatedTagTree = await CategoryModel.model
        .find({name: {$in: flattenedTagTree}}).exec();
    const tagMap = populatedTagTree
        .reduce((out, cur) => ({...out, [cur.name]: cur}), {});
    let targetTags = [];

    while (tagTree.length > 0) {
      const tags = tagTree[0];
      if (tags[tags.length-1] === '') {
        tags.pop();
      }
      if (tags.length > 0) {
        targetTags = targetTags.concat(tags.map((tagName) => tagMap[tagName]));
      }
      tagTree.shift();
    }
    const query = IllusionModel.model
        .find({categories: {$all: targetTags}});
    const output = await query.exec();
    return Object.keys(output).map((key) => output[key]._id);
  },
  // Illusion Controllers
  getAllEntry: async (ctx, next) => {
    return IllusionModel.model.find().exec();
  },
  getEntryById: async (ctx, next) => {
    return IllusionModel.model.findOne({_id: ctx.params.id}).exec();
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

    await illusion.attachCategories(tagTree);
    await illusion.save();
  },
};
