import express from "express";
import {
  deleteAVideo_tabInfo,
  findAllDashboardVideo,
  findAllVideo_tab,
  postVideo_tab,
  updateVideo_tab,
} from "./video_tab.controllers";
import { verifyToken } from "../../middlewares/verify.token";
const router = express.Router();

// Create, Get Video_tab
router
  .route("/")
  .get(findAllVideo_tab)
  .post(verifyToken, postVideo_tab)
  .patch(verifyToken, updateVideo_tab)
  .delete(verifyToken, deleteAVideo_tabInfo);

router.route("/dashboard").get(verifyToken, findAllDashboardVideo);

export const Video_tabRoutes = router;
