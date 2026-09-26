import stripe from "../config/stripe.js";
import OrderModel from "../models/Order-Model.js";
import UserModel from "../models/User-Model.js";
import CartProductModel from "../models/cartProduct-Model.js"
// import AddressModel from "../models/Address-Model.js";
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


// export const priceWithDiscount = async (price, dis = 1) => {
//     const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
//     const actualPrice = Number(price) - Number(discountAmout)
//     return actualPrice
// };

export const priceWithDiscount = (price, dis = 1) => {

    const discountAmount =
        Math.ceil((Number(price) * Number(dis)) / 100);

    const actualPrice =
        Number(price) - discountAmount;

    return actualPrice;
};

// export const paymentController = async (req, res) => {

//     try {

//         const userId = req.session.user.id
//         const { list_items, totalAmt, addressId, subTotalAmt } = req.body

//         const user = await UserModel.findById(userId)


//         const line_items = line_items.map(item => {
//             return {
//                 price_data: {
//                     currency: "inr",
//                     product_data: {
//                         name: item.productId.name,
//                         image: item.productId.image,
//                         metadata: {
//                             productId: item.productId._id,
//                         }
//                     },

//                     unit_amount: priceWithDiscount(item.productId.price, item.productId.discount) * 100
//                 },
//                 adjustable_quantity: {
//                     enabled: true,
//                     minimum: 1,
//                 },
//                 quantity: item.quantity,

//             }
//         })

//         const params = {
//             submit_type: `pay`,
//             mode: `payment`,
//             payment_method_type: ['card'],
//             customer_email: user.email,
//             metadata: {
//                 userId: userId,
//                 addressId: addressId,

//             },
//             line_items: line_items,
//             success_url: `${process.env.PORT}/success`,
//             cancel_url: `${process.env.PORT}/cancel`,
//         }

//         const session = await Stripe.Checkout.sessions.create(params)

//         return res.status(303).json()

//     } catch (error) {

//     }
// return res.status(500).json({
//     message : error.message || error,
//     error : true,
//     sucess : false
// })
// }


// export const paymentController = async (req, res) => {

//     console.log('................1....................');


//     try {

//         console.log('................2....................');

//         const userId = req.session.user.id;

//         console.log('................3....................');

//         // Get user
//         const user = await UserModel.findById(userId);

//         console.log('................4....................');

//         if (!user) {
//             console.log('................1....................');
//             return res.send("User not found");
//         }

//         console.log('................5....................');

//         // Get cart from database
//         const cartItems = await CartProductModel
//             .find({ userId })
//             .populate("productId");

//         console.log('................6....................');

//         if (cartItems.length === 0) {

//             console.log('................7....................');
//             return res.send("Your cart is empty");
//         }

//         console.log('................8....................');

//         // Create Stripe line items
//         const line_items = cartItems.map(item => {

//             console.log('................9....................');

//             const product = item.productId;

//             console.log('................10....................');

//             const finalPrice = priceWithDiscount(
//                 product.price,
//                 product.discount
//             );

//             console.log('................11....................');

//             return {


//                 price_data: {
//                     currency: "inr",

//                     product_data: {
//                         name: product.name
//                     },

//                     unit_amount: Math.round(finalPrice * 100)
//                 },

//                 quantity: item.quantity
//             };


//         });

//         console.log('................12....................');

//         // Create Stripe Checkout Session
//         const session = await stripe.checkout.sessions.create({

//             mode: "payment",

//             payment_method_types: ["card"],

//             customer_email: user.email,

//             line_items: line_items,

//             success_url:
//                 `http://localhost:${process.env.PORT}/success`,

//             cancel_url:
//                 `http://localhost:${process.env.PORT}/cancel`
//         });

//         console.log('................13....................');
//         console.log("STRIPE =", stripe);
//         console.log("STRIPE CHECKOUT =", stripe.checkout);

//         console.log('................14....................');

//         // Redirect to Stripe
//         return res.redirect(303, session.url);


//     } catch (error) {

//         console.log('................15. ERROR ..................');

//         console.log("STRIPE ERROR =", error);

//         return res.send(`Payment Error: ${error.message}`);
//     }
// };

export const paymentController = async (req, res) => {

    console.log("========== PAYMENT START ==========");

    try {

        // 1. Get logged-in user
        const userId = req.session.user.id;

        console.log("USER ID =", userId);

        // 2. Find user
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).send("User not found");
        }

        console.log("USER FOUND =", user.email);

        // 3. Get cart
        const cartItems = await CartProductModel
            .find({ userId })
            .populate("productId");

        if (cartItems.length === 0) {
            return res.status(400).send("Your cart is empty");
        }

        console.log("CART ITEMS =", cartItems.length);

        // 4. Create Stripe line items
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

        // 5. Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({

            mode: "payment",

            payment_method_types: ["card"],

            customer_email: user.email,

            line_items: line_items,

            success_url:
                `http://localhost:${process.env.PORT}/success`,

            cancel_url:
                `http://localhost:${process.env.PORT}/cancel`
        });

        // 6. Check Stripe response
        console.log("STRIPE SESSION CREATED");
        console.log("SESSION ID =", session.id);
        console.log("SESSION URL =", session.url);

        // 7. Redirect user to Stripe Checkout
        return res.redirect(session.url);

    } catch (error) {

        console.log("========== PAYMENT ERROR ==========");
        console.log(error);

        return res.status(500).send(
            `Payment Error: ${error.message}`
        );
    }
};