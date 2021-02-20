const IllusionModel = require('./models/illusion');
const TagModels = {
  categories: require('./models/category'),
  effects: require('./models/effect'),
};
const AllowedTagType = ['categories', 'effects'];

module.exports = {
  // Controllers
  getAllTags:
    async (ctx, next) => {
      const type = ctx.params.type;
      if (AllowedTagType.find((x) => x === type) === undefined) {
        throw new EvalError('Invalid Tag Type');
      }
      if (ctx.query.populate === 'true') {
        const subTagName = `sub${type}`;
        const selectedColumns = `name _id ${subTagName}`;

        return await TagModels[type].model
            .find({}, selectedColumns)
            .populate({
              path: subTagName,
              populate: {
                path: subTagName,
                select: selectedColumns,
              },
              select: selectedColumns,
            })
            .exec();
      } else {
        return await TagModels[type].model.find({}, 'name _id').exec();
      }
    },
  searchByTagIDs: async (ctx, next) => {
    const type = ctx.params.type;
    if (AllowedTagType.find((x) => x === type) === undefined) {
      throw new EvalError('Invalid Tag Type');
    }
    const {
      tags: unsplitedTagArray,
    } = ctx.request.body;
    const splitedTagArray = unsplitedTagArray.map((row) => row.split('&'));
    const targetTags = [];

    while (splitedTagArray.length > 0) {
      const tags = splitedTagArray[0];
      if (tags[tags.length-1] === '') {
        tags.pop();
      }
      if (tags.length > 0) {
        targetTags.push(...tags);
      }
      splitedTagArray.shift();
    }
    const output = await IllusionModel.model
        .find({[type]: {$all: targetTags}}).exec();
    return Object.keys(output).map((key) => output[key]._id);
  },
  getAllEntry: async (ctx, next) => {
    if (ctx.query.extend === 'true') {
      return await IllusionModel.model.find().exec();
    } else {
      return await IllusionModel.model.find({}, '_id title').exec();
    }
  },
  getEntryById: async (ctx, next) => {
    return IllusionModel.model.findOne({_id: ctx.params.id}).exec();
  },
  insertNewEntry: async (ctx, next) => {
    const illusion = new IllusionModel.model();
    const {
      content: mdContent,
      title: title,
      categories: unsplitedCategoryArray,
      effects: unsplitedEffectArray,
    } = ctx.request.body;
    const attrArrays = {
      categoriesArray: unsplitedCategoryArray.map((line) => line.split('&')),
      effectsArray: unsplitedEffectArray.map((line) => line.split('&')),
    };
    console.log(attrArrays);

    illusion.name = ctx.params.name;
    illusion.content = mdContent;
    illusion.title = title;

    await illusion.assignAttributes(attrArrays);
  },
};
