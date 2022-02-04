const Category = require("../models/Category");

exports.buildAncestors = async (id, parent_id) => {
  let ancest = [];
  try {
    let parent_category = await Category.findOne(
      { _id: parent_id },
      { name: 1, slug: 1, ancestors: 1 }
    ).exec();

    if (parent_category) {
      const { _id, name, slug } = parent_category;
      const ancest = [...parent_category.ancestors];
      ancest.unshift({ _id, name, slug });
      const category = await Category.findByIdAndUpdate(id, {
        $set: { ancestors: ancest },
      });
    }
  } catch (error) {
    console.log(error);
  }
};
