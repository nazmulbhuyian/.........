import { IOrderInterface } from "../order/order.interface";
import OrderModel from "../order/order.model";

// get today sell data
export const getTodaySellDataService = async (): Promise<any | {}> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set hours to the beginning of the day
  const getTodaySellData = await OrderModel.countDocuments({
    createdAt: { $gte: today },
  });
  return getTodaySellData;
};

// get week sell data
export const getThisWeekSellDataService = async (): Promise<any | {}> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstDayOfWeek = new Date(today);
  const dayOfWeek = today.getDay(); // Get the current day of the week
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Calculate the difference to the previous Sunday
  firstDayOfWeek.setDate(diff);
  const getThisWeekSellData = await OrderModel.find({
    createdAt: { $gte: firstDayOfWeek },
  });
  return getThisWeekSellData;
};

// get month sell data
export const getThisMonthSellDataService = async (): Promise<any | {}> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const getThisMonthSellData = await OrderModel.find({
    createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
  });

  return getThisMonthSellData;
};

// get today sell data
export const getThisYearSellDataService = async (): Promise<any | {}> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

  const getThisYearSellData = await OrderModel.find({
    createdAt: { $gte: firstDayOfYear },
  });
  return getThisYearSellData;
};

// find all order info for total sum
export const getAllOrderInfoService = async (): Promise<
  IOrderInterface[] | any
> => {
  const order = await OrderModel.find({ order_type: "success" });
  return order;
};
