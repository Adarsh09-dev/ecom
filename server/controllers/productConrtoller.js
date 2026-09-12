import CategoryModel from "../models/Category-Model.js";
import subCategoryModel from "../models/subCategory-Model.js";
import ProductModel from "../models/Product-Models.js";
import uploadImageCloudinary from "../utils/uploadImagesCloudinary.js";
import session from "express-session";
import flash from "connect-flash";

// PRODUCT LIST
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

// CREATE PRODUCT PAGE
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

// CREATE PRODUCTS (upload product detials)
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

// get-product by cagtegory and subcategory

export const productDetails = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await ProductModel.findById(productId);

    if (!product) {
      req.flash("error", "The requested product could not be found.");
      return res.redirect("/product");
    }

    res.render("Product/product-details", {
      product,
    });
  } catch (error) {
    console.log(error);

    req.flash(
      "error",
      "We couldn't load the product details. Please try again."
    );

    return res.redirect("/product");
  }
};

// DELETE PRODUCT
// export const deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//  // find the product by id and delete it 
//  const deletedProduct = await ProductModel.countDocuments({
//   productId: { $in: [id]},
//  });

//  if (deletedProduct > 0) {
//   return res.status(400).send("Cannot delete product. It is associated with exiting records.")
//  }

//  await ProductModel.deleteOne( {_id: id });

//    console.log("Product deleted successfully:", id);

//    res.redirect("/product");
//   } catch (error) {
//     console.log("Product deletion error:", error);
//     res.status(500).send("Failed to delete product.");
//   }
// }; 

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id);

    if (!product) {
      req.flash("error", "The requested product could not be found.");
      return res.redirect("/product");
    }

    await ProductModel.findByIdAndDelete(id);

    console.log("Product deleted successfully:", id);

    req.flash("success", "Product has been deleted successfully.");

    return res.redirect("/product");

  } catch (error) {
    console.log("Product deletion error:", error);

    req.flash(
      "error",
      "We couldn't delete the product. Please try again."
    );

    return res.redirect("/product");
  }
};


// EDIT PRODUCT PAGE
export const editProductPage = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id);

    if (!product) {
      req.flash("error", "The requested product could not be found.");
      return res.redirect("/product");
    }

    res.render("product/edit-product", {
      product,
      categories: await CategoryModel.find(),
      subCategories: await subCategoryModel.find(),
      layout: false,
    });

  } catch (error) {
    console.log("Edit product page error:", error);

    req.flash(
      "error",
      "We couldn't load the product details. Please try again."
    );

    return res.redirect("/product");
  }
};

// UPDATE THE DATA (edit)
export const editProductController = async (req, res) => {
  try {
    const { id } = req.params;

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

    if (
      !name ||
      !categoryId ||
      !subCategoryId ||
      !unit ||
      !price ||
      !description
    ) {
      req.flash("warning", "Please complete all required fields.");
      return res.redirect(`/product/edit/${id}`);
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

    if (req.file) {
      const uploadResult = await uploadImageCloudinary(req.file);
      updateData.image = uploadResult.url;
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      req.flash("error", "The requested product could not be found.");
      return res.redirect("/product");
    }

    req.flash("success", "Product has been updated successfully.");

    return res.redirect("/product");

  } catch (error) {
    console.log("Product update error:", error);

    req.flash(
      "error",
      "We couldn't update the product. Please try again."
    );

    return res.redirect("/product");
  }
};
