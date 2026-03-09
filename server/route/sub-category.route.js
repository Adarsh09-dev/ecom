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
import { isAuthenticated } from "../middleware/auth.js";

const subCatgoryRouter = Router();

subCatgoryRouter.get("/", isAuthenticated, SubCategoryPage);

subCatgoryRouter.get("/add-subcategory", isAuthenticated, addSubCategoryPage);

subCatgoryRouter.post(
  "/add-sub-category",
  isAuthenticated,
  upload.single("image"),
  AddSubCategoryController,
);

subCatgoryRouter.delete("/:id", isAuthenticated, deleteSubCategory);

subCatgoryRouter.get("/edit/:id", isAuthenticated, editSubCategoryPage);

subCatgoryRouter.put(
  "/update/:id",
  isAuthenticated,
  upload.single("image"),
  editSubCategoryController,
);

// USER SIDE
export default subCatgoryRouter;
