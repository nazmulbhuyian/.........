import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import sendResponse from "../../shared/sendResponse";
import { IVideo_tabInterface } from "./video_tab.interface";
import {
  deleteVideo_tabServices,
  findAVideo_tabServices,
  findAllDashboardVideoServices,
  findAllVideo_tabServices,
  postVideo_tabServices,
  updateVideo_tabServices,
} from "./video_tab.services";
import Video_tabModel from "./video_tab.model";

// Add A Video_tab
export const postVideo_tab: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IVideo_tabInterface | any> => {
  try {
    const data = req.body;
    const findVideo_tabIsExist: IVideo_tabInterface | null =
      await findAVideo_tabServices(data?.product_id);
    if (findVideo_tabIsExist) {
      throw new ApiError(400, "Previously Added !");
    }
    const result: IVideo_tabInterface | {} = await postVideo_tabServices(data);
    if (result) {
      return sendResponse<IVideo_tabInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Video Added Successfully !",
      });
    } else {
      throw new ApiError(400, "Video Added Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};

// Find All Video_tab
export const findAllVideo_tab: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IVideo_tabInterface | any> => {
  try {
    const { page, limit } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IVideo_tabInterface[] | any = await findAllVideo_tabServices(
      limitNumber,
      skip
    );
    const total = await Video_tabModel.countDocuments();
    return sendResponse<IVideo_tabInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Video Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// fins all dashboard video
export const findAllDashboardVideo: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IVideo_tabInterface | any> => {
  try {
    const { page, limit } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IVideo_tabInterface[] | any =
      await findAllDashboardVideoServices(limitNumber, skip);
    const total = await Video_tabModel.countDocuments();
    return sendResponse<IVideo_tabInterface>(res, {
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

// Update A Video_tab
export const updateVideo_tab: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IVideo_tabInterface | any> => {
  try {
    const requestData = req.body;
    const findVideo_tabIsExist: IVideo_tabInterface | null =
      await findAVideo_tabServices(requestData?.product_link);
    if (
      findVideo_tabIsExist &&
      requestData?._id !== findVideo_tabIsExist?._id.toString()
    ) {
      throw new ApiError(400, "Previously Added !");
    }
    const result: IVideo_tabInterface | any = await updateVideo_tabServices(
      requestData,
      requestData?._id
    );
    if (result?.modifiedCount > 0) {
      return sendResponse<IVideo_tabInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Video Update Successfully !",
      });
    } else {
      throw new ApiError(400, "Video Update Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};

// delete A Video_tab item
export const deleteAVideo_tabInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.body._id;
    const result = await deleteVideo_tabServices(_id);
    if (result?.deletedCount > 0) {
      return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Video Delete successfully !",
      });
    } else {
      throw new ApiError(400, "Video delete failed !");
    }
  } catch (error) {
    next(error);
  }
};
