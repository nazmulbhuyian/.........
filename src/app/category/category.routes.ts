import express from "express";
import { FileUploadHelper } from "../../helpers/image.upload";
import {
  deleteACategory,
  findAllCategory,
  findAllDashboardCategory,
  getBannerMatchChild_Sub_Category,
  postCategory,
  updateCategory,
} from "./category.controllers";
import { verifyToken } from "../../middlewares/verify.token";
const router = express.Router();

// Create, Get category
router
  .route("/")
  .get(findAllCategory)
  .post(
    verifyToken,
    FileUploadHelper.ImageUpload.fields([
      { name: "category_logo", maxCount: 1 },
    ]),
    postCategory
  )
  .patch(
    verifyToken,
    FileUploadHelper.ImageUpload.fields([
      { name: "category_logo", maxCount: 1 },
    ]),
    updateCategory
  )
  .delete(verifyToken, deleteACategory);

  // get banner category subCategory and childCategory
router.route('/banner_match_category').get(getBannerMatchChild_Sub_Category);

  router.route("/dashboard").get(verifyToken, findAllDashboardCategory);

export const CategoryRoutes = router;
