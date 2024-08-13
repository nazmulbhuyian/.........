import ApiError from "../../errors/ApiError";
import { IProductInterface } from "../product/product.interface";
import ProductModel from "../product/product.model";
import { ISub_CategoryInterface } from "../sub_category/sub_category.interface";
import Sub_CategoryModel from "../sub_category/sub_category.model";
import {
  ICategoryInterface,
  categorySearchableField,
} from "./category.interface";
import CategoryModel from "./category.model";

// Find A Category
export const findACategoryServices = async (
  category_slug: string
): Promise<ICategoryInterface | null> => {
  const findCategory: ICategoryInterface | null = await CategoryModel.findOne({
    category_slug: category_slug,
  });
  return findCategory;
};

// Find A Category with serial
export const findACategorySerialServices = async (
  category_serial: number
): Promise<ICategoryInterface | null> => {
  const findCategory: ICategoryInterface | null = await CategoryModel.findOne({
    category_serial: category_serial,
  });
  return findCategory;
};

// Create A Category
export const postCategoryServices = async (
  data: ICategoryInterface
): Promise<ICategoryInterface | {}> => {
  const createCategory: ICategoryInterface | {} = await CategoryModel.create(
    data
  );
  return createCategory;
};

// Find All Category
export const findAllCategoryServices = async (): Promise<
  ICategoryInterface[] | []
> => {
  const findCategory: ICategoryInterface[] | [] = await CategoryModel.find({
    category_status: "active",
  })
    .sort({ category_serial: 1 })
    .select("-__v");
  return findCategory;
};

// Find all dashboard Category
export const findAllDashboardCategoryServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<ICategoryInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: categorySearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findCategory: ICategoryInterface[] | [] = await CategoryModel.find(
    whereCondition
  )
    .sort({ category_serial: 1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findCategory;
};

// Get banner match category  subCategory childCategory
export const getBannerMatchChild_Sub_CategoryServices = async (): Promise<
  any[]
> => {
  const categories = await CategoryModel.find({ category_status: "active" });
  const subCategories = await Sub_CategoryModel.find({
    sub_category_status: "active",
  });

  const sendData: any[] = [];

  categories.forEach((category) => {
    let subCategoryData: any[] = [];
    subCategories.forEach((subCategory) => {
      const categoryMatch =
        subCategory?.category_id.toString() == category?._id.toString();
      if (categoryMatch == true) {
        subCategoryData.push(subCategory);
      }
    });

    sendData.push({
      category: category,
      subCategoryData,
    });
  });

  // Sorting categories and their subcategories
  sendData
    .sort((a: any, b: any) => {
      // Sort categories based on their serial numbers
      return a?.category?.category_serial - b?.category?.category_serial;
    })
    .forEach((categoryData) => {
      // Sort subcategories based on their serial numbers
      categoryData?.subCategoryData?.sort(
        (a: any, b: any) => a?.sub_category_serial - b?.sub_category_serial
      );
    });

  return sendData;
};

// Update a Category
export const updateCategoryServices = async (
  data: ICategoryInterface,
  _id: string
): Promise<ICategoryInterface | any> => {
  const updateCategoryInfo: ICategoryInterface | null =
    await CategoryModel.findOne({ _id: _id });
  if (!updateCategoryInfo) {
    return {};
  }
  if (data?.show_title) {
    const updateCategoryShowTitleInfo: ICategoryInterface[] | [] =
      await CategoryModel.find({ show_title: "active" });
    if (
      updateCategoryShowTitleInfo?.length >= 5 &&
      data?.show_title == "active"
    ) {
      throw new ApiError(400, "Already 5 title is active");
    }
    const CategoryShowTitleUpdate = await CategoryModel.updateOne(
      updateCategoryInfo,
      data,
      {
        runValidators: true,
      }
    );
    return CategoryShowTitleUpdate;
  }

  if (data?.show_card) {
    const updateCategoryShowCardInfo: ICategoryInterface[] | [] =
      await CategoryModel.find({ show_card: "active" });
    if (
      updateCategoryShowCardInfo?.length >= 6 &&
      data?.show_card == "active"
    ) {
      throw new ApiError(400, "Already 6 card is active");
    }
    const CategoryShowCardUpdate = await CategoryModel.updateOne(
      updateCategoryInfo,
      data,
      {
        runValidators: true,
      }
    );
    return CategoryShowCardUpdate;
  }

  const Category = await CategoryModel.updateOne(updateCategoryInfo, data, {
    runValidators: true,
  });
  return Category;
};

// delete a Category start

// Find A Category in sub category
export const findACategoryExistSubCategoryServices = async (
  _id: string
): Promise<ISub_CategoryInterface | null> => {
  const findCategory: ISub_CategoryInterface | null =
    await Sub_CategoryModel.findOne({
      category_id: _id,
    });
  return findCategory;
};

// Find A Category in Product
export const findACategoryExistProductServices = async (
  _id: string
): Promise<IProductInterface | null> => {
  const findCategory: IProductInterface | null = await ProductModel.findOne({
    category_id: _id,
  });
  return findCategory;
};

export const deleteCategoryServices = async (
  _id: string
): Promise<ICategoryInterface | any> => {
  const deleteCategoryInfo: ICategoryInterface | null =
    await CategoryModel.findOne({ _id: _id });
  if (!deleteCategoryInfo) {
    return {};
  }
  const Category = await CategoryModel.deleteOne(
    { _id: _id },
    {
      runValidators: true,
    }
  );
  return Category;
};
