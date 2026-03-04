import { Router } from "express";
import { redirectAuthenticated } from "../middleware/auth.js";
import { AddCategoryController } from "../controllers/categoryController.js";

const categoryRouter = Router();

categoryRouter.post(
  "/add-category",
  redirectAuthenticated,
  AddCategoryController,
);

export default categoryRouter;
