import { Router } from "express";
import {
  createProductController,
  addProductPage,
  listProductsPage,
  productDetials
} from "../controllers/productConrtoller.js";
import upload from "../middleware/multer.js";

const productRouter = Router();

productRouter.get("/", listProductsPage);
productRouter.get("/add", addProductPage);
productRouter.post("/", upload.single("image"), createProductController);
productRouter.get("/detials/:id",productDetials);

export default productRouter;
