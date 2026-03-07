import { Router } from "express";
import {
  adminLoginPage,
  adminLoginController,
  adminLogoutController,
} from "../controllers/adminController.js";

// import { redirectAuthenticatedAdmin } from "../middleware/admin-auth.js";

const adminRouter = Router();

adminRouter.get("/", adminLoginPage);
adminRouter.post("/", adminLoginController);
adminRouter.post("/logout", adminLogoutController);

export default adminRouter;
