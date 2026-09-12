import CategoryModel from "../models/Category-Model.js";
import subCategoryModel from "../models/subCategory-Model.js";
import ProductModel from "../models/Product-Models.js";
import uploadImageCloudinary from "../utils/uploadImagesCloudinary.js";

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
  console.log("....................................................Loading add product page....1..................................");
  try {
    const categories = await CategoryModel.find();
    console.log("....................................................Loading add product page....2..................................");
    const subCategories = await subCategoryModel.find();
    console.log("....................................................Loading add product page....3..................................");

    console.log(categories);
    console.log("....................................................Loading add product page....4..................................");
    console.log(subCategories);
    console.log("....................................................Loading add product page....5..................................");
    res.render("Product/product-page", {
      categories,
      layout: false,
      subCategories,
    });
    console.log("....................................................Loading add product page....6..................................");
  } catch (error) {
    console.log(error);
  }
};

// CREATE PRODUCTS (upload product detials)
export const createProductController = async (req, res) => {
  console.log("....................................................Creating product....1..................................");
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
    console.log("....................................................Creating product....1..................................");

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
      console.log("....................................................Creating product....2..................................");
      return res.redirect("/product");
       console.log("....................................................Creating product....3..................................");

    }
     console.log("....................................................Creating product....4..................................");

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

    console.log("....................................................Creating product....5..................................");
    if (image) {
       console.log("....................................................Creating product....6..................................");
      const uploadResult = await uploadImageCloudinary(image);
      console.log('..................uploadResult..................................................................',uploadResult);
        console.log("....................................................Creating product....7..................................");     
      updateData.image = uploadResult.url;
    }

    const product = new ProductModel(updateData);
    const saveProduct = await product.save();

    console.log("....................................................Creating product....8..................................");
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

    res.render("Product/product-details", {
      product,
    });
  } catch (error) {
    console.log(error);
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

 // find the product by id and delete it 
 const deletedProduct = await ProductModel.countDocuments({
  productId: { $in: [id]},
 });
 
 if (deletedProduct > 0) {
  return res.status(400).send("Cannot delete product. It is associated with exiting records.")
 }

 await ProductModel.deleteOne( {_id: id });

   console.log("Product deleted successfully:", id);

   res.redirect("/product");
  } catch (error) {
    console.log("Product deletion error:", error);
    res.status(500).send("Failed to delete product.");
  }
}; 
// EDIT PRODUCT PAGE
export const editProductPage = async (req, res) => {
  try {
    const { id} = req.params;
    const product = await ProductModel.findById(id);
    res.render("product/edit-product", {
      product,
      categories: await CategoryModel.find(),
      subCategories: await subCategoryModel.find(),
      layout: false,
    })
  } catch (error) {
  console.log("Edit product page error:", error);
}
} 

// UPDATE THE DATA (edit)
export const editProductController = async (req, res) => {
  try {
    const { id} = req.params;
    const { name, categoryId, subCategoryId, unit, stock, price, discount, description, more_details } = req.body;
    
    if (!name || !categoryId || !subCategoryId || !unit || !price || !description) {
      return res.send("Please enter all requiried fields");
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
  more_details
};

    if (req.file) {
      const uploadResult = await uploadImageCloudinary(req.file);
       updateData.image = uploadResult.url;
    }
    await ProductModel.findByIdAndUpdate(id, updateData, { new: true })
    res.redirect("/product")
  } catch (error) {
    console.log("Product update error:", error);
    res.status(500).send("Failed to update product.");
  }
};
