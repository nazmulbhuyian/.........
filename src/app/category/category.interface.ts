export interface ICategoryInterface {
  _id?: any;
  category_name: string;
  category_slug: string;
  category_logo: string;
  image_key: string;
  category_status: "active" | "in-active";
  category_serial: number;
  show_card: "active" | "in-active";
  show_title: "active" | "in-active";
}

export const categorySearchableField = [
  "category_name",
  "category_slug",
  "category_status",
];
