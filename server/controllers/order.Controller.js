import OrderModel from "../models/Order-Model.js";
import UserModel from "../models/User-Model.js";
import CartProductModel from "../models/cartProduct-Model.js"
import AddressModel from "../models/Address-Model.js";
import mongoose from "mongoose";



export const CashOnDeliveryOrderController = async (req, res) => {
    try {

        const userId = req.session.user.id;
        const {
            list_items,
            totalAmt,
            addressId,
            subTotalAmt
        } = req.body;



        console.log("========== COD ORDER ==========");

        console.log("USER ID =", userId);
        console.log("REQ.BODY =", req.body);
        console.log("REQ.PARAMS =", req.params);


        console.log("list_items =", list_items);
        console.log("totalAmt =", totalAmt);
        console.log("addressId =", addressId);
        console.log("subTotalAmt =", subTotalAmt);

        // 1. Validate the selected address
        if (!addressId) {

            return res.status(400).json({
                message: "Please select a delivery address",
                error: true,
                success: false
            });

        }


        // 2. Get the user's cart from MongoDB
        const cartItems = await CartProductModel
            .find({ userId: userId })
            .populate("productId");


        console.log("CART ITEMS =", cartItems);


        // 3. Check whether the cart is empty
        if (cartItems.length === 0) {

            return res.status(400).json({
                message: "Your cart is empty",
                error: true,
                success: false
            });

        }

        const payload = list_items.map(el => {
            return ({

                userId: userId,

                orderId: `ORD-${new mongoose.Types.ObjectId()}`,

                productId: el.productId._id,

                product_detials: {
                    name: el.productId.name,
                    Image: el.productId.Image,
                },

                paymentId: "",

                paymenat_status: "CASH ON DELIVERY",

                delivery_address: addressId,

                subTotalAmt: subTotalAmt,

                totalAmt: totalAmt,

                // Invoice_recept :


            })
        })

        const generatedOrder = await OrderModel.insertMany(payload);

        /// remove from the cart
        const removeCartItems = CartProductModel.deleteMany({ userId: userId })
        const updateInUser = UserModel.updateOne({ _id: userId }, { shopping_cart: [] })



        return res.json({
            message: "Order successfully",
            error: false,
            success: true,
            data: generatedOrder
        })

        console.log("===============================");

    } catch (error) {

        console.log("COD ERROR =", error);

        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};