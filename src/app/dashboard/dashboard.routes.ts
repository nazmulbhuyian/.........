import express from "express";
import { getDashboardData } from "./dashboard.controllers";
import { verifyToken } from "../../middlewares/verify.token";
const router = express.Router();

router.route("/").get(verifyToken, getDashboardData);

export const DashboardRoutes = router;
