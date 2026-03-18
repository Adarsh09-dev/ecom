import { Router } from "express";

import {
  addToCartItemController,
  getCartItemController,
  updateCartItemQtyController,
} from "../controllers/cartController.js"; 

const cartRouter = Router();

cartRouter.post("/create", addToCartItemController);
cartRouter.post("/get", getCartItemController);
cartRouter.put("/update-qty",updateCartItemQtyController);


export default cartRouter;
