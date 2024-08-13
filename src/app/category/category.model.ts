import { Schema, model } from "mongoose";
import { ICategoryInterface } from "./category.interface";

// Category Schema
const categorySchema = new Schema<ICategoryInterface>(
  {
    category_name: {
      required: true,
      type: String,
      unique: true,
    },
    category_slug: {
      required: true,
      type: String,
      unique: true,
    },
    category_logo: {
      required: true,
      type: String,
    },
    image_key: {
      required: true,
      type: String,
    },
    category_status: {
      required: true,
      type: String,
      enum: ["active", "in-active"],
      default: "active",
    },
    category_serial: {
      type: Number,
      required: true,
    },
    show_card: {
      type: String,
      enum: ["active", "in-active"],
      default: "in-active",
    },
    show_title: {
      type: String,
      enum: ["active", "in-active"],
      default: "in-active",
    },
  },
  {
    timestamps: true,
  }
);

const CategoryModel = model<ICategoryInterface>("categories", categorySchema);

export default CategoryModel;
