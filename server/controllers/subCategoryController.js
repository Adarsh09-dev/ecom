import subCategoryModel from "../models/subCategory-Model.js";
import uploadImageCloudinary from "../utils/uploadImagesCloudinary.js";
import CategoryModel from "../models/Category-Model.js";
import ProductModel from "../models/Product-Models.js";
import session from "express-session";
import flash from "connect-flash";

// SUB - CATEGORY PAGE
// SUB CATEGORY PAGE
export const SubCategoryPage = async (req, res) => {
  const perPage = 5;
  const page = parseInt(req.query.page) || 1;

  try {
    const count = await subCategoryModel.countDocuments();

    const subCategory = await subCategoryModel
      .find()
      .populate("category")
      .sort({ updatedAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return res.render("Sub-category/subCategory-page", {
      layout: false,
      subCategory,
      currentPage: page,
      totalPages: Math.ceil(count / perPage),
    });

  } catch (error) {
    console.log(error);

    req.flash(
      "error",
      "We couldn't load the subcategories. Please try again."
    );

    return res.redirect("/");
  }
};

//SEARCH BAR

// SEARCH THE NAME
export const searchController = async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};

    if (search) {
      filter = {
        name: { $regex: search, $options: "i" },
      };
    }

    const subCategories = await subCategoryModel
      .find(filter)
      .populate("category")
      .sort({ createdAt: -1 });

    res.render("Sub-category/sub-category-page", {
      subCategories,
      search,
      layout: false,
    });
  } catch (error) {
    console.log(error);

    req.flash(
      "error",
      "We couldn't complete your search. Please try again."
    );

    return res.redirect("/sub-category");
  }
};


// ADD SUB-CATGORY PAGE
export const addSubCategoryPage = async (req, res) => {
  try {
    const categories = await CategoryModel.find();

    res.render("Sub-category/subCategory", {
      layout: false,
      categories,
    });
  } catch (error) {
    console.log(error);

    req.flash(
      "error",
      "We couldn't load the subcategory creation page. Please try again."
    );

    return res.redirect("/sub-category");
  }
};

// SUB - CATEGORY CONTROLLER
export const AddSubCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const category = req.body.category;
    const image = req.file;

    if (!name || !category) {
      req.flash("warning", "Please provide all required information.");
      return res.redirect("/sub-category/add");
    }

    let imageUrl = "";

    if (image) {
      const uploadImage = await uploadImageCloudinary(image);
      imageUrl = uploadImage.secure_url;
    }

    const newSubCategory = new subCategoryModel({
      name,
      image: imageUrl,
      category,
    });

    await newSubCategory.save();

    req.flash("success", "Subcategory has been created successfully.");

    return res.redirect("/sub-category");

  } catch (error) {
    console.log(error);

    req.flash(
      "error",
      "We couldn't create the subcategory. Please try again."
    );

    return res.redirect("/sub-category");
  }
};

// EDIT SUB-CATEGORY PAGE
export const editSubCategoryPage = async (req, res) => {
  try {
    const { id } = req.params;

    const subCategory = await subCategoryModel.findById(id);

    if (!subCategory) {
      req.flash("error", "The requested subcategory could not be found.");
      return res.redirect("/sub-category");
    }

    const categories = await CategoryModel.find().sort({ createdAt: -1 });

    res.render("Sub-category/edit-SubCategory", {
      subCategory,
      categories,
      layout: false,
    });

  } catch (error) {
    console.log(error);

    req.flash(
      "error",
      "We couldn't load the subcategory details. Please try again."
    );

    return res.redirect("/sub-category");
  }
};

// UPDATE THE DATA(edit)
export const editSubCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;

    if (!name || !category) {
      req.flash("warning", "Please complete all required fields.");
      return res.redirect(`/sub-category/edit/${id}`);
    }

    let updateData = { name, category };

    if (req.file) {
      const upload = await uploadImageCloudinary(req.file);
      updateData.image = upload.url;
    }

    const updatedSubCategory = await subCategoryModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedSubCategory) {
      req.flash("error", "The requested subcategory could not be found.");
      return res.redirect("/sub-category");
    }

    req.flash("success", "Subcategory has been updated successfully.");

    return res.redirect("/sub-category");

  } catch (error) {
    console.log(error);

    req.flash(
      "error",
      "We couldn't update the subcategory. Please try again."
    );

    return res.redirect("/sub-category");
  }
};
// DELETE CATEGORY

export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const checkProduct = await ProductModel.countDocuments({
      subCategory: { $in: [id] },
    });

    if (checkProduct > 0) {
      req.flash(
        "error",
        "This subcategory cannot be deleted because it is associated with existing products."
      );
      return res.redirect("/sub-category");
    }

    const deletedSubCategory = await subCategoryModel.findByIdAndDelete(id);

    if (!deletedSubCategory) {
      req.flash("error", "The requested subcategory could not be found.");
      return res.redirect("/sub-category");
    }

    req.flash("success", "Subcategory has been deleted successfully.");

    return res.redirect("/sub-category");

  } catch (error) {
    console.log(error);

    req.flash(
      "error",
      "We couldn't delete the subcategory. Please try again."
    );

    return res.redirect("/sub-category");
  }
};