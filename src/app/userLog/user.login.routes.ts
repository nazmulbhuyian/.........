import express from "express";
import {postLogUser, updateChangePasswordUser, } from "./user.login.controllers";
const router = express.Router();

// Create, Get User
router.route('/').post(postLogUser).patch(updateChangePasswordUser);

export const UserLogRoutes = router;
