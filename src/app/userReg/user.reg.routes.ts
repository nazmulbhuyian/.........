import express from "express";
import { deleteAUser, getAllUser, patchUserAccountStatusUpdate, postRegUser } from "./user.reg.controllers";
import { verifyToken } from "../../middlewares/verify.token";
const router = express.Router();

// Create, Get User
router
  .route("/")
  .get(verifyToken, getAllUser)
  .post(postRegUser)
  .delete(deleteAUser);

// update User status
router.route('/update_user_status').patch(patchUserAccountStatusUpdate)

export const UserRegRoutes = router;
