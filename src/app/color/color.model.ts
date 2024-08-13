import { Schema, model } from "mongoose";
import { IColorInterface } from "./color.interface";

// Color Schema
const colorSchema = new Schema<IColorInterface>(
  {
    color_name: {
      required: true,
      type: String,
    },
    color_slug: {
      required: true,
      type: String,
      unique: true,
    }
  },
  {
    timestamps: true,
  }
);

const ColorModel = model<IColorInterface>("colors", colorSchema);

export default ColorModel;
