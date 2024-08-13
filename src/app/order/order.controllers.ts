import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import {
  checkAUserIsExist,
  getAOrderTNXIDService,
  postCheckOrderPriceQuantityServices,
  postInitialOrderServices,
  postUpdateOrderQuantityWithCardServices,
  updateOrderPaymentSuccessService,
  postOrderWithCODServices,
  findAllDashboardOrderServices,
  findAllSpecificOrderServices,
  getAllOrderInfoService,
  checkOrderStatusUpdateServices,
  updateOrderStatusService,
  findDeleteAOrderInfoService,
  updateAOrderTypeInfoService,
  deleteAOrderInfoService,
  getOrderTrackingInfoService,
} from "./order.services";
import { IUserInterface } from "../userReg/user.interface";
import { generateOrderID } from "../../utils/generate.order.id";
import { generateTRNXID } from "../../utils/generate.trnx.id";
import { IOrderInterface, IOrderProductInterface } from "./order.interface";
import OrderModel from "./order.model";
import { getSiteSettingServices } from "../site_setting/site_setting.services";
import { ISiteSettingInterface } from "../site_setting/site_setting.interface";
require('dotenv').config();

// Stripe Payment Intent
export const stripePaymentIntent: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const totalPrice = req.body.totalPrice;

    if (typeof totalPrice !== 'number' || isNaN(totalPrice) || totalPrice <= 0 || !totalPrice) {
      throw new ApiError(400, "Invalid total price !");
    }

    const amount = Math.round(totalPrice * 100); //convert to cents

    const stripeCredentialsData: ISiteSettingInterface | any = await getSiteSettingServices();

    const stripeCredentials = stripeCredentialsData[0];

    if (!stripeCredentials?.stripe_secret_key || !stripeCredentials?.stripe_primary_key || !stripeCredentials?.stripe_active || !stripeCredentials?.currency_code) {
      throw new ApiError(400, "Stripe not available !");
    }

    const stripe = require("stripe")(stripeCredentials?.stripe_secret_key);

    const paymentIntent = await stripe.paymentIntents.create({
      currency: stripeCredentials?.currency_code,
      amount: amount,
      payment_method_types: ['card'],
    });

    const clientSecret: any = paymentIntent?.client_secret;

    return sendResponse<IOrderInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Client Secret Found Successfully !",
      data: clientSecret,
    });

  } catch (error: any) {
    next(error);
  }
};

// Post Order
export const postAOrder: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IOrderInterface | any> => {
  try {
    const totalData = req.body;
    const { customer_phone, customer_name } = totalData;
    if (!customer_phone) {
      throw new ApiError(400, "Must send phone number !");
    }

    const checkUserExist: IUserInterface | null = await checkAUserIsExist(
      customer_phone
    );

    if (!checkUserExist) {
      throw new ApiError(400, "You are not log in !");
    }

    if (checkUserExist?.user_status == "in-active") {
      throw new ApiError(400, "User not valid !");
    }

    const order_id = await generateOrderID();
    const transaction_id = totalData?.transaction_id ? totalData?.transaction_id : await generateTRNXID();

    let result: any = await postCheckOrderPriceQuantityServices(
      totalData,
      totalData?.payment_method
    );
    if (result == 0) {
      throw new ApiError(400, "Not enough quantity or price !");
    }
    if (result == 1 && totalData?.payment_method == "partial") {
      const sendData = { ...totalData, order_id, transaction_id };
      const partial_pay_amount = sendData?.partial_pay_amount;
      sendData.order_status = "pending";
      sendData.pending_time = new Date();
      sendData.payment_status = "pending";
      sendData.order_type = "pending";
      (sendData.payment_type = "partial-paid"), delete sendData.customer_name;
      const initialOrder = await postInitialOrderServices(sendData);
      if (initialOrder) {
        if (totalData?.online_payment_method == "stripe") {
          const transaction_id = sendData?.transaction_id;
          const findOrder = await getAOrderTNXIDService(transaction_id);
          const result2 = await postUpdateOrderQuantityWithCardServices(findOrder);
          if (result2) {
            const result = await updateOrderPaymentSuccessService(transaction_id);
            if (result?.modifiedCount > 0) {
              return sendResponse<IOrderInterface>(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: "Order Found Successfully !",
                data: transaction_id,
              });
            } else {
              throw new ApiError(400, "Order Update failed !");
            }
          } else {
            throw new ApiError(400, "Order confirm failed !");
          }
        }
      } else {
        throw new ApiError(400, "Order confirm failed !");
      }
    } else if (result == 1 && totalData?.payment_method == "online") {
      const sendData = { ...totalData, order_id, transaction_id };
      sendData.order_status = "pending";
      sendData.pending_time = new Date();
      sendData.payment_status = "pending";
      sendData.order_type = "pending";
      (sendData.payment_type = "un-paid"), delete sendData.customer_name;
      const initialOrder = await postInitialOrderServices(sendData);
      if (initialOrder) {
        if (totalData?.online_payment_method == "stripe") {
          const transaction_id = sendData?.transaction_id;
          const findOrder = await getAOrderTNXIDService(transaction_id);
          const result2 = await postUpdateOrderQuantityWithCardServices(findOrder);
          if (result2) {
            const result = await updateOrderPaymentSuccessService(transaction_id);
            if (result?.modifiedCount > 0) {
              return sendResponse<IOrderInterface>(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: "Order Found Successfully !",
                data: transaction_id,
              });
            } else {
              throw new ApiError(400, "Order Update failed !");
            }
          } else {
            throw new ApiError(400, "Order confirm failed !");
          }

        }
      } else {
        throw new ApiError(400, "Order confirm failed !");
      }
    } else {
      const sendData = { ...totalData, order_id };
      sendData.order_status = "pending";
      sendData.pending_time = new Date();
      sendData.payment_status = "pending";
      sendData.order_type = "pending";
      (sendData.payment_type = "un-paid"), delete sendData.customer_name;
      const result2 = await postOrderWithCODServices(sendData);
      if (result2) {
        return sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Order confirm !",
          data: "",
        });
      } else {
        throw new ApiError(400, "Order confirm failed !");
      }
    }
  } catch (error: any) {
    next(error);
  }
};

// Find all dashboard order
export const findAllDashboardOrder: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IOrderInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IOrderInterface[] | any = await findAllDashboardOrderServices(
      limitNumber,
      skip,
      searchTerm
    );
    const total = await OrderModel.countDocuments();
    return sendResponse<IOrderInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find All Specific Order
export const findAllSpecificOrder: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IOrderInterface | any> => {
  try {
    const { user_phone } = req.params;
    const result: IOrderInterface[] | any = await findAllSpecificOrderServices(
      user_phone
    );
    const total = await OrderModel.countDocuments();
    return sendResponse<IOrderInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getTotalOrderInfo: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IOrderInterface | any> => {
  try {
    const data: any = await getAllOrderInfoService();
    const totalOrder = await OrderModel.countDocuments();
    const pendingData = data.filter(
      (item: any) => item?.order_type === "pending"
    );
    const pendingOrder = pendingData.length;
    const successData = data.filter(
      (item: any) => item?.order_type === "success"
    );
    const successOrder = successData.length;
    const cancelData = data.filter(
      (item: any) => item?.order_type === "cancel"
    );
    const cancelOrder = cancelData.length;

    // Initialize total price
    let totalPrice = 0;

    if (successData?.length > 0) {
      successData.forEach((order: any) => {
        totalPrice += order.total_amount;
      });
    }
    const sendData = {
      totalOrder,
      pendingOrder,
      successOrder,
      totalPrice,
      cancelOrder,
    };

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order get successfully !",
      data: sendData,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatusInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IOrderInterface | any> => {
  try {
    const { order_status, _id } = req.body;
    const checkOrderExist: IOrderInterface | null =
      await checkOrderStatusUpdateServices(_id);
    if (!checkOrderExist) {
      throw new ApiError(400, "Order not found !");
    }
    if (order_status == "pending") {
      if (
        checkOrderExist.processing_time ||
        checkOrderExist.complete_time ||
        checkOrderExist.delivered_time
      ) {
        throw new ApiError(400, "Dont update it !");
      }
    }
    if (order_status == "processing") {
      if (checkOrderExist.complete_time || checkOrderExist.delivered_time) {
        throw new ApiError(400, "Dont update it !");
      }
    }
    if (order_status == "complete") {
      if (checkOrderExist.delivered_time) {
        throw new ApiError(400, "Dont update it !");
      }
    }
    if (order_status == "delivered") {
      if (checkOrderExist.delivered_time) {
        throw new ApiError(400, "Already update it !");
      }
    }
    if (order_status == "processing") {
      if (checkOrderExist.pending_time == undefined) {
        throw new ApiError(400, "Must update previous status !");
      }
    }
    if (order_status == "complete") {
      if (
        checkOrderExist.pending_time == undefined ||
        checkOrderExist.processing_time == undefined
      ) {
        throw new ApiError(400, "Must update previous status !");
      }
    }
    if (order_status == "delivered") {
      if (
        checkOrderExist.pending_time == undefined ||
        checkOrderExist.processing_time == undefined ||
        checkOrderExist.complete_time == undefined
      ) {
        throw new ApiError(400, "Must update previous status !");
      }
    }
    const sendData = {
      order_status,
      _id,
    };
    const result = await updateOrderStatusService(sendData);
    if (result?.modifiedCount > 0) {
      return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order status update successfully !",
        data: result,
      });
    } else {
      throw new ApiError(400, "Order status update failed !");
    }
  } catch (error) {
    next(error);
  }
};

// Order type update
export const updateAOrderTypeInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IOrderInterface | any> => {
  try {
    const { _id, order_type } = req.body;
    const findUpdateOrderType: IOrderProductInterface | any =
      await findDeleteAOrderInfoService(_id);
    if (!findUpdateOrderType) {
      throw new ApiError(400, "Order found failed !");
    }
    if (
      findUpdateOrderType?.order_status !== "delivered" &&
      order_type == "success"
    ) {
      throw new ApiError(400, "Must be need order status Delivered !");
    }
    if (
      findUpdateOrderType?.payment_status == "success" &&
      (findUpdateOrderType?.payment_type == "paid" ||
        findUpdateOrderType?.payment_type == "partial-paid") &&
      order_type == "cancel"
    ) {
      throw new ApiError(400, "Don't access for cancel it !");
    }
    if (
      findUpdateOrderType?.order_type == "success" ||
      findUpdateOrderType?.order_type == "cancel"
    ) {
      throw new ApiError(400, "Don't access for edit it !");
    }
    if (
      findUpdateOrderType?.order_status === "delivered" &&
      (order_type == "cancel" || order_type == "pending")
    ) {
      throw new ApiError(400, "Don't access for cancel it !");
    }
    const result: IOrderProductInterface | any =
      await updateAOrderTypeInfoService(_id, order_type);
    if (result?.modifiedCount > 0) {
      return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order type update successfully !",
        data: result,
      });
    } else {
      throw new ApiError(400, "Order type update failed !");
    }
  } catch (error) {
    next(error);
  }
};

// Order Delete
export const deleteAOrderInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IOrderInterface | any> => {
  try {
    const _id = req.body._id;
    const findDeleteOrder: IOrderProductInterface | any =
      await findDeleteAOrderInfoService(_id);
    if (!findDeleteOrder) {
      throw new ApiError(400, "Order found failed !");
    }
    if (
      findDeleteOrder?.payment_status == "success" &&
      (findDeleteOrder?.payment_type == "paid" ||
        findDeleteOrder?.payment_type == "partial-paid")
    ) {
      throw new ApiError(400, "Don't access for delete it !");
    }
    const result: IOrderProductInterface | any = await deleteAOrderInfoService(
      _id
    );
    if (result?.deletedCount > 0) {
      return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order delete successfully !",
        data: result,
      });
    } else {
      throw new ApiError(400, "Order delete failed !");
    }
  } catch (error) {
    next(error);
  }
};

// Order tracking
export const getOrderTrackingInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IOrderInterface | any> => {
  try {
    const { order_id, customer_phone } = req.body;
    if (!order_id || !customer_phone) {
      throw new ApiError(400, "Must submit order id and phone number !");
    }
    const result: IOrderProductInterface | any =
      await getOrderTrackingInfoService(order_id, customer_phone);
    if (result) {
      return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order get successfully !",
        data: result,
      });
    } else {
      throw new ApiError(400, "Order found failed !");
    }
  } catch (error) {
    next(error);
  }
};
