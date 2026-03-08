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

    console.log("STEP 1 controller reached");

    const { name } = req.body;
    const category = req.body.category;
    const image = req.file;

    console.log("STEP 2 body:", req.body);

    if (!name || !category) {
      console.log("STEP 3 validation failed");
      return res.send("Name and category required");
    }

    console.log("STEP 4 validation passed");

    let imageUrl = "";

    if (image) {
      console.log("STEP 5 uploading image");

      const uploadImage = await uploadImageCloudinary(image);

      imageUrl = uploadImage.secure_url;

      console.log("STEP 6 image uploaded:", imageUrl);
    }

    const newSubCategory = new subCategoryModel({
      name,
      image: imageUrl,
      category
    });

    console.log("STEP 7 saving:", newSubCategory);

    await newSubCategory.save();

    res.redirect("/sub-category");

  } catch (error) {

    console.log("ERROR:", error);

    res.send("Error creating sub category");
  }
};