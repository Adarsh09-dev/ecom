import { Router } from "express";
import {
  loginPage,
  registerUserController,
  registerPage,
  forgotPage,
  verifyPage,
  resetPswrdPage,
  homePage,
  verifyEmailController,
  loginController,
  logOutController,


} from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const userRouter = Router();

userRouter.get("/login", loginPage);
userRouter.post("/login",loginController);

userRouter.get("/signup", registerPage);
userRouter.post("/register", registerUserController);

userRouter.post("/verify-email",verifyEmailController);

userRouter.get("/home", homePage);
userRouter.get("/forgot-password", forgotPage);
userRouter.get("/verify-otp", verifyPage);
userRouter.get("/reset-password", resetPswrdPage);

userRouter.get("/logout",auth,logOutController);





export default userRouter;
