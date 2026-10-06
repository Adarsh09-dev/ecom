import { Router } from "express";
import {
    CashOnDeliveryOrderController,
    paymentController,
    getOrderDetailsController,
    paymentSuccessController
} from "../controllers/order.Controller.js";

const orderRouter = Router()

orderRouter.post("/cash-on-delivery", CashOnDeliveryOrderController);
orderRouter.post("/payment", paymentController);
orderRouter.get("/order-list", getOrderDetailsController);
orderRouter.get("/success", paymentSuccessController);



export default orderRouter
