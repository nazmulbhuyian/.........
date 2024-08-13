import CategoryModel from "../category/category.model";
import ColorModel from "../color/color.model";
import Sub_CategoryModel from "../sub_category/sub_category.model";
import { IProductInterface, productSearchableField } from "./product.interface";
import ProductModel from "./product.model";

// Find A Product
export const findAProductSlugServices = async (
  product_slug: string
): Promise<IProductInterface | null> => {
  const findProduct = await ProductModel.findOne({
    product_slug: product_slug,
  });
  return findProduct;
};

// Create A Product
export const postProductServices = async (
  data: IProductInterface
): Promise<IProductInterface | {}> => {
  const createProduct = await ProductModel.create(data);
  return createProduct;
};

// Find A Specific Product
// Find A Product
export const findASpecificProductServices = async (
  product_slug: string
): Promise<IProductInterface | null> => {
  const findProduct = await ProductModel.findOne({
    product_slug: product_slug,
  }).populate(["category_id", "sub_category_id", "product_color_id"]);
  return findProduct;
};

// Find All Active Product
// export const findAllActiveProductServices = async (): Promise<
//   IProductInterface[]
// > => {
//   const limitNumber = 10;

//   // Shuffle the products using $sample
//   const findProducts = await ProductModel.aggregate([
//     { $match: { product_status: "active" } },
//     { $sample: { size: limitNumber } },
//     {
//       $lookup: {
//         from: "categories",
//         localField: "category_id",
//         foreignField: "_id",
//         as: "category",
//       },
//     },
//     {
//       $lookup: {
//         from: "subcategories",
//         localField: "sub_category_id",
//         foreignField: "_id",
//         as: "sub_category",
//       },
//     },
//     {
//       $lookup: {
//         from: "colors",
//         localField: "product_color_id",
//         foreignField: "_id",
//         as: "product_color_id",
//       },
//     },
//     {
//       $match: {
//         $and: [
//           { "category.category_status": "active" },
//           {
//             $or: [
//               { "sub_category.sub_category_status": "active" },
//               { sub_category: [] },
//             ],
//           },
//         ],
//       },
//     },
//     { $sort: { _id: -1 } },
//   ]);
//   return findProducts;
// };

export const findAllActiveProductServices = async (): Promise<
  IProductInterface[]
> => {
  const limitNumber = 10;
  let findProducts: any = [];
  while (findProducts.length < limitNumber) {
    const findProduct = await ProductModel.find({ product_status: "active" })
      .populate(["category_id", "sub_category_id", "product_color_id"])
      .sort({ _id: -1 })
      .limit(limitNumber);

    // Filter products based on status
    const activeProducts = findProduct?.filter((product) => {
      // Check for category status
      const isCategoryActive =
        product?.category_id?.category_status === "active";
      const isSubCategoryActive = product?.sub_category_id
        ? product?.sub_category_id?.sub_category_status === "active"
        : true;

      return isCategoryActive && isSubCategoryActive;
    });
    if (activeProducts.length === 0) {
      return findProducts;
    }
    findProducts = findProducts.concat(activeProducts);
  }

  return findProducts;
};

// Get category match product for home page
export const getCategoryMatchProductServices = async (): Promise<any[]> => {
  const categories = await CategoryModel.find({ category_status: "active" });
  const allProducts = await ProductModel.find({
    product_status: "active",
  }).populate(["category_id", "sub_category_id", "product_color_id"]);

  const sendData: any[] = [];

  categories.forEach((category) => {
    let productsData: any[] = [];
    allProducts.forEach((product) => {
      const categoryMatch =
        product?.category_id?._id?.toString() == category?._id?.toString() &&
        ((product?.sub_category_id &&
          product?.sub_category_id?.sub_category_status === "active") ||
          !product?.sub_category_id);
      if (categoryMatch == true) {
        productsData.push(product);
      }
    });

    sendData.push({
      category: category,
      productsData:
        productsData?.length > 10 ? productsData?.slice(0, 10) : productsData,
    });
  });

  // Sorting categories and their allProducts
  sendData.sort((a: any, b: any) => {
    // Sort categories based on their serial numbers
    return a?.category?.category_serial - b?.category?.category_serial;
  });

  return sendData;
};

// Find All filterded product
export const findAllFilteredProductServices = async (
  conditions: any,
  limitNumber: any,
  skip: any,
  min_price: any,
  max_price: any
): Promise<IProductInterface[]> => {
  let findCategoryTypeId: any;
  let findColorTypeId: any;
  let findSubCategoryTypeId: any;
  if (conditions?.category) {
    const findCategoryType = await CategoryModel.findOne({
      category_slug: conditions?.category,
    });
    findCategoryTypeId = findCategoryType?._id?.toString();
  }
  if (conditions?.color) {
    const findColorType = await ColorModel.findOne({
      color_slug: conditions?.color,
    });
    findColorTypeId = findColorType?._id?.toString();
  }
  if (conditions?.sub_category) {
    const findSubCategoryType = await Sub_CategoryModel.findOne({
      sub_category_slug: conditions?.sub_category,
      category_id: findCategoryTypeId,
    });
    findSubCategoryTypeId = findSubCategoryType?._id?.toString();
  }

  let productQuery: any = { product_status: "active" };

  if (findCategoryTypeId) {
    productQuery.category_id = findCategoryTypeId;
  }
  if (findSubCategoryTypeId) {
    productQuery.sub_category_id = findSubCategoryTypeId;
  }
  if (findColorTypeId) {
    productQuery.product_color_id = findColorTypeId;
  }

  if (min_price && max_price) {
    productQuery.product_price = { $gte: min_price, $lte: max_price };
  }

  if (conditions?.keyword) {
    productQuery.$or = productSearchableField?.map((field) => ({
      [field]: {
        $regex: conditions?.keyword,
        $options: "i",
      },
    }));
  }
  const findProduct = await ProductModel.find(productQuery)
    .populate(["category_id", "sub_category_id", "product_color_id"])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limitNumber);
  const maxPriceProduct = findProduct?.reduce(
    (maxPriceProduct: any, product: any) => {
      if (
        !maxPriceProduct ||
        product?.product_price > maxPriceProduct?.product_price
      ) {
        return product;
      } else {
        return maxPriceProduct;
      }
    },
    null
  );
  const sendData: any = {
    products: findProduct,
    totalData: await ProductModel.countDocuments(productQuery),
    maxPriceRange: maxPriceProduct?.product_price,
  };
  return sendData;
};

// Find All Related Active Product
export const findAllRelatedActiveProductServices = async (
  product_related_slug: string
): Promise<IProductInterface[]> => {
  const findProduct = await ProductModel.find({
    product_related_slug: product_related_slug,
    product_status: "active",
  })
    .populate(["category_id", "sub_category_id", "product_color_id"])
    .sort({ _id: -1 });

  // Filter products based on status
  const activeProducts = findProduct?.filter((product) => {
    // Check for category status
    const isCategoryActive = product?.category_id?.category_status === "active";
    const isSubCategoryActive = product?.sub_category_id
      ? product?.sub_category_id?.sub_category_status === "active"
      : true;

    return isCategoryActive && isSubCategoryActive;
  });

  return activeProducts;
};

// Find All Dashboard Product
export const findAllDashboardProductServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<IProductInterface[]> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: productSearchableField?.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const allProduct = await ProductModel.find(whereCondition)
    .populate(["category_id", "sub_category_id", "product_color_id"])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);

  return allProduct;
};

// Update a Product
export const updateProductServices = async (
  data: IProductInterface,
  _id: string
): Promise<IProductInterface | any> => {
  const updateProductInfo: IProductInterface | null =
    await ProductModel.findOne({ _id: _id });
  if (!updateProductInfo) {
    return {};
  }
  const Product = await ProductModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return Product;
};

// Delete a Product
export const deleteProductServices = async (
  _id: string
): Promise<IProductInterface | any> => {
  const deleteProductInfo: IProductInterface | null =
    await ProductModel.findOne({ _id: _id });
  if (!deleteProductInfo) {
    return {};
  }
  const Product = await ProductModel.deleteOne(
    { _id: _id },
    {
      runValidators: true,
    }
  );
  return Product;
};
