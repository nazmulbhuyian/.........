import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import sendResponse from "../../shared/sendResponse";
import { IColorInterface } from "./color.interface";
import {
  deleteColorServices,
  findAColorServices,
  findAllColorServices,
  findColorInProductServices,
  postColorServices,
  updateColorServices,
} from "./color.services";
import ColorModel from "./color.model";
import { IProductInterface } from "../product/product.interface";

// Add A Color
export const postColor: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IColorInterface | any> => {
  try {
    const data = req.body;
    const findColorIsExist: IColorInterface | null = await findAColorServices(
      data?.color_slug
    );
    if (findColorIsExist) {
      throw new ApiError(400, "Previously Added !");
    }
    const result: IColorInterface | {} = await postColorServices(data);
    if (result) {
      return sendResponse<IColorInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Color Added Successfully !",
      });
    } else {
      throw new ApiError(400, "Color Added Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};

// Find All Color
export const findAllColor: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IColorInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IColorInterface[] | any = await findAllColorServices(
      limitNumber,
      skip,
      searchTerm
    );
    const total = await ColorModel.countDocuments();
    return sendResponse<IColorInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Color Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A Color
export const updateColor: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IColorInterface | any> => {
  try {
    const requestData = req.body;
    const findColorIsExist: IColorInterface | null = await findAColorServices(
      requestData?.color_slug
    );
    if (
      findColorIsExist &&
      requestData?._id !== findColorIsExist?._id.toString()
    ) {
      throw new ApiError(400, "Previously Added !");
    }
    const result: IColorInterface | any = await updateColorServices(
      requestData,
      requestData?._id
    );
    if (result?.modifiedCount > 0) {
      return sendResponse<IColorInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Color Update Successfully !",
      });
    } else {
      throw new ApiError(400, "Color Update Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};

// delete A Color
export const deleteColor: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IColorInterface | any> => {
  try {
    const requestData = req.body;
    const _id = requestData?._id;
    const findColorIsExistProduct: IProductInterface | null =
      await findColorInProductServices(_id);
    if (findColorIsExistProduct) {
      throw new ApiError(400, "Exist in product !");
    }
    const result: IColorInterface | any = await deleteColorServices(_id);
    if (result?.deletedCount > 0) {
      return sendResponse<IColorInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Color Delete Successfully !",
      });
    } else {
      throw new ApiError(400, "Color Delete Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};
