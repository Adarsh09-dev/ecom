import { response } from "express";
import CartProductModel from "../models/cartProduct-Model.js";
import UserModel from "../models/User-Model.js";
import session from "express-session";
import flash from "connect-flash";
import ProductModel from "../models/Product-Models.js";

// ADD PRODUCT TO CART
export const addToCartItemController = async (req, res) => {
  try {
    if (!req.session.user?.id) {
      req.flash("error", "Please sign in to add products to your shopping cart.");
      return res.redirect("/login");
    }

    const userId = req.session.user.id;
    const { productId, quantity } = req.body;

    if (!productId) {
      req.flash("error", "The selected product could not be found.");
      return res.redirect("back");
    }

    const qty = parseInt(quantity, 10) || 1;

    if (qty < 1) {
      req.flash("error", "Please select a valid quantity.");
      return res.redirect(`/product/details/${productId}`);
    }

    const product = await ProductModel.findById(productId);

    if (!product) {
      req.flash("error", "Product not found.");
      return res.redirect("back");
    }

    const existingItem = await CartProductModel.findOne({
      userId,
      productId,
    });

    if (existingItem) {
      existingItem.quantity += qty;
      await existingItem.save();

      req.flash("success", "Cart quantity updated successfully.");
      return res.redirect(`/product/details/${productId}`);
    }

    await CartProductModel.create({
      userId,
      productId,
      quantity: qty,
    });

    req.flash("success", "Product added to your shopping cart successfully.");

    return res.redirect(`/product/details/${productId}`);

  } catch (error) {
    console.error(error);

    req.flash(
      "error",
      "We couldn't add the product to your shopping cart. Please try again."
    );

    return res.redirect("back");
  }
};

// export const addToCartItemController = async (req, res) => {
//   console.log("==== START ====");

//   try {
//     // Check user session
//     if (!req.session.user || !req.session.user.id) {
//       console.log("No session user");

//       req.flash("error", "Please sign in to add products to your shopping cart.");
//       return res.redirect("/login");
//     }

//     const userId = req.session.user.id;
//     console.log("UserId:", userId);

//     const { productId, quantity } = req.body;

//     console.log("ProductId:", productId);
//     console.log("Quantity:", quantity);

//     // Validate product ID
//     if (!productId) {
//       console.log("ProductId missing");

//       req.flash("error", "The selected product could not be found.");
//       return res.redirect("back");
//     }

//     const qty = parseInt(quantity, 10) || 1;

//     if (qty < 1) {
//       req.flash("error","Please select a valid quantity.");
//       return res.redirect(`/product/details/${productId}`);
//     }

//     const product = await ProductModel.findById(productId);

//     if (!product) {
//       req.flash("error","Product not found.")
//       return res.redirect("back");
//     }

//     // Check if product already exists in cart
//     const checkItemCart = await CartProductModel.findOne({
//       userId,
//       productId,
//     });

//     const existingItem = await CartProductModel.findOne({
//       userId,
//       productId
//     });

//     if (existingItem) {
//       existingItem.quantity += qty;
//       await existingItem.save();

//       req.flash("success","Cart quantity updated successfully.");
//       return res.redirect(`/product/details/${productId}`);
//     }

//     await CartProductModel.create({
//       userId,
//       productId,
//       quantity: qty,
//     });


//     if (checkItemCart) {
//       console.log("Item already exists");

//       req.flash("warning", "This product is already in your shopping cart.");
//       return res.redirect(`/product/details/${productId}`);
//     }

//     // Create new cart item
//     const cartItem = new CartProductModel({
//       quantity: quantity || 1,
//       userId,
//       productId,
//     });

//     await cartItem.save();
//     console.log("Cart item saved");

//     // Update user's shopping cart
//     await UserModel.updateOne(
//       { _id: userId },
//       {
//         $push: {
//           shopping_cart: productId,
//         },
//       }
//     );

//     console.log("User cart updated");

//     req.flash("success", "Product has been added to your shopping cart successfully.");

//     // Redirect to product details page
//     return res.redirect(`/product/details/${productId}`);

//   } catch (error) {
//     console.log("ERROR:", error.message);

//     req.flash(
//       "error",
//       "We couldn't add the product to your shopping cart. Please try again."
//     );

//     return res.redirect("back");
//   }
// };

// GET CART PAGE
// GET CART PAGE
export const getCartPageController = async (req, res) => {
  try {
    // Check session
    if (!req.session.user || !req.session.user.id) {
      req.flash("error", "Please sign in to access your shopping cart.");
      return res.redirect("/login");
    }

    const userId = req.session.user.id;

    // Get cart items with product details
    const cartItems = await CartProductModel.find({
      userId,
    }).populate("productId");

    console.log("Cart Items:", cartItems);

    //Cart quantiy and shipment count and price 
    let total = 0;
    let deliveryCharge = 0;

    if (cartItems.length > 0) {
      deliveryCharge = 50;

      cartItems.forEach(item => {
        total += item.productId.price * item.quantity;
      });
    }

    const grandTotal = total + deliveryCharge;


    // Render EJS
    return res.render("Cart/cartPage", {
      cartItems,
      total,
      deliveryCharge,
      grandTotal
    });

  } catch (error) {
    console.log("ERROR:", error.message);

    req.flash(
      "error",
      "We couldn't load your shopping cart. Please try again."
    );

    return res.redirect("/");
  }
};


// UPDATE QUANTITY CONTROLLER
export const updateCartQuantityController = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { cartItemId, action } = req.body;

    const cartItem = await CartProductModel.findOne({
      _id: cartItemId,
      userId,
    });

    if (!cartItem) {
      req.flash("error", "The selected cart item could not be found.");
      return res.redirect("/cart");
    }

    // Increase quantity
    if (action === "increase") {
      cartItem.quantity += 1;

      await cartItem.save();

      req.flash(
        "success",
        "Product quantity has been updated successfully."
      );

      return res.redirect("/cart");
    }

    // Decrease quantity
    if (action === "decrease") {
      cartItem.quantity -= 1;

      // Remove item if quantity reaches 0
      if (cartItem.quantity <= 0) {
        await CartProductModel.deleteOne({ _id: cartItemId });

        req.flash(
          "sucess",
          "Product has been removed from your shopping cart."
        );

        return res.redirect("/cart");
      }

      await cartItem.save();

      req.flash(
        "success",
        "Product quantity has been updated successfully."
      );

      return res.redirect("/cart");
    }

    req.flash("warning", "Invalid cart update request.");
    return res.redirect("/cart");

  } catch (error) {
    console.log(error);

    req.flash(
      "error",
      "We couldn't update your shopping cart. Please try again."
    );

    return res.redirect("/cart");
  }
};
