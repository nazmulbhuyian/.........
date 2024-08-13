import { ICategoryInterface } from "../category/category.interface";
import { ISub_CategoryInterface } from "../sub_category/sub_category.interface";
import { IColorInterface } from "../color/color.interface";

interface productImagesArray {
  image: string;
}

interface productSizeVariationArray {
  size: string;
  quantity: Number;
  price?: Number;
  discount_price?: Number;
  description?: string;
  image?: string;
}

export interface IProductInterface {
  _id?: any;
  category_id: ICategoryInterface;
  sub_category_id?: ISub_CategoryInterface;
  product_name: string;
  product_slug: string;
  product_related_slug: string;
  product_color_id: IColorInterface;
  product_thumbnail: string;
  product_images?: productImagesArray[];
  product_status: "active" | "in-active";
  product_description?: string;
  product_price: number;
  product_discount_price?: number;
  product_quantity?: number;
  product_size_variation?: productSizeVariationArray[];
  product_partial_payment?: true | false;
  product_partial_payment_amount?: number;
}

export const productSearchableField = [
  "product_name",
  "product_status",
  "product_slug",
];
