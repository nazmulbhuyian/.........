import { Schema, model } from "mongoose";
import { ISub_CategoryInterface } from "./sub_category.interface";

// Sub Category Schema
const sub_categorySchema = new Schema<ISub_CategoryInterface>(
  {
    sub_category_name: {
      required: true,
      type: String,
    },
    sub_category_slug: {
      required: true,
      type: String,
    },
    sub_category_serial: {
      type: Number,
      required: true
    },
    sub_category_status: {
      required: true,
      type: String,
      enum: ["active", "in-active"],
      default: "active",
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Sub_CategoryModel = model<ISub_CategoryInterface>(
  "subcategories",
  sub_categorySchema
);

export default Sub_CategoryModel;
