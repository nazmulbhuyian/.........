import { NextFunction, Request, RequestHandler, Response } from "express";
import ApiError from "../../errors/ApiError";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { findUserInfoServices, updateUserInfoService } from "./get.me.services";
const { promisify } = require('util');
const jwt = require("jsonwebtoken");

// get a user
export const getMeUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = await req.headers?.authorization?.split(" ")?.[1];
        const decode = await promisify(jwt.verify)(token, process.env.ACCESS_TOKEN);

        const user = await findUserInfoServices(decode.user_phone);

        if (user) {
            return sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: 'User get successfully !',
                data: user
            });
        }
        throw new ApiError(400, 'User get failed !')

    } catch (error) {
        next(error)
    }
}

// get a user information
    export const getUserInformation: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user_phone = req.params.user_phone;

        const user= await findUserInfoServices(user_phone);

        if (user) {
            return sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: 'User information get successfully !',
                data: user
            });
        }
        throw new ApiError(400, 'User information get failed !')

    } catch (error) {
        next(error)
    }
}

// Update his account information
export const updateUserInfo: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const result = await updateUserInfoService(data);
        if (result?.modifiedCount > 0) {
            return sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: 'User information update successfully !'
            });
        } else {
            throw new ApiError(400, 'User information update failed !')
        }

    } catch (error) {
        next(error);
    }
}