import { Router } from "express";
import { isAuthenticated, redirectAuthenticated } from "../middleware/auth.js";
import {
  // AddCategoryController,
  categoryPage,
  AddCategoryPage,
  createCategory,
  editCategoryPage,
  updatCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import upload from "../middleware/multer.js";

const categoryRouter = Router();

categoryRouter.get("/", isAuthenticated, categoryPage);

categoryRouter.get("/add-category", AddCategoryPage);
categoryRouter.post(
  "/",
  isAuthenticated,
  upload.single("image"),
  createCategory,
);
categoryRouter.get("/edit/:id", isAuthenticated, editCategoryPage);
categoryRouter.put(
  "/update/:id",
  isAuthenticated,
  upload.single("image"),
  updatCategory,
);
categoryRouter.delete("/:id", isAuthenticated, deleteCategory);

export default categoryRouter;
