import { Router } from "express";
import { isAuthenticated, redirectAuthenticated } from "../middleware/auth.js";
import uploadImageController from "../controllers/uploadImageController.js";
import upload from "../middleware/multer.js";

const uploadRouter = Router();

uploadRouter.post(
  "/upload",
  redirectAuthenticated,
  upload.single("image"),
  uploadImageController,
);

export default uploadRouter;
