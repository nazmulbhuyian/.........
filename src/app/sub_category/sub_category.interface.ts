import { Types } from "mongoose";
import { ICategoryInterface } from "../category/category.interface";

export interface ISub_CategoryInterface {
  _id?: any;
  sub_category_name: string;
  sub_category_slug: string;
  sub_category_serial: number;
  sub_category_status: "active" | "in-active";
  category_id: Types.ObjectId | ICategoryInterface;
}

export const sub_categorySearchableField = [
  "sub_category_name",
  "sub_category_slug",
  "sub_category_status",
];
