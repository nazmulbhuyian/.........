import ApiError from "../../errors/ApiError";
import ProductModel from "../product/product.model";
import { IUserInterface } from "../userReg/user.interface";
import UserModel from "../userReg/user.model";
import { IOrderInterface, orderSearchableField } from "./order.interface";
import OrderModel from "./order.model";

// Check if a user exists in users
export const checkAUserIsExist = async (
  customer_phone: string
): Promise<IUserInterface | null> => {
  const user: IUserInterface | null = await UserModel.findOne({
    user_phone: customer_phone,
  });
  return user;
};

// Check quantity price for an order
export const postCheckOrderPriceQuantityServices = async (
  data: IOrderInterface,
  payment_method: any
): Promise<any> => {
  const { order_products, total_amount, pay_amount } = data;

  let updateCheck = 1;
  let totalPrice = 0;
  let partialPrice = 0;

  const checkOrderQuantityAndPrice = order_products?.map(
    async (orderItem: any) => {
      const query: any = {
        _id: orderItem?.productId,
      };

      if (orderItem?.size_variationId) {
        query["product_size_variation._id"] = orderItem?.size_variationId;
      }

      const product = await ProductModel.findOne(query);

      if (!product) {
        throw new ApiError(400, "Product not found!");
      }

      if (!orderItem?.size) {
        if (
          product?.product_discount_price &&
          orderItem?.price !== product?.product_discount_price
        ) {
          updateCheck = 0;
        } else if (
          !product?.product_discount_price &&
          orderItem?.price !== product?.product_price
        ) {
          updateCheck = 0;
        }
      } else {
        const sizeVariation: any = product?.product_size_variation?.find(
          (variation: any) =>
            variation?._id.toString() === orderItem?.size_variationId
        );
        if (
          sizeVariation?.discount_price &&
          orderItem?.price !== sizeVariation?.discount_price
        ) {
          updateCheck = 0;
        } else if (
          !sizeVariation?.discount_price &&
          orderItem?.price !== sizeVariation?.price
        ) {
          updateCheck = 0;
        } else if (
          !sizeVariation?.discount_price &&
          !sizeVariation?.price &&
          orderItem?.price !== product?.product_discount_price
        ) {
          updateCheck = 0;
        } else if (
          !sizeVariation?.discount_price &&
          !sizeVariation?.price &&
          !product?.product_discount_price &&
          orderItem?.price !== product?.product_price
        ) {
          updateCheck = 0;
        }
      }

      if (!orderItem?.size) {
        if (
          product?.product_quantity !== undefined &&
          product.product_quantity < orderItem?.quantity
        ) {
          updateCheck = 0;
        }
        const mainPrice =
          product?.product_discount_price ?? product?.product_price;
        totalPrice += mainPrice * orderItem?.quantity;
        if (product?.product_partial_payment_amount) {
          partialPrice +=
            product?.product_partial_payment_amount * orderItem?.quantity;
        }
      } else {
        const sizeVariation: any = product?.product_size_variation?.find(
          (variation: any) =>
            variation?._id.toString() === orderItem?.size_variationId
        );

        if (sizeVariation?.quantity !== undefined) {
          const checkQuantity = sizeVariation?.quantity - orderItem.quantity;

          if (checkQuantity < 0) {
            updateCheck = 0;
          }
          const mainPrice: any =
            sizeVariation?.discount_price ??
            sizeVariation?.price ??
            product?.product_discount_price ??
            product?.product_price;
          totalPrice += mainPrice * orderItem?.quantity;
          if (product?.product_partial_payment_amount) {
            partialPrice +=
              product?.product_partial_payment_amount * orderItem?.quantity;
          }
        } else {
          updateCheck = 0;
        }
      }
    }
  );
  await Promise.all(checkOrderQuantityAndPrice);
  if (total_amount !== totalPrice) {
    updateCheck = 0;
  }
  if (payment_method !== "online" && pay_amount != 0) {
    if (pay_amount !== partialPrice) {
      updateCheck = 0;
    }
  }

  return updateCheck;
};

// Post a order with card and initially pending
export const postInitialOrderServices = async (
  data: IOrderInterface
): Promise<IOrderInterface | {}> => {
  const createOrder = await OrderModel.create(data);
  return createOrder;
};

// post order with COD services
export const postOrderWithCardServices = async (
  data: IOrderInterface
): Promise<IOrderInterface | {}> => {
  const { order_products } = data;

  const updatePromises = order_products?.map(async (orderItem: any) => {
    if (orderItem?.size_variationId) {
      // Update for products with size variation
      return await ProductModel.findOneAndUpdate(
        {
          _id: orderItem?.productId,
          "product_size_variation._id": orderItem?.size_variationId,
        },
        {
          $inc: {
            "product_size_variation.$.quantity": -1 * orderItem.quantity,
          },
        },
        {
          new: true,
        }
      );
    } else {
      // Update for products without size variation
      return await ProductModel.findOneAndUpdate(
        {
          _id: orderItem?.productId,
        },
        {
          $inc: {
            product_quantity: -1 * orderItem.quantity,
          },
        },
        {
          new: true,
        }
      );
    }
  });

  // Wait for all updates to complete
  const updatedProducts = await Promise.all(updatePromises);

  return updatedProducts;
};

// post order with COD
export const postOrderWithCODServices = async (data: any) => {
  const createOrder = await OrderModel.create(data);
  if (!createOrder) {
    throw new ApiError(400, "Order confirm failed !");
  }

  const { order_products } = data;

  const updatePromises = order_products?.map(async (orderItem: any) => {
    if (orderItem?.size_variationId) {
      // Update for products with size variation
      return await ProductModel.findOneAndUpdate(
        {
          _id: orderItem?.productId,
          "product_size_variation._id": orderItem?.size_variationId,
        },
        {
          $inc: {
            "product_size_variation.$.quantity": -1 * orderItem.quantity,
          },
        },
        {
          new: true,
        }
      );
    } else {
      // Update for products without size variation
      return await ProductModel.findOneAndUpdate(
        {
          _id: orderItem?.productId,
        },
        {
          $inc: {
            product_quantity: -1 * orderItem.quantity,
          },
        },
        {
          new: true,
        }
      );
    }
  });

  // Wait for all updates to complete
  const updatedSizeVariations = await Promise.all(updatePromises);

  return updatedSizeVariations;
};

// Find A Order with tnx id
export const getAOrderTNXIDService = async (
  transaction_id: string
): Promise<IOrderInterface | any> => {
  const getAOrderData = await OrderModel.findOne({
    transaction_id: transaction_id,
  });
  return getAOrderData;
};

// Add A Order by card
export const postUpdateOrderQuantityWithCardServices = async (data: any) => {
  const { order_products } = data;

  const updatePromises = order_products?.map(async (orderItem: any) => {
    if (orderItem?.size_variationId) {
      // Update for products with size variation
      return await ProductModel.findOneAndUpdate(
        {
          _id: orderItem?.productId,
          "product_size_variation._id": orderItem?.size_variationId,
        },
        {
          $inc: {
            "product_size_variation.$.quantity": -1 * orderItem?.quantity,
          },
        },
        {
          new: true,
        }
      );
    } else {
      // Update for products without size variation
      return await ProductModel.findOneAndUpdate(
        {
          _id: orderItem?.productId,
        },
        {
          $inc: {
            product_quantity: -1 * orderItem?.quantity,
          },
        },
        {
          new: true,
        }
      );
    }
  });

  // Wait for all updates to complete
  const updatedProducts = await Promise.all(updatePromises);

  return updatedProducts;
};

// update Order when payment success
export const updateOrderPaymentSuccessService = async (
  transaction_id: string
): Promise<IOrderInterface | any> => {
  const updateCompleteOrderInfo: IOrderInterface | null =
    await OrderModel.findOne({
      transaction_id: transaction_id,
    });
  if (!updateCompleteOrderInfo) {
    throw new ApiError(400, "Order not found");
  }
  if (updateCompleteOrderInfo?.payment_type == "partial-paid") {
    const completeOrderUpdate = await OrderModel.updateOne(
      { transaction_id: transaction_id },
      {
        payment_status: "success",
        pay_amount: updateCompleteOrderInfo?.partial_pay_amount,
        due_amount:
          updateCompleteOrderInfo?.total_amount -
          updateCompleteOrderInfo?.partial_pay_amount,
      },
      {
        runValidators: true,
      }
    );
    return completeOrderUpdate;
  } else {
    const completeOrderUpdate = await OrderModel.updateOne(
      { transaction_id: transaction_id },
      {
        payment_type: "paid",
        payment_status: "success",
        pay_amount: updateCompleteOrderInfo?.total_amount,
        due_amount: 0,
      },
      {
        runValidators: true,
      }
    );
    return completeOrderUpdate;
  }
};

// delete Order when payment fail and cancel
export const deleteOrderPaymentFailService = async (
  transaction_id: string
): Promise<IOrderInterface | any> => {
  const deleteOrderInfo = await OrderModel.deleteOne({
    transaction_id: transaction_id,
  });
  return deleteOrderInfo;
};

// Find all dashboard Order
export const findAllDashboardOrderServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<IOrderInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: orderSearchableField.map((field: any) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findOrder: IOrderInterface[] | [] = await OrderModel.find(
    whereCondition
  )
    .populate([
      "customer_id",
      {
        path: "order_products.productId",
        model: "products",
      },
    ])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findOrder;
};

// find all specific order
export const findAllSpecificOrderServices = async (
  user_phone: string
): Promise<IOrderInterface[] | []> => {
  const order = await OrderModel.find({ customer_phone: user_phone })
    .populate([
      "customer_id",
      {
        path: "order_products.productId",
        model: "products",
      },
    ])

    .sort({ _id: -1 });
  return order;
};

// find all order data
export const getAllOrderInfoService = async (): Promise<
  IOrderInterface[] | []
> => {
  const order = await OrderModel.find({});
  return order;
};

// order status update operation

export const checkOrderStatusUpdateServices = async (
  _id: string
): Promise<IOrderInterface | null> => {
  const order = await OrderModel.findOne({ _id: _id })
    .populate({
      path: "order_products.productId",
      model: "products",
    })
    .sort({ _id: -1 });
  if (!order) {
    return null;
  }
  return order;
};

export const updateOrderStatusService = async (
  sendData: any
): Promise<IOrderInterface | any> => {
  const date = new Date();
  if (sendData?.order_status == "processing") {
    const orderStatusUpdate = await OrderModel.updateOne(
      { _id: sendData?._id },
      { processing_time: date, order_status: sendData?.order_status },
      {
        runValidators: true,
      }
    );
    return orderStatusUpdate;
  }
  if (sendData?.order_status == "complete") {
    const orderStatusUpdate = await OrderModel.updateOne(
      { _id: sendData?._id },
      { complete_time: date, order_status: sendData?.order_status },
      {
        runValidators: true,
      }
    );
    return orderStatusUpdate;
  }
  if (sendData?.order_status == "delivered") {
    const orderStatusUpdate = await OrderModel.updateOne(
      { _id: sendData?._id },
      { delivered_time: date, order_status: sendData?.order_status },
      {
        runValidators: true,
      }
    );
    return orderStatusUpdate;
  }
};

// update order type
export const updateAOrderTypeInfoService = async (
  _id: string,
  order_type: string
): Promise<IOrderInterface | any> => {
  const findOrder = await OrderModel.findOne({
    _id: _id,
  });
  if (!findOrder) {
    throw new ApiError(404, "Order not found");
  }
  const updateOrderInfo = await OrderModel.updateOne(
    {
      _id: _id,
    },
    {
      order_type: order_type,
      pay_amount: findOrder?.total_amount,
      due_amount: 0,
      payment_type: "paid",
      payment_status: "success",
    },
    {
      runValidators: true,
    }
  );
  return updateOrderInfo;
};

// order delete operration start
export const findDeleteAOrderInfoService = async (
  _id: string
): Promise<IOrderInterface | any> => {
  const getDeleteOrderInfo = await OrderModel.findOne({
    _id: _id,
  });
  return getDeleteOrderInfo;
};

export const deleteAOrderInfoService = async (
  _id: string
): Promise<IOrderInterface | any> => {
  const deleteOrderInfo = await OrderModel.deleteOne(
    {
      _id: _id,
    },
    {
      runValidators: true,
    }
  );
  return deleteOrderInfo;
};

// get order Tracking info
export const getOrderTrackingInfoService = async (
  order_id: string,
  customer_phone: string
): Promise<IOrderInterface | any> => {
  const getOrderTrackingInformation = await OrderModel.findOne({
    order_id: order_id,
    customer_phone: customer_phone,
  }).populate([
    "customer_id",
    {
      path: "order_products.productId",
      model: "products",
    },
  ]);
  return getOrderTrackingInformation;
};
