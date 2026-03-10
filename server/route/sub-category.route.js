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
import { isAuthenticatedAdmin } from "../middleware/admin-auth.js";
isAuthenticatedAdmin;

const subCatgoryRouter = Router();

subCatgoryRouter.get("/", isAuthenticatedAdmin, SubCategoryPage);

subCatgoryRouter.get(
  "/add-subcategory",
  isAuthenticatedAdmin,
  addSubCategoryPage,
);

subCatgoryRouter.post(
  "/add-sub-category",
  isAuthenticatedAdmin,
  upload.single("image"),
  AddSubCategoryController,
);

subCatgoryRouter.delete("/:id", isAuthenticatedAdmin, deleteSubCategory);

subCatgoryRouter.get("/edit/:id", isAuthenticatedAdmin, editSubCategoryPage);

subCatgoryRouter.put(
  "/update/:id",
  isAuthenticatedAdmin,
  upload.single("image"),
  editSubCategoryController,
);

// USER SIDE
export default subCatgoryRouter;
