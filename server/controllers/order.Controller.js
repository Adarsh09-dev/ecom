import stripe from "../config/stripe.js";
import OrderModel from "../models/Order-Model.js";
import UserModel from "../models/User-Model.js";
import CartProductModel from "../models/cartProduct-Model.js"
import AddressModel from "../models/Address-Model.js";
import mongoose from "mongoose";




export const CashOnDeliveryOrderController = async (req, res) => {
    try {

        const userId = req.session.user.id;
        const {
            // list_items,
            totalAmt,
            addressId,
            subTotalAmt
        } = req.body;



        console.log("========== COD ORDER ==========");

        console.log("USER ID =", userId);
        // console.log("REQ.BODY =", req.body);
        // console.log("REQ.PARAMS =", req.params);



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

        const payload = cartItems.map(el => {
            return ({

                userId: userId,


                orderId: `ORD-${new mongoose.Types.ObjectId()}`,

                productId: el.productId._id,



                product_detials: {
                    name: el.productId.name,
                    image: el.productId.image,
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
        const removeCartItems = await CartProductModel.deleteMany({ userId: userId })
        const updateInUser = await UserModel.updateOne({ _id: userId }, { shopping_cart: [] })


        console.log("ORDER CREATED SUCCESSFULLY");

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


export const priceWithDiscount = (price, dis = 0) => {

    const productPrice = Number(price);
    const discount = parseFloat(dis) || 0;

    const discountAmount =
        Math.ceil((productPrice * discount) / 100);

    const actualPrice =
        productPrice - discountAmount;

    return actualPrice;
};


export const paymentController = async (req, res) => {

    console.log("========== PAYMENT START ==========");

    try {

        // 1. Logged-in user
        const userId = req.session.user.id;

        console.log("USER ID =", userId);


        // 2. Get address ID from normal HTML form
        const { addressId } = req.body;

        console.log("ADDRESS ID =", addressId);


        // 3. Validate address
        if (!addressId) {
            req.flash("error", "Please select a delivery address");
            return res.redirect("/address/checkout");
        }


        // 4. Find user
        const user = await UserModel.findById(userId);

        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/address/checkout");
        }

        console.log("USER FOUND =", user.email);


        // 5. Find address belonging to this user
        const address = await AddressModel.findOne({
            _id: addressId,
            userId: userId
        });

        if (!address) {
            req.flash("error", "Invalid delivery address");
            return res.redirect("/address/checkout");
        }


        // 6. Get cart
        const cartItems = await CartProductModel
            .find({ userId })
            .populate("productId");


        if (cartItems.length === 0) {
            req.flash("error", "Your cart is empty");
            return res.redirect("/address/checkout");
        }

        console.log("CART ITEMS =", cartItems.length);


        // 7. Create Stripe line items
        const line_items = cartItems.map(item => {

            const product = item.productId;

            if (!product) {
                throw new Error("Product not found in cart");
            }


            const finalPrice = priceWithDiscount(
                product.price,
                product.discount
            );


            return {

                price_data: {

                    currency: "inr",

                    product_data: {
                        name: product.name
                    },

                    unit_amount: Math.round(finalPrice * 100)

                },

                quantity: item.quantity

            };

        });


        console.log("LINE ITEMS =", line_items);


        // 8. Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({

            mode: "payment",

            payment_method_types: ["card"],

            customer_email: user.email,

            line_items: line_items,

            metadata: {

                userId: userId.toString(),

                addressId: addressId.toString()

            },

            success_url:
                `http://localhost:${process.env.PORT}/order/success?session_id={CHECKOUT_SESSION_ID}`,

            cancel_url:
                `http://localhost:${process.env.PORT}/cancel`

        });


        console.log("STRIPE SESSION CREATED");

        console.log("SESSION ID =", session.id);

        console.log("SESSION URL", session.url);


        return res.json({
            success: true,
            url: session.url
        });



    } catch (error) {

        console.log(
            "========== PAYMENT ERROR =========="
        );

        console.log(error);


        req.flash("error", error.message);

        return res.redirect("/address/checkout");

    }
};

export const getOrderDetailsController = async (req, res) => {

    try {
        const userId = req.userId

        const orderlist = await OrderModel.find({ userId: userId }).sort({ created: -1 });

    } catch (error) {

    }

}

export const paymentSuccessController = async (req, res) => {

    try {

        console.log("========== PAYMENT SUCCESS ==========");

        // Get session ID from Stripe URL
        const sessionId = req.query.session_id;

        console.log("SESSION ID =", sessionId);


        // Check session ID
        if (!sessionId) {

            req.flash(
                "error",
                "Payment session not found"
            );

            return res.redirect("/address/checkout");
        }


        // Get Stripe Checkout Session
        const session =
            await stripe.checkout.sessions.retrieve(sessionId);


        console.log(
            "PAYMENT STATUS =",
            session.payment_status
        );


        // Verify payment
        if (session.payment_status !== "paid") {

            req.flash(
                "error",
                "Payment was not completed"
            );

            return res.redirect("/address/checkout");
        }


        // Get metadata
        const userId = session.metadata.userId;
        const addressId = session.metadata.addressId;


        console.log("USER ID =", userId);
        console.log("ADDRESS ID =", addressId);


        // Amount is stored by Stripe in paise
        const amount = session.amount_total / 100;


        // Current date
        const date = new Date().toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


        // Render success page
        // return res.render(
        //     "Checkout/payment-success",
        //     {

        //         transactionId: session.id,

        //         amount: amount.toFixed(2),

        //         date: date,

        //         paymentType: "Card"

        //     }
        // );

        return res.render("payment-success", {
            transactionId: session.id,

            amount: (session.amount_total / 100).toFixed(2),

            date: new Date().toLocaleDateString("en-IN"),

            paymentType: "Card"
        });


    } catch (error) {

        console.log(
            "========== PAYMENT SUCCESS ERROR =========="
        );

        console.log(error);

        req.flash(
            "error",
            "Unable to verify payment"
        );

        return res.redirect("/address/checkout");
    }
};