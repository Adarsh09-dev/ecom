import { response } from "express";
import CartProductModel from "../models/cartProduct-Model.js";
import UserModel from "../models/User-Model.js";

export const addToCartItemController = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("userid:",userId)
    const { productId } = req.body;

    if (!productId) {
      return res.status(402).send("Provide product");
    }

    const checkItemCart = await CartProductModel.findOne({
      userId: userId,
      productId: productId,
    });

    if (checkItemCart) {
      return res.status(400).json({
        message: "item already in cart",
      });
    }

    const cartItem = new CartProductModel({
      quantity: 1,
      userId: userId,
      productId: productId,
    });

    const save = await cartItem.save();

    const updateCartUser = await UserModel.updateOne(
      { _id: userId },
      {
        $push: {
          shopping_cart: productId,
        },
      },
    );

    return res.redirect("/products");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export const getCartItemController = async (req, res) => {
  try {
    const userId = req.userId;

    const cartItem = await CartProductModel.findOne({
      userId: userId,
    }).populate("productId");

    return res.send({
      data: cartItem,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export const updateCartItemQtyController = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id, qty } = req.body;

    if (!_id || !qty) {
      return response.status(400).json({
        message: "provide _id, qty",
      });
    }

    const updateCartitem = await CartProductModel.updateOne(
      {
        _id: _id,
      },
      {
        quatity: qty,
      },
    );

    return;
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
