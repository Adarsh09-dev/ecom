import { Router } from "express";
import { CashOnDeliveryOrderController } from "../controllers/order.Controller.js";

const orderRouter = Router()

 orderRouter.post("/cash-on-delivery",CashOnDeliveryOrderController);
 

export default orderRouter
