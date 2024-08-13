import express from "express";
import { UserRegRoutes } from "../app/userReg/user.reg.routes";
import { UserLogRoutes } from "../app/userLog/user.login.routes";
import { UserGetMeRoutes } from "../app/getMe/get.me.routes";
import { Sub_CategoryRoutes } from "../app/sub_category/sub_category.routes";
import { CategoryRoutes } from "../app/category/category.routes";
import { ColorRoutes } from "../app/color/color.routes";
import { SiteSettingRoutes } from "../app/site_setting/site_setting.routes";
import { BannerRoutes } from "../app/banner/banner.routes";
import { Video_tabRoutes } from "../app/video_tab/video_tab.routes";
import { ProductRoutes } from "../app/product/product.routes";
import { ImageUploadRoutes } from "../helpers/frontend/imageUpload/imageUpload.routes";
import { VideoUploadRoutes } from "../helpers/frontend/videoUpload/video.upload.routes";
import { DashboardRoutes } from "../app/dashboard/dashboard.routes";
import { OrderRoutes } from "../app/order/order.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/userReg",
    route: UserRegRoutes,
  },
  {
    path: "/userlogin",
    route: UserLogRoutes,
  },
  {
    path: "/getMe",
    route: UserGetMeRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/sub_category",
    route: Sub_CategoryRoutes,
  },
  {
    path: "/color",
    route: ColorRoutes,
  },
  {
    path: "/banner",
    route: BannerRoutes,
  },
  {
    path: "/siteSetting",
    route: SiteSettingRoutes,
  },
  {
    path: "/video_tab",
    route: Video_tabRoutes,
  },
  {
    path: "/product",
    route: ProductRoutes,
  },
  {
    path: "/image_upload",
    route: ImageUploadRoutes,
  },
  {
    path: "/video_upload",
    route: VideoUploadRoutes,
  },
  {
    path: "/dashboard",
    route: DashboardRoutes,
  },
  {
    path: "/order",
    route: OrderRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
