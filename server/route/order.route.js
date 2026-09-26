import { Router } from "express";
import { CashOnDeliveryOrderController,
    paymentController
 } from "../controllers/order.Controller.js";

const orderRouter = Router()

 orderRouter.post("/cash-on-delivery",CashOnDeliveryOrderController);
 orderRouter.post("/payment",paymentController);
 

export default orderRouter
