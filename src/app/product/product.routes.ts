import express from "express";
import {
  deleteAProductInfo,
  findASpecificProduct,
  findAllDashboardProduct,
  findAllFilteredProduct,
  findAllProduct,
  findAllRelatedProduct,
  getCategoryMatchProduct,
  postProduct,
  updateProduct,
} from "./product.controllers";
import { verifyToken } from "../../middlewares/verify.token";
const router = express.Router();

// Create, Get Product
router
  .route("/")
  .get(findAllProduct)
  .post(verifyToken, postProduct)
  .patch(verifyToken, updateProduct)
  .delete(verifyToken, deleteAProductInfo);

// get all dashboard product
router.route("/dashboard_product").get(verifyToken, findAllDashboardProduct);

// get all Filtered product
router.route("/filter_product").get(findAllFilteredProduct);

// Get category match product for home page
router.route("/category_match_product").get(getCategoryMatchProduct);

// get realted product
router
  .route("/get_related_product/:product_related_slug")
  .get(findAllRelatedProduct);

// get a specific product
router.route("/:product_slug").get(findASpecificProduct);

export const ProductRoutes = router;
