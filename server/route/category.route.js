import { Router } from "express";
import { isAuthenticated, redirectAuthenticated } from "../middleware/auth.js";
import {
  // AddCategoryController,
  categoryPage,
  AddCategoryPage,
  createCategory,
} from "../controllers/categoryController.js";
import upload from "../middleware/multer.js";

const categoryRouter = Router();

categoryRouter.get("/category-p", isAuthenticated, categoryPage);

categoryRouter.get("/add-category", AddCategoryPage);
categoryRouter.post(
  "/",
  isAuthenticated,
  upload.single("image"),
  createCategory,
);

export default categoryRouter;
