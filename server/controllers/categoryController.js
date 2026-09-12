import CategoryModel from "../models/Category-Model.js";
import uploadImageCloudinary from "../utils/uploadImagesCloudinary.js";
import ProductModel from "../models/Product-Models.js";
import subCategoryModel from "../models/subCategory-Model.js";
import session from "express-session";
import flash from "connect-flash";

export const categoryPage = async (req, res) => {
  let perPage = 5;
  let page = parseInt(req.query.page) || 1;

  try {
    const count = await CategoryModel.countDocuments();

    const categories = await CategoryModel.find()
      .populate("")
      .sort({ updatedAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();
    res.render("Category/category-page", {
      layout: false,
      categories,
      currentPage: page,
      totalPages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
  }
};

//Add category
export async function addCategoryPage(req, res) {
  const categories = await CategoryModel.find();

  res.render("Category/add-categoryPage", {
    categories,
    success: req.flash("success"),
    error: req.flash("error"),
  });
}

export async function AddCategoryPage(req, res) {
  try {
    const { name } = req.body;
    const image = req.file;

    // Validate name
    if (!name || name.trim() === "") {
      req.flash("error", "Category name is required.");
      return res.redirect("/category/add-category");
    }

    // Validate image
    if (!image) {
      req.flash("error", "Please upload a category image.");
      return res.redirect("/category/add-category");
    }

    // Check duplicate category
    const existingCategory = await CategoryModel.findOne({
      name: name.trim(),
    });

    if (existingCategory) {
      req.flash("error", "Category already exists.");
      return res.redirect("/category/add-category");
    }

    // Upload image to Cloudinary
    const uploadResult = await uploadImageCloudinary(image);

    // Create category
    const newCategory = new CategoryModel({
      name: name.trim(),
      image: uploadResult.url,
    });

    await newCategory.save();

    req.flash("success", "Category created successfully.");
    return res.redirect("/category");
  } catch (error) {
    console.error("Create Category Error:", error);

    req.flash("error", "Something went wrong. Please try again.");
    return res.redirect("/category/add");
  }
}


// CREATE CATEGORY
export async function createCategory(req, res) {
  try {
    const { name } = req.body;
    const image = req.file;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const updateData = {
      name,
    };

    if (image) {
      const uploadResult = await uploadImageCloudinary(image);
      updateData.image = uploadResult.url;
    }

    const newCategory = new CategoryModel(updateData);
    await newCategory.save();

    console.log("Category Saved:", newCategory);

    req.flash("success", "Category has been created successfully.");
    return res.redirect("/category");

  } catch (error) {
    console.error(error);

    req.flash(
      "error",
      "We couldn't create the category. Please try again."
    );

    return res.redirect("/category");
  }
}

// EDIT CATEGORY
export const editCategoryPage = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CategoryModel.findById(id);

    if (!category) {
      req.flash("error", "The requested category could not be found.");
      return res.redirect("/category");
    }

    console.log("...id...", category);

    res.render("Category/edit-categoryPage", {
      layout: false,
      category,
    });

  } catch (error) {
    console.log(error);

    req.flash(
      "error",
      "We couldn't load the category details. Please try again."
    );

    return res.redirect("/category");
  }
};

// UPDATE CATEGORY
export const updatCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    console.log("ID:", id);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    let updateData = {
      name,
    };

    if (req.file) {
      const upload = await uploadImageCloudinary(req.file);
      updateData.image = upload.url;
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedCategory) {
      req.flash("error", "The requested category could not be found.");
      return res.redirect("/category");
    }

    req.flash("success", "Category has been updated successfully.");
    return res.redirect("/category");

  } catch (error) {
    console.log(error);

    req.flash(
      "error",
      "We couldn't update the category. Please try again."
    );

    return res.redirect("/category");
  }
};

// DELETE CATEGORY
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const checkSubcategory = await subCategoryModel.countDocuments({
      category: id,
    });

    const checkProduct = await ProductModel.countDocuments({
      categoryId: id,
    });

    if (checkSubcategory > 0 || checkProduct > 0) {
      req.flash(
        "error",
        "This category cannot be deleted because it is associated with existing subcategories or products."
      );
      return res.redirect("/category");
    }

    const deletedCategory = await CategoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      req.flash("error", "The requested category could not be found.");
      return res.redirect("/category");
    }

    console.log("Category deleted");

    req.flash("success", "Category has been deleted successfully.");
    return res.redirect("/category");

  } catch (error) {
    console.log(error);

    req.flash(
      "error",
      "We couldn't delete the category. Please try again."
    );

    return res.redirect("/category");
  }
};