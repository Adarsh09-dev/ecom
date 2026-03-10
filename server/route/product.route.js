import { Router } from "express";
import { createProductController,
    addProductPage,
    listProductsPage,

 } from "../controllers/productConrtoller.js";
import upload from "../middleware/multer.js";




const productRouter = Router()

productRouter.get("/",listProductsPage )
productRouter.get("/add",addProductPage )
productRouter.post("/",upload.single('image'),createProductController)

export default productRouter;