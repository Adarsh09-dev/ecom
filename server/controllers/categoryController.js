import CategoryModel from "../models/Category-Model.js";
import uploadImageCloudinary from "../utils/uploadImagesCloudinary.js";
import ProductModel from "../models/Product-Models.js";
import subCategoryModel from "../models/subCategory-Model.js";

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

export const AddCategoryPage = async (req, res) => {
  const categories = await CategoryModel.find();

  res.render("Category/add-categoryPage", { layout: false, categories });
};

export async function createCategory(req, res) {
  console.log(".......................................add category 1.........................................")
  try {
     console.log(".......................................add category 2.........................................")
    const { name } = req.body;
     console.log(".......................................add category 3.........................................")
    const image = req.file;
     console.log(".......................................add category 4.........................................")
    console.log("BODY:", req.body);
     console.log(".......................................add category 5.........................................")
    console.log("FILE:", req.file);
     console.log(".......................................add category 6.........................................")

    let updateData = {
      name,
    };
     console.log(".......................................add category 7.........................................")
    if (image) {
       console.log(".......................................add category 8.........................................")
      const uploadResult = await uploadImageCloudinary(image);
       console.log(".......................................add category 9.........................................")
      updateData.image = uploadResult.url;
       console.log(".......................................add category 10.........................................")
    }

     console.log(".......................................add category 11.........................................")
    const newCategory = new CategoryModel(updateData);
     console.log(".......................................add category 12.........................................")
    await newCategory.save();
     console.log(".......................................add category 13.........................................")
    console.log("Category Saved:", newCategory);
    console.log(".......................................add category 14.........................................")



    return res.redirect("/category");
    console.log(".......................................add category 15.........................................")
  } catch (error) {
    console.log(".......................................add category 16.........................................")
    return res.status(500).send(error.message);
    console.log(".......................................add category 17.........................................")
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
