import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import {
  checkAUserExitsWhenReg,
  deleteUserServices,
  findAllUser,
  postRegUserServices,
  updateUserStatusServices,
} from "./user.reg.services";
import ApiError from "../../errors/ApiError";
import sendResponse from "../../shared/sendResponse";
import { IUserInterface } from "./user.interface";
import UserModel from "./user.model";
const bcrypt = require("bcryptjs");
const saltRounds = 10;

// registration a user
export const postRegUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;
    if (!data?.user_phone || !data?.user_password || !data?.user_name) {
      throw new ApiError(400, "Must submit name, phone, password !");
    }
    const user_phone = data?.user_phone;

    const inserted = await checkAUserExitsWhenReg(user_phone);
    if (inserted) {
      throw new ApiError(400, "User Already Exists !");
    }
    bcrypt.hash(
      data?.user_password,
      saltRounds,
      async function (err: Error, hash: string) {
        const newUser = {
          user_password: hash,
          user_name: data?.user_name,
          user_phone: user_phone,
          user_role: "customer",
          user_status: "in-active",
        };
        try {
          const result: IUserInterface | null = await postRegUserServices(
            newUser
          );
          return sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Please Login !",
            data: result,
          });
        } catch (error) {
          next(error);
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

// get all user
export const getAllUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IUserInterface[] | [] = await findAllUser(
      limitNumber,
      skip,
      searchTerm
    );
    const total = await UserModel.countDocuments();
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users Found successfully !",
      data: result,
      totalData: total,
    });
  } catch (error) {
    next(error);
  }
};

// Update account Status true
export const patchUserAccountStatusUpdate: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;
    if (!data?.user_status || !data?.user_phone) {
      throw new ApiError(400, "Must submit account ID ans status !");
    }
    const user: IUserInterface | null = await checkAUserExitsWhenReg(
      data?.user_phone
    );
    if (!user) {
      throw new ApiError(400, "User not found !");
    }
    const userStatus: IUserInterface | any = await updateUserStatusServices(
      data?.user_status,
      data?.user_phone
    );
    if (userStatus?.modifiedCount > 0) {
      return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Status update successfully !",
      });
    } else {
      throw new ApiError(400, "Something went wrong !");
    }
  } catch (error) {
    next(error);
  }
};

// delete a user
export const deleteAUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;
    const userDelete: IUserInterface | any = await deleteUserServices(
      data?._id
    );
    if (userDelete?.deletedCount > 0) {
      return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User delete successfully !",
      });
    } else {
      throw new ApiError(400, "Something went wrong !");
    }
  } catch (error) {
    next(error);
  }
};
