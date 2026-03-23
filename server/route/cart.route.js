import { Router } from "express";

import {
  addToCartItemController,
  getCartPageController,

} from "../controllers/cartController.js"; 

const cartRouter = Router();

cartRouter.post("/create", addToCartItemController);
cartRouter.get("/",getCartPageController)



export default cartRouter;
