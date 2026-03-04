import { Router } from "express";
import { isAuthenticated, redirectAuthenticated } from "../middleware/auth.js";
import { 
  AddCategoryController,
  categoryPage,
 } from "../controllers/categoryController.js";

const categoryRouter = Router();

categoryRouter.get('/products-category',isAuthenticated,categoryPage)
categoryRouter.post(
  "/add-category",
  redirectAuthenticated,
  AddCategoryController,
);

export default categoryRouter;
