import { Types } from "mongoose";
import { IProductInterface } from "../product/product.interface";
import { IUserInterface } from "../userReg/user.interface";

export interface IOrderProductInterface {
  productId: Types.ObjectId | IProductInterface;
  product_name: string;
  product_thumbnail: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
  size_variationId?: Types.ObjectId;
}

export interface IOrderInterface {
  _id?: any;
  customer_id: Types.ObjectId | IUserInterface;
  customer_phone: string;
  total_amount: number;
  pay_amount: number;
  partial_pay_amount: number;
  due_amount: number;
  buying_type: string;
  payment_method: "online" | "cod" | "partial";
  online_payment_method?: "ssl_commerz" | "stripe";
  payment_type: "paid" | "un-paid" | "partial-paid";
  delivery_method: "home" | "shop";
  division: string;
  district: string;
  order_products: IOrderProductInterface[];
  order_type: "pending" | "success" | "cancel";
  order_status: "pending" | "processing" | "complete" | "delivered";
  pending_time?: string;
  processing_time?: string;
  complete_time?: string;
  delivered_time?: string;
  payment_status: "pending" | "success";
  order_id: string;
  transaction_id?: string;
}

export const orderSearchableField = [
  "customer_phone",
  "division",
  "district",
  "order_id",
  "transaction_id",
];
