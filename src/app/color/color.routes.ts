import express from "express";
import { deleteColor, findAllColor, postColor, updateColor } from "./color.controllers";
import { verifyToken } from "../../middlewares/verify.token";
const router = express.Router();

// Create, Get Color
router
  .route("/")
  .get(findAllColor)
  .post(verifyToken, postColor)
  .patch(verifyToken, updateColor)
  .delete(verifyToken, deleteColor);

export const ColorRoutes = router;
