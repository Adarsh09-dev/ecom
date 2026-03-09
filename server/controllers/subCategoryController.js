import subCategoryModel from "../models/subCategory-Model.js";
import uploadImageCloudinary from "../utils/uploadImagesCloudinary.js";
import CategoryModel from "../models/Category-Model.js";
import ProductModel from "../models/Product-Models.js";

// SUB - CATEGORY PAGE
export const SubCategoryPage = async (req, res) => {
  const subCategory = await subCategoryModel.find().populate("category");

  res.render("Sub-category/subCategory-page", {
    layout: false,
    subCategory,
  });
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
    res.status(500).send("Server Error");
  }
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
      category,
    });

    console.log("STEP 7 saving:", newSubCategory);

    await newSubCategory.save();

    res.redirect("/sub-category");
  } catch (error) {
    console.log("ERROR:", error);

    res.send("Error creating sub category");
  }
};

// EDIT SUB-CATEGORY PAGE
export const editSubCategoryPage = async (req, res) => {
  try {
    const { id } = req.params;

    // find the sub category
    const subCategory = await subCategoryModel.findById(id);

    if (!subCategory) {
      return res.status(404).send("SubCategory not found");
    }

    // get all categories
    const categories = await CategoryModel.find().sort({ createdAt: -1 });

    // render edit page
    res.render("Sub-category/edit-SubCategory", {
      subCategory,
      categories,
      layout: false,
    });
  } catch (error) {
    console.log("Edit Page Error:", error);
  }
};

// UPDATE THE DATA(edit)
export const editSubCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;

    if (!name || !category) {
      return res.send("Name and category are required");
    }

    let updateData = { name, category };

    if (req.file) {
      const upload = await uploadImageCloudinary(req.file);
      updateData.image = upload.url;
    }

    await subCategoryModel.findByIdAndUpdate(id, updateData, { new: true });

    res.redirect("/sub-category");
  } catch (error) {
    console.log("Update Error:", error);
    res.status(500).send("Server Error");
  }
};
// DELETE CATEGORY

export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting SubCategory:", req.params.id);

    // check products using this sub category
    const checkProduct = await ProductModel.countDocuments({
      subCategory: { $in: [id] },
    });

    if (checkProduct > 0) {
      return res
        .status(400)
        .send("SubCategory already used in products. Cannot delete.");
    }

    await subCategoryModel.deleteOne({ _id: id });

    console.log("SubCategory deleted");

    res.redirect("/sub-category");
  } catch (error) {
    console.log(error);
    res.status(500).send("Delete failed");
  }
};
