import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { IProductInterface } from "./product.interface";
import ProductModel from "./product.model";
import {
  deleteProductServices,
  findAProductSlugServices,
  findASpecificProductServices,
  findAllActiveProductServices,
  findAllDashboardProductServices,
  findAllFilteredProductServices,
  findAllRelatedActiveProductServices,
  getCategoryMatchProductServices,
  postProductServices,
  updateProductServices,
} from "./product.services";

// Add A Product
export const postProduct: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IProductInterface | any> => {
  try {
    const requestData = req.body;
    const checkExist: IProductInterface | null = await findAProductSlugServices(
      requestData?.product_slug
    );
    if (checkExist) {
      throw new ApiError(400, "This product already exists !");
    }
    const result: IProductInterface | {} = await postProductServices(
      requestData
    );
    if (result) {
      return sendResponse<IProductInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product Added Successfully !",
      });
    } else {
      throw new ApiError(400, "Product Added Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};

// Find All Product
export const findAllProduct: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IProductInterface | any> => {
  try {
    const result: IProductInterface[] | any =
      await findAllActiveProductServices();
    return sendResponse<IProductInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product Found Successfully !",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find All Dashboard Product
export const findAllDashboardProduct: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IProductInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IProductInterface[] | any =
      await findAllDashboardProductServices(limitNumber, skip, searchTerm);
    const total = await ProductModel.countDocuments();
    return sendResponse<IProductInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find All Filtered Product
export const findAllFilteredProduct: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IProductInterface | any> => {
  try {
    const {
      category,
      sub_category,
      color,
      page,
      limit,
      min_price,
      max_price,
      keyword
    } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const conditions: any = {};

    if (category) {
      conditions.category = category;
    }

    if (sub_category) {
      conditions.sub_category = sub_category;
    }

    if (color) {
      conditions.color = color;
    }
    if (keyword) {
      conditions.keyword = keyword;
    }

    const result: IProductInterface[] | any =
      await findAllFilteredProductServices(
        conditions,
        limitNumber,
        skip,
        min_price,
        max_price
      );
    return sendResponse<IProductInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product Found Successfully !",
      data: result,
      totalData: result?.totalData,
    });
  } catch (error: any) {
    next(error);
  }
};

// Get category match product for home page
export const getCategoryMatchProduct: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IProductInterface | any> => {
  try {
    const result: any = await getCategoryMatchProductServices();
    return sendResponse<IProductInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Category With Product Found Successfully !",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find A Product
export const findASpecificProduct: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IProductInterface | any> => {
  try {
    const product_slug = req.params.product_slug;
    const result: IProductInterface | null = await findASpecificProductServices(
      product_slug
    );
    return sendResponse<IProductInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product Found Successfully !",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A Product
export const updateProduct: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IProductInterface | any> => {
  try {
    const requestData = req.body;
    const result: IProductInterface | any = await updateProductServices(
      requestData,
      requestData?._id
    );
    if (result?.modifiedCount > 0) {
      return sendResponse<IProductInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product Update Successfully !",
      });
    } else {
      throw new ApiError(400, "Product Update Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};

// delete A Product item
export const deleteAProductInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const Product_id = req.body._id;
    const result = await deleteProductServices(Product_id);
    if (result?.deletedCount > 0) {
      return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product Delete successfully !",
      });
    } else {
      throw new ApiError(400, "Product delete failed !");
    }
  } catch (error) {
    next(error);
  }
};

// Find All realted Product
export const findAllRelatedProduct: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IProductInterface | any> => {
  try {
    const product_related_slug = req.params.product_related_slug;
    const result: IProductInterface[] | any =
      await findAllRelatedActiveProductServices(product_related_slug);
    return sendResponse<IProductInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Related Product Found Successfully !",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
