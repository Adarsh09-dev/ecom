import { Router } from "express";
import {
  createProductController,
  addProductPage,
  listProductsPage,
  productDetails,
  deleteProduct,
  editProductPage,
  editProductController
} from "../controllers/productConrtoller.js";
import upload from "../middleware/multer.js";

const productRouter = Router();

productRouter.get("/", listProductsPage);
productRouter.get("/add", addProductPage);
productRouter.post("/", upload.single("image"), createProductController);
productRouter.get("/details/:id", productDetails);
productRouter.delete("/:id", deleteProduct);
productRouter.get("/edit/:id", editProductPage);
productRouter.put("/update/:id", upload.single("image"), editProductController);


export default productRouter;
