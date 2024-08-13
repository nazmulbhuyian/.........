import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { ISub_CategoryInterface } from "./sub_category.interface";
import sendResponse from "../../shared/sendResponse";
import {
  deleteSub_CategoryServices,
  findASubCategoryExistProductServices,
  findASub_CategorySerialServices,
  findASub_CategoryServices,
  findAllDashboardSub_CategoryServices,
  findAllSub_CategoryServices,
  postSub_CategoryServices,
  updateSub_CategoryServices,
} from "./sub_category.services";
import Sub_CategoryModel from "./sub_category.model";
import { IProductInterface } from "../product/product.interface";

// Add A Sub_Category
export const postSub_Category: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISub_CategoryInterface | any> => {
  try {
    const data = req.body;
    const findSub_CategoryIsExist: ISub_CategoryInterface | null =
      await findASub_CategoryServices(
        data?.sub_category_slug,
        data?.category_id
      );
    if (findSub_CategoryIsExist) {
      throw new ApiError(400, "Previously Added !");
    }
    const findSub_CategoryIsExistSerial: ISub_CategoryInterface | null =
      await findASub_CategorySerialServices(
        data?.sub_category_serial,
        data?.category_id
      );
    if (findSub_CategoryIsExistSerial) {
      throw new ApiError(400, "This serial previously Added !");
    }
    const result: ISub_CategoryInterface | {} = await postSub_CategoryServices(
      data
    );
    if (result) {
      return sendResponse<ISub_CategoryInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Sub_Category Added Successfully !",
      });
    } else {
      throw new ApiError(400, "Sub_Category Added Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};

// Find All Sub_Category
export const findAllSub_Category: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISub_CategoryInterface | any> => {
  try {
    const result: ISub_CategoryInterface[] | any =
      await findAllSub_CategoryServices();
    return sendResponse<ISub_CategoryInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Sub_Category Found Successfully !",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find All dashboard Sub_Category
export const findAllDashboardSub_Category: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISub_CategoryInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ISub_CategoryInterface[] | any =
      await findAllDashboardSub_CategoryServices(limitNumber, skip, searchTerm);
    const total = await Sub_CategoryModel.countDocuments();
    return sendResponse<ISub_CategoryInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Sub_Category Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A Sub_Category
export const updateSub_Category: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISub_CategoryInterface | any> => {
  try {
    const requestData = req.body;
    const findSub_CategoryIsExist: ISub_CategoryInterface | null =
      await findASub_CategoryServices(
        requestData?.sub_category_slug,
        requestData?.category_id
      );
    if (
      findSub_CategoryIsExist &&
      requestData?._id !== findSub_CategoryIsExist?._id.toString()
    ) {
      throw new ApiError(400, "Previously Added !");
    }
    const findSub_CategoryIsExistSerial: ISub_CategoryInterface | null =
      await findASub_CategorySerialServices(
        requestData?.sub_category_serial,
        requestData?.category_id
      );
    if (
      findSub_CategoryIsExistSerial &&
      requestData?._id !== findSub_CategoryIsExistSerial?._id.toString()
    ) {
      throw new ApiError(400, "This serial previously Added !");
    }
    const result: ISub_CategoryInterface | any =
      await updateSub_CategoryServices(requestData, requestData?._id);
    if (result?.modifiedCount > 0) {
      return sendResponse<ISub_CategoryInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Sub_Category Update Successfully !",
      });
    } else {
      throw new ApiError(400, "Sub_Category Update Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};

// Delete aSubCategory
export const deleteASubCategory: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISub_CategoryInterface | any> => {
  try {
    const data = req.body;
    const _id = data?._id;
    const productExist: IProductInterface | null =
      await findASubCategoryExistProductServices(_id);
    if (productExist) {
      throw new ApiError(400, "Already exist in product !");
    }
    const result: ISub_CategoryInterface[] | any =
      await deleteSub_CategoryServices(_id);

    if (result?.deletedCount > 0) {
      return sendResponse<ISub_CategoryInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Sub Category Delete Successfully !",
      });
    } else {
      throw new ApiError(400, "Sub Category Delete Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};
