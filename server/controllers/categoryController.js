import CategoryModel from "../models/Category-Model.js";

export const categoryPage = async(req, res) => {
  const categories = await CategoryModel.find();
  res.render("Category/category-page", { layout: false, categories})
}

export const AddCategoryController = async (req, res) => {
  try {
    const { name, image } = req.body;

    // validation
    if (!name || !image) {
      return res.render("add-category", {
        message: "Enter required fields",
        error: true,
      });
    }
    const category = new CategoryModel({
      name,
      image,
    });

    const saveCategory = await category.save();

    if (!saveCategory) {
      return res.render("add-category", {
        message: "Category not created",
        error: true,
      });
    }

    // redirect after success
    return res.redirect("/user/category-list");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
    // return res.render("add-category", {
    //   message: "Server Error",
    //   error: true,
    // });
  }
};
