import { IProductInterface } from "../product/product.interface";
import ProductModel from "../product/product.model";
import {
  ISub_CategoryInterface,
  sub_categorySearchableField,
} from "./sub_category.interface";
import Sub_CategoryModel from "./sub_category.model";

// Find A Sub_Category
export const findASub_CategoryServices = async (
  sub_category_slug: string,
  category_id: any
): Promise<ISub_CategoryInterface | null> => {
  const findSub_Category = await Sub_CategoryModel.findOne({
    sub_category_slug: sub_category_slug,
    category_id: category_id,
  });
  return findSub_Category;
};

// Find A Sub_Category with serial
export const findASub_CategorySerialServices = async (
  sub_category_serial: number,
  category_id: any
): Promise<ISub_CategoryInterface | null> => {
  const findSub_Category = await Sub_CategoryModel.findOne({
    sub_category_serial: sub_category_serial,
    category_id: category_id,
  });
  return findSub_Category;
};

// Create A Sub_Category
export const postSub_CategoryServices = async (
  data: ISub_CategoryInterface
): Promise<ISub_CategoryInterface | {}> => {
  const createSub_Category = await Sub_CategoryModel.create(data);
  return createSub_Category;
};

// Find All Sub_Category
export const findAllSub_CategoryServices = async (): Promise<
  ISub_CategoryInterface[] | []
> => {
  const findSub_Category: ISub_CategoryInterface[] | [] =
    await Sub_CategoryModel.find({ sub_category_status: "active" })
      .populate("category_id")
      .sort({ sub_category_serial: 1 })
      .select("-__v");
  return findSub_Category;
};

// Find all dashboard Sub_Category
export const findAllDashboardSub_CategoryServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<ISub_CategoryInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: sub_categorySearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findSub_Category: ISub_CategoryInterface[] | [] =
    await Sub_CategoryModel.find(whereCondition)
      .populate("category_id")
      .sort({ sub_category_serial: 1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");
  return findSub_Category;
};

// Update a Sub_Category
export const updateSub_CategoryServices = async (
  data: ISub_CategoryInterface,
  _id: string
): Promise<ISub_CategoryInterface | any> => {
  const updateSub_CategoryInfo: ISub_CategoryInterface | null =
    await Sub_CategoryModel.findOne({ _id: _id });
  if (!updateSub_CategoryInfo) {
    return {};
  }
  const Sub_Category = await Sub_CategoryModel.updateOne(
    updateSub_CategoryInfo,
    data,
    { runValidators: true }
  );
  return Sub_Category;
};

// delete a Sub_Category

// Find A SubCategory in Product
export const findASubCategoryExistProductServices = async (
  _id: string
): Promise<IProductInterface | null> => {
  const findSubCategory: IProductInterface | null = await ProductModel.findOne({
    sub_category_id: _id,
  });
  return findSubCategory;
};

export const deleteSub_CategoryServices = async (
  _id: string
): Promise<ISub_CategoryInterface | any> => {
  const deleteSub_CategoryInfo: ISub_CategoryInterface | null =
    await Sub_CategoryModel.findOne({ _id: _id });
  if (!deleteSub_CategoryInfo) {
    return {};
  }
  const Sub_Category = await Sub_CategoryModel.deleteOne(
    { _id: _id },
    { runValidators: true }
  );
  return Sub_Category;
};
