import { NextFunction, Request, RequestHandler, Response } from "express";
import ApiError from "../errors/ApiError";
import { promisify } from "util";
import { checkAUserExitsForVerify } from "./check.user.exist.verify";
import { IUserInterface } from "../app/userReg/user.interface";
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

// Extend Request interface to include user property
interface CustomRequest extends Request {
  user?: IUserInterface; // Define the type of user property here
}

export const verifyToken: RequestHandler = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token = req.headers?.authorization?.split(" ")?.[1];

    if (!token) {
      throw new ApiError(400, "Need Log In !");
    }

    const decoded = await promisify(jwt.verify)(
      token,
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5hem11bEBnbWFpbC5jb20iLCJpYXQiOjE2OTQ0MzExOTF9.xtLPsJrvJ0Gtr4rsnHh1kok51_pU10_hYLilZyBiRAM"
    );
    // const decoded = await promisify(jwt.verify)(token, process.env.ACCESS_TOKEN);

    const user_phone = decoded?.user_phone;

    const verifyUser = await checkAUserExitsForVerify(user_phone);
    if (
      verifyUser?.user_phone == user_phone &&
      verifyUser?.user_role == "admin" &&
      verifyUser?.user_status == "active"
    ) {
      req.user = decoded;
      next();
    } else {
      throw new ApiError(400, "Invalid User !");
    }
  } catch (error) {
    next(error);
  }
};
