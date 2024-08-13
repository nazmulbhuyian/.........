import express from "express";
import {
  deleteASubCategory,
  findAllDashboardSub_Category,
  findAllSub_Category,
  postSub_Category,
  updateSub_Category,
} from "./sub_category.controllers";
import { verifyToken } from "../../middlewares/verify.token";
const router = express.Router();

// Create, Get Sub_category
router
  .route("/")
  .get(findAllSub_Category)
  .post(verifyToken, postSub_Category)
  .patch(verifyToken, updateSub_Category)
  .delete(verifyToken, deleteASubCategory);

// get all sub_category in dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardSub_Category);

export const Sub_CategoryRoutes = router;
