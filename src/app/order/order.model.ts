import mongoose, { Schema, model } from "mongoose";
import { IOrderInterface } from "./order.interface";

// Order Schema and connect DB collection
const orderSchema = new Schema<IOrderInterface>(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    customer_phone: {
      type: String,
      required: true,
    },
    division: {
      required: true,
      type: String,
    },
    district: {
      required: true,
      type: String,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    pay_amount: {
      type: Number,
      required: true,
    },
    partial_pay_amount: {
      type: Number,
      required: true,
    },
    due_amount: {
      type: Number,
      required: true,
    },
    buying_type: {
      type: String,
      required: true,
    },
    order_type: {
      type: String,
      enum: ["pending", "success", "cancel"],
      required: true,
    },
    order_status: {
      type: String,
      enum: ["pending", "processing", "complete", "delivered"],
      required: true,
      default: "pending",
    },
    pending_time: {
      type: String,
    },
    processing_time: {
      type: String,
    },
    complete_time: {
      type: String,
    },
    delivered_time: {
      type: String,
    },
    payment_method: {
      type: String,
      enum: ["online", "cod", "partial"],
      required: true,
    },
    online_payment_method: {
      type: String,
      enum: ["ssl_commerz", "stripe"],
    },
    payment_type: {
      type: String,
      enum: ["paid", "un-paid", "partial-paid"],
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["pending", "success"],
      required: true,
    },
    delivery_method: {
      type: String,
      enum: ["home", "shop"],
      required: true,
    },
    order_id: {
      type: String,
      required: true,
    },
    transaction_id: {
      type: String,
    },
    order_products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        size_variationId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        product_name: {
          type: String,
          required: true,
        },
        product_thumbnail: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        size: {
          type: String,
        },
        color: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const OrderModel = model<IOrderInterface>("orders", orderSchema);

export default OrderModel;
