import OrderModel from "../app/order/order.model";

// generate order id
export const generateOrderID = async () => {
  let isUnique = false;
  let uniqueOrderId: any;

  while (!isUnique) {
    // Check if the generated ID is unique
    uniqueOrderId = Math.floor(100000 + Math.random() * 900000);

    const existingOrder: any = await OrderModel.findOne({ order_id: uniqueOrderId });

    // If no existing order found, mark the ID as unique
    if (!existingOrder) {
      isUnique = true;
    }
  }

  return uniqueOrderId;
};

