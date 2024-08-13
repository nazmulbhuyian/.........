import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import UserModel from "../userReg/user.model";
import ProductModel from "../product/product.model";
import OrderModel from "../order/order.model";
import {
  getAllOrderInfoService,
  getThisMonthSellDataService,
  getThisWeekSellDataService,
  getThisYearSellDataService,
  getTodaySellDataService,
} from "./dashboard.services";

// get main search product
export const getDashboardData: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const allCustomerCount = await UserModel.countDocuments();
    const allProductCount = await ProductModel.countDocuments();
    const allOrderCount = await OrderModel.countDocuments();
    const todaySellCount = await getTodaySellDataService();
    const thisWeekSellData = await getThisWeekSellDataService();
    const thisMonthSellData = await getThisMonthSellDataService();
    const thisYearSellData = await getThisYearSellDataService();

    const successData = await getAllOrderInfoService();
    // Initialize total price
    let totalPrice = 0;

    // Iterate through 'success' data and sum up the prices
    if (successData?.length > 0) {
      successData.forEach((order: any) => {
        totalPrice += order?.total_amount;
      });
    }
    const sendData = {
      allCustomerCount,
      allProductCount,
      todaySellCount,
      thisMonthSellData,
      thisWeekSellData,
      thisYearSellData,
      allOrderCount,
      totalPrice,
    };
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order Found successfully !",
      data: sendData,
    });
  } catch (error: any) {
    next(error);
  }
};
