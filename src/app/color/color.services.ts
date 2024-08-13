import { IProductInterface } from "../product/product.interface";
import ProductModel from "../product/product.model";
import { IColorInterface, colorSearchableField } from "./color.interface";
import ColorModel from "./color.model";

// Find A Color
export const findAColorServices = async (
  color_slug: string
): Promise<IColorInterface | null> => {
  const findColor = await ColorModel.findOne({
    color_slug: color_slug,
  });
  return findColor;
};

// Create A Color
export const postColorServices = async (
  data: IColorInterface
): Promise<IColorInterface | {}> => {
  const createColor = await ColorModel.create(data);
  return createColor;
};

// Find all Color
export const findAllColorServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<IColorInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: colorSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findColor: IColorInterface[] | [] = await ColorModel.find(
    whereCondition
  )
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findColor;
};

// Update a Color
export const updateColorServices = async (
  data: IColorInterface,
  _id: string
): Promise<IColorInterface | any> => {
  const updateColorInfo: IColorInterface | null = await ColorModel.findOne({
    _id: _id,
  });
  if (!updateColorInfo) {
    return {};
  }
  const Color = await ColorModel.updateOne(updateColorInfo, data, {
    runValidators: true,
  });
  return Color;
};

// Delete a Color

export const findColorInProductServices = async (
  _id: string
): Promise<IProductInterface | any> => {
  const ColorInfo: IProductInterface | null = await ProductModel.findOne({
    product_color_id: _id,
  });
  return ColorInfo;
};

export const deleteColorServices = async (
  _id: string
): Promise<IColorInterface | any> => {
  const updateColorInfo: IColorInterface | null = await ColorModel.findOne({
    _id: _id,
  });
  if (!updateColorInfo) {
    return {};
  }
  const Color = await ColorModel.deleteOne(
    {
      _id: _id,
    },
    {
      runValidators: true,
    }
  );
  return Color;
};
