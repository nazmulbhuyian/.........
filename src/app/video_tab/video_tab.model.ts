import { Schema, model } from "mongoose";
import { IVideo_tabInterface } from "./video_tab.interface";

// video_tab Schema
const video_tabSchema = new Schema<IVideo_tabInterface>(
  {
    video_link: {
      required: true,
      type: String,
    },
    product_id: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "products",
    },
  },
  {
    timestamps: true,
  }
);

const Video_tabModel = model<IVideo_tabInterface>("videos", video_tabSchema);

export default Video_tabModel;
