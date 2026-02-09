import { Router } from "express";
import {
  loginPage,
  registerUserController,
  registerPage,
  forgotPage,
  verifyPage,
  resetPswrdPage,
} from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/login", loginPage);
userRouter.get("/signup", registerPage);
userRouter.get("/forgot-password", forgotPage);
userRouter.get("/verify-otp", verifyPage);
userRouter.get("/reset-password", resetPswrdPage);

userRouter.post("/register", registerUserController);

export default userRouter;
