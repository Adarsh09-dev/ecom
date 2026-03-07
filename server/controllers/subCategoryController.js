import subCategoryModel from "../models/subCategory-Model.js";
import uploadImageCloudinary from "../utils/uploadImagesCloudinary.js";
import CategoryModel from "../models/Category-Model.js";

// SUB - CATEGORY PAGE
export const SubCategoryPage = async (req, res) => {
  const subCategory = await subCategoryModel.find();

  res.render("Sub-category/subCategory-page", {
    layout: false,
    subCategory,
  });
};

// ADD SUB-CATGORY PAGE
export const addSubCategoryPage = async (req, res) => {
  const categories = await CategoryModel.find();

  res.render("Sub-category/subCategory", {
    layout: false,
    categories,
  });
};

// SUB - CATEGORY CONTROLLER
export const AddSubCategoryController = async (req, res) => {
  try {
    const { name, category } = req.body;
    const image = req.file;

    if (!name || !image || !category) {
      return res.redirect("/add-subcategory");
    }

    const newSubCategory = new subCategoryModel({
      name,
      category,
      image,
    });

    await newSubCategory.save();

    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.redirect("/add-subcategory");
  } 
};
 