import { IProductInterface } from "../product/product.interface";

export interface IVideo_tabInterface {
  _id?: any;
  video_link: string;
  product_id: IProductInterface;
}
