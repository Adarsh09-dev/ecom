import { Router } from "express";

import {
  addToCartItemController,
  getCartPageController,
  updateCartQuantityController,

} from "../controllers/cartController.js"; 

const cartRouter = Router();

cartRouter.post("/create", addToCartItemController);
cartRouter.get("/",getCartPageController);
cartRouter.post("/update",updateCartQuantityController);



export default cartRouter;
