import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: image,
      default: [],
    },
    categoryId: [{ type: mongoose.Schema.ObjectId, ref: "category" }],
    subCategoryId: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
      },
    ],
    unit: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: null,
    },
    price: {
      type: Number,
      default: null,
    },
    discount: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
    more_detials: {},
    publish: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);



const ProductModel = mongoose.model('product',productSchema)

export default productSchema
