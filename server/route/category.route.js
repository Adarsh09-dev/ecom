import { Router } from "express";
import {
  // AddCategoryController,
  categoryPage,
  AddCategoryPage,
  addCategoryPage,
  createCategory,
  editCategoryPage,
  updatCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import upload from "../middleware/multer.js";
import { isAuthenticatedAdmin } from "../middleware/admin-auth.js";

const categoryRouter = Router();

// ADMIN SIDE
categoryRouter.get("/", isAuthenticatedAdmin, categoryPage);
categoryRouter.get("/add-category", isAuthenticatedAdmin,addCategoryPage );
categoryRouter.post(
  "/",
 
  upload.single("image"),
  AddCategoryPage,
);
categoryRouter.get("/edit/:id", isAuthenticatedAdmin, editCategoryPage);
categoryRouter.put(
  "/update/:id",
  isAuthenticatedAdmin,
  upload.single("image"),
  updatCategory,
);
categoryRouter.delete("/:id", isAuthenticatedAdmin, deleteCategory);

// USER SIDE

export default categoryRouter;
