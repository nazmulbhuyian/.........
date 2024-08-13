import { NextFunction, Request, Response, RequestHandler } from "express";
import ApiError from "../../errors/ApiError";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { findUser, updateforgotPasswordUsersChangeNewPasswordService, updateUserStatus } from "./user..login.services";
import { IUserInterface } from "../userReg/user.interface";
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
require('dotenv').config();


// login a user
export const postLogUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { user_password } = req.body;

        if (!user_password || !req?.body?.user_phone) {
            throw new ApiError(400, "Must send phone and password !");
        }

        const user_phones = req?.body?.user_phone;

        const user = await findUser(user_phones);

        if (user) {
            const isPasswordValid = await bcrypt.compare(
                user_password,
                user?.user_password
            );
            if (isPasswordValid) {
                const user_phone = user?.user_phone;
                const token = jwt.sign(
                    { user_phone },
                    process.env.ACCESS_TOKEN
                );
                const user_info = {
                    user_name: user?.user_name,
                    user_phone: user?.user_phone,
                    user_district: user?.user_district,
                    user_division: user?.user_division,
                    user_address: user?.user_address,
                    user_status: user?.user_status,
                    user_role: user?.user_role,
                };

                const updateUserStatusActive: IUserInterface | any = await updateUserStatus(user_phones);

                if (updateUserStatusActive?.modifiedCount > 0) {
                    const sendData = {
                        token,
                        user: user_info,
                    };
                    return sendResponse(res, {
                        statusCode: httpStatus.OK,
                        success: true,
                        message: "User log in successfully !",
                        data: sendData,
                    });
                }

            } else {
                throw new ApiError(400, "Password not match !");
            }
        } else {
            throw new ApiError(400, "User not found !");
        }
    } catch (error) {
        next(error);
    }
};


//update password from profile
export const updateChangePasswordUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { user_phone, current_password, new_password } = req.body;
        const user = await findUser(user_phone);
        if (user) {
            if (user?.user_status == "in-active") {
                throw new ApiError(400, "No access !");
            }
            const isPasswordValid = await bcrypt.compare(
                current_password,
                user?.user_password
            );

            if (isPasswordValid) {
                bcrypt.hash(
                    new_password,
                    saltRounds,
                    async function (err: Error, hash: string) {
                        const updatePassword =
                            await updateforgotPasswordUsersChangeNewPasswordService(
                                user_phone,
                                hash
                            );
                        if (updatePassword.modifiedCount > 0) {
                            return sendResponse(res, {
                                statusCode: httpStatus.OK,
                                success: true,
                                message: "Password update successfully !",
                            });
                        } else {
                            throw new ApiError(400, "Something went wrong !");
                        }
                    }
                );
            } else {
                return sendResponse(res, {
                    statusCode: httpStatus.BAD_REQUEST,
                    success: false,
                    message: "Current Password not match !",
                });
            }
        } else {
            throw new ApiError(400, "User not found !");
        }
    } catch (error) {
        next(error);
    }
};