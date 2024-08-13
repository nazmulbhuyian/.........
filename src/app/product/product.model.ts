import { Schema, model } from "mongoose";
import { IProductInterface } from "./product.interface";

// Product Schema
const productSchema = new Schema<IProductInterface>(
  {
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    sub_category_id: {
      type: Schema.Types.ObjectId,
      ref: "subcategories",
    },
    product_color_id: {
      type: Schema.Types.ObjectId,
      ref: "colors",
    },
    product_name: {
      required: true,
      type: String,
    },
    product_slug: {
      required: true,
      type: String,
      unique: true,
    },
    product_related_slug: {
      required: true,
      type: String,
    },
    product_thumbnail: {
      required: true,
      type: String,
    },
    product_images: [
      {
        image: String,
      },
    ],
    product_status: {
      required: true,
      type: String,
      enum: ["active", "in-active"],
      default: "active",
    },
    product_description: {
      type: String,
    },
    product_price: {
      required: true,
      type: Number,
    },
    product_discount_price: {
      type: Number,
    },
    product_quantity: {
      type: Number,
    },
    product_size_variation: [
      {
        size: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: Number,
        discount_price: Number,
        description: String,
        image: String,
      },
    ],
    product_partial_payment: {
      type: Boolean,
      default: false,
    },
    product_partial_payment_amount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = model<IProductInterface>("products", productSchema);

export default ProductModel;
