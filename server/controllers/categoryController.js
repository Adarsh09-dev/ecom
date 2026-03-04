import CategoryModel from "../models/Category-Model.js";

export const AddCategoryController = async (req, res) => {
  try {
    const { name, image } = req.body;

    // validation
    if (!name || !image) {
      return res.render("admin/add-category", {
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
      return res.render("admin/add-category", {
        message: "Category not created",
        error: true,
      });
    }

    // redirect after success
    return res.redirect("/admin/category-list");
  } catch (error) {
    console.log(error);
    return res.render("admin/add-category", {
      message: "Server Error",
      error: true,
    });
  }
};
