import { response } from "express";
import CartProductModel from "../models/cartProduct-Model.js";
import UserModel from "../models/User-Model.js";

// ADD THE PRODUCT
export const addToCartItemController = async (req, res) => {
  console.log("==== START ====");

  try {
    //  user session exists
    if (!req.session.user || !req.session.user.id) {
      console.log("No session user");
      return res.redirect("/login");
    }

    const userId = req.session.user.id;
    console.log("UserId:", userId);

    const { productId, quantity } = req.body;
    console.log("ProductId:", productId);
    console.log("Quantity:", quantity);

    //  Validate productId
    if (!productId) {
      console.log("ProductId missing");
      return res.status(400).send("Provide product");
    }

    //  Check if already in cart
    const checkItemCart = await CartProductModel.findOne({
      userId: userId,
      productId: productId,
    });

    if (checkItemCart) {
      console.log("Item already exists");
      return res.send("Item already in cart");
    }

    //  Create new cart item
    const cartItem = new CartProductModel({
      quantity: quantity || 1,
      userId: userId,
      productId: productId,
    });

    await cartItem.save();
    console.log("Cart item saved");

    //  Update user's cart array
    await UserModel.updateOne(
      { _id: userId },
      {
        $push: {
          shopping_cart: productId,
        },
      },
    );

    console.log("User cart updated");

    return res.redirect("/product");
  } catch (error) {
    console.log("ERROR:", error.message);
    return res.status(500).send(error.message);
  }
};

// GET CART PAGE
export const getCartPageController = async (req, res) => {
  try {
    // Check session
    if (!req.session.user || !req.session.user.id) {
      return res.redirect("/login");
    }

    const userId = req.session.user.id;

    // Get cart items with product details
    const cartItems = await CartProductModel.find({
      userId: userId,
    }).populate("productId"); // very important

    console.log("Cart Items:", cartItems);

    //  Render EJS
    return res.render("Cart/cartPage", {
      cartItems: cartItems,
    });
    // console.log(cartItems[0].productId.images[0]);
  } catch (error) {
    console.log("ERROR:", error.message);
    return res.send("Something went wrong");
  }
};
