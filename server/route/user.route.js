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
  check_mail,
} from "../controllers/userController.js";
import { isAuthenticated, redirectAuthenticated } from "../middleware/auth.js";

const userRouter = Router();

userRouter.get("/login", redirectAuthenticated, loginPage);
userRouter.post("/login", redirectAuthenticated, loginController);

userRouter.get("/signup", registerPage);
userRouter.post("/register", redirectAuthenticated, registerUserController);
userRouter.get("/checkMail", check_mail);

userRouter.post("/verify-email", verifyEmailController);

userRouter.get("/home", isAuthenticated, homePage);
userRouter.post("/home", isAuthenticated, homePage);

userRouter.get("/forgot-password", isAuthenticated, forgotPage);
userRouter.post("/forgot-password", isAuthenticated, forgotPage);

userRouter.get("/verify-otp", isAuthenticated, verifyPage);
userRouter.post("/verify-otp", isAuthenticated, verifyPage);

userRouter.get("/reset-password", isAuthenticated, resetPswrdPage);
userRouter.post("/reset-password", isAuthenticated, resetPswrdPage);

userRouter.post("/logout", isAuthenticated, logOutController);

export default userRouter;
