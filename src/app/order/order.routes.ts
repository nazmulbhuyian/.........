import express from "express";
import {
    deleteAOrderInfo,
  findAllDashboardOrder,
  findAllSpecificOrder,
  getOrderTrackingInfo,
  getTotalOrderInfo,
  postAOrder,
  stripePaymentIntent,
  updateAOrderTypeInfo,
  updateOrderStatusInfo,
} from "./order.controllers";
import { verifyToken } from "../../middlewares/verify.token";
const router = express.Router();

// get post delete and update Order Item
router
  .route("/")
  .get(verifyToken, findAllDashboardOrder)
  .post(postAOrder)
  .patch(verifyToken, updateOrderStatusInfo)
  .delete(verifyToken, deleteAOrderInfo);

// total order information
router.route("/total_order").get(verifyToken, getTotalOrderInfo);

// update a order type
router.route("/update_order_type").patch(verifyToken, updateAOrderTypeInfo);

// get order tracking info
router.route("/order_tracking").post(getOrderTrackingInfo);

// get specific person order
router.route("/stripe/create-payment-intent").post(stripePaymentIntent);

// get specific person order
router.route("/:user_phone").get(findAllSpecificOrder);

export const OrderRoutes = router;
