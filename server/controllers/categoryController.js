import CategoryModel from "../models/Category-Model.js";
import uploadImageCloudinary from "../utils/uploadImagesCloudinary.js";
import ProductModel from "../models/Product-Models.js";
import subCategoryModel from "../models/subCategory-Model.js";

export const categoryPage = async (req, res) => {
  const categories = await CategoryModel.find().sort({ createdAt: -1 });

  res.render("Category/category-page", {
    layout: false,
    categories,
  });
};

export const AddCategoryPage = async (req, res) => {
  const categories = await CategoryModel.find();

  res.render("Category/add-categoryPage", { layout: false, categories });
};

export async function createCategory(req, res) {
  try {
    const { name } = req.body;
    const image = req.file;
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    let updateData = {
      name,
    };

    if (image) {
      const uploadResult = await uploadImageCloudinary(image);
      updateData.image = uploadResult.url;
    }

    const newCategory = new CategoryModel(updateData);
    await newCategory.save();
    console.log("Category Saved:", newCategory);

    return res.redirect("/category");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

// EDIT CATEGORY
export const editCategoryPage = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CategoryModel.findById(id);
    console.log("...id...", category);

    res.render("Category/edit-categoryPage", {
      layout: false,
      category,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send("Server Error");
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

    await CategoryModel.findByIdAndUpdate(id, updateData, { new: true });
    res.redirect("/category");
  } catch (error) {
    console.log(error);
    res.status(500).send("update failed");
  }
};

//DELETE CATEGORY

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
      return res.status(400).send("Category is already used. Cannot delete.");
    }

    await CategoryModel.deleteOne({ _id: id });
    console.log("Category deleted");

    res.redirect("/category");
  } catch (error) {
    console.log(error);
    res.status(500).send("Delete failed");
  }
};

