import { Router } from "express";
import {
  loginPage,
  registerUserController,
  registerPage,
  forgotPage,
  verifyPage,
  resetPswrdPage,
  // homePage,
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

const userRouter = Router();

userRouter.get("/login", loginPage);
userRouter.post("/login", loginController);

userRouter.get("/signup", registerPage);
userRouter.post("/register", registerUserController);
userRouter.get("/checkMail", check_mail);

userRouter.post("/verify-email", verifyEmailController);

// userRouter.get("/home", isAuthenticated, homePage);

userRouter.post("/logout", logOutController);

userRouter.put("/update-user", updateUserDetails);

userRouter.get("/forgot-password", forgotPage);
userRouter.post("/forgot-password-controller", forgotPasswordController);

userRouter.get("/verify-otp", verifyPage);
userRouter.post("/verify-forgot-password-otp", verifyForgotPasswordOtp);

userRouter.get("/reset-password", resetPswrdPage);
userRouter.post("/reset-password", redirectAuthenticated, resetPassword);

userRouter.get("/landing-page", landingPage);

userRouter.get("/", profilePage);
userRouter.put(
  "/updated-profile",
  upload.single("profile_image"),
  updateUserData,
);
userRouter.put(
  "/upload-avatar",
  upload.single("profile_image"),
  uploadAvatar,
);

export default userRouter;
