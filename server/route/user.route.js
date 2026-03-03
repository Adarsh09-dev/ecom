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
  uploadAvatar,
  updateUserDetails,
  forgotPasswordController,
  verifyForgotPasswordOtp,
  resetPassword,
  landingPage,
  profilePage,
  updateUserData,
} from "../controllers/userController.js";
import { isAuthenticated, redirectAuthenticated } from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import multer from "multer";

const userRouter = Router();

userRouter.get("/login", redirectAuthenticated, loginPage);
userRouter.post("/login", redirectAuthenticated, loginController);

userRouter.get("/signup", registerPage);
userRouter.post("/register", redirectAuthenticated, registerUserController);
userRouter.get("/checkMail", check_mail);

userRouter.post("/verify-email", verifyEmailController);

userRouter.get("/home", isAuthenticated, homePage);

userRouter.post("/logout", isAuthenticated, logOutController);

userRouter.put("/update-user", redirectAuthenticated, updateUserDetails);

userRouter.get("/forgot-password", redirectAuthenticated, forgotPage);
userRouter.post("/forgot-password-controller", forgotPasswordController);

userRouter.get("/verify-otp", verifyPage);
userRouter.post("/verify-forgot-password-otp", verifyForgotPasswordOtp);

userRouter.get("/reset-password", resetPswrdPage);
userRouter.post("/reset-password", redirectAuthenticated, resetPassword);

userRouter.get("/landing-page", landingPage);

userRouter.get("/profile", isAuthenticated, profilePage);
userRouter.put(
  "/updated-profile",
  isAuthenticated,
  upload.single("profile_image"),
  updateUserData,
);
userRouter.put(
  "/upload-avatar",
  isAuthenticated,
  upload.single("profile_image"),
  uploadAvatar,
);

export default userRouter;
