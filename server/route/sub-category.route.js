import { Router } from "express";
import {
  AddSubCategoryController,
  addSubCategoryPage,
  SubCategoryPage,
  
} from "../controllers/subCategoryController.js";
import upload from "../middleware/multer.js";

const subCatgoryRouter = Router();

subCatgoryRouter.get("/", SubCategoryPage);
subCatgoryRouter.get("/add-subcategory", addSubCategoryPage);
subCatgoryRouter.post("/add-subcategory", AddSubCategoryController);

export default subCatgoryRouter;
 