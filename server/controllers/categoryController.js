import CategoryModel from "../models/Category-Model.js";
import uploadImageCloudinary from "../utils/uploadImagesCloudinary.js";

export const categoryPage = async (req, res) => {
  const categories = await CategoryModel.find();

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

    return res.redirect("/category/add-category");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
