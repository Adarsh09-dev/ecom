import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDB.js";
import userRouter from "./route/user.route.js";
// ...existing code...
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import flash from "connect-flash"; // added: flash messages
import session from "express-session"; // added: required for flash
import categoryRouter from "./route/category.route.js";
// import uploadRouter from "./route/upload.router.js";
import adminRouter from "./route/admin.route.js";
import subCatgoryRouter from "./route/sub-category.route.js";
const app = express();
// await connectDB();

//Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//method override
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ensure this is present
app.use(methodOverride("_method")); // add this line here

//Static Files
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

// session (required for flash)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_this_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  }),
);

// flash
app.use(flash());

// // expose flash to views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// // expose user to views
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use(
  cors({
    credentials: true,
    origin: process.env.FORTEND_URL,
  }),
);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

//  EJS Templating Engine Setup
app.set("views", path.join(__dirname, "views"));
app.use(expressEjsLayouts);
app.set("layout", "layouts/main");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.json({ message: "server running" });
});

// CACHE CLEAR
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

//HELMET
// Static files
app.use(express.static(path.join(__dirname, "public")));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],

        connectSrc: ["'self'", "http://localhost:5000"],

        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  }),
);

//  router
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/sub-category",subCatgoryRouter)
// app.use("/file", uploadRouter);

connectDB().then(() => {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
