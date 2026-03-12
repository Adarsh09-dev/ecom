import CategoryModel from "../models/Category-Model.js";
import subCategoryModel from "../models/subCategory-Model.js";
import ProductModel from "../models/Product-Models.js";
import uploadImageCloudinary from "../utils/uploadImagesCloudinary.js";

export const addProductPage = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    const subCategories = await subCategoryModel.find();

    console.log(categories);
    console.log(subCategories);
    res.render("Product/product-page", {
      categories,
      layout: false,
      subCategories,
    });
  } catch (error) {
    console.log(error);
  }
};

export const listProductsPage = async (req, res) => {
  try {
    const products = await ProductModel.find()
      .populate("categoryId")
      .populate("subCategoryId")
      .sort({ createdAt: -1 });

    res.render("product/product-list", {
      products,
      layout: false,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Failed to load products");
    res.redirect("/");
  }
};

export const createProductController = async (req, res) => {
  try {
    const {
      name,
      categoryId,
      subCategoryId,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    } = req.body;
    const image = req.file;

    if (
      !name ||
      !image ||
      !categoryId ||
      !subCategoryId ||
      !unit ||
      !price ||
      !description
    ) {
      req.flash("error", "Please enter all required fields");
      return res.redirect("/product");
    }

    let updateData = {
      name,
      category: categoryId,
      subCategory: subCategoryId,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    };

    if (image) {
      const uploadResult = await uploadImageCloudinary(image);
      updateData.image = uploadResult.url;
    }

    const product = new ProductModel(updateData);
    const saveProduct = await product.save();

    req.flash("success", "Product created successfully!");
    return res.redirect("/product");
  } catch (error) {
    console.log("Product creation error:", error);
    req.flash("error", "Failed to create product. Please try again.");
    return res.redirect("/product");
  }
};
