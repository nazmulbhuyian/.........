export interface IBannerInterface {
  _id?: any;
  banner_title: string;
  banner_image: string;
  image_key: string;
  banner_status: "active" | "in-active";
  banner_path: string;
  banner_serial: number;
}
