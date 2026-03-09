import { Router } from "express";
import {
  AddSubCategoryController,
  addSubCategoryPage,
  SubCategoryPage,
  editSubCategoryPage,
  editSubCategoryController,
  deleteSubCategory,
} from "../controllers/subCategoryController.js";
import upload from "../middleware/multer.js";

const subCatgoryRouter = Router();

subCatgoryRouter.get("/", SubCategoryPage);
subCatgoryRouter.get("/add-subcategory", addSubCategoryPage);
subCatgoryRouter.post(
  "/add-sub-category",
  upload.single("image"),
  AddSubCategoryController,
);
subCatgoryRouter.delete("/:id", deleteSubCategory);
subCatgoryRouter.get("/edit/:id", editSubCategoryPage);
subCatgoryRouter.put(
  "/update/:id",
  upload.single("image"),
  editSubCategoryController,
);

// USER SIDE
export default subCatgoryRouter;
