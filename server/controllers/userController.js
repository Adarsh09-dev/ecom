import UserModel from "../models/User-Model.js";
import bcrypt from "bcrypt";
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";

// login page
export async function loginPage(req, res) {
  res.render("user-login", { layout: false });
}

// home page
export async function homePage(req, res) {
  res.render("/home", { layout: false });
}

// forgot page
export async function forgotPage(req, res) {
  res.render("user-forgot", { layout: false });
}

// verify page
export async function verifyPage(rep, res) {
  res.render("user-otp", { layout: false });
}

// reset pswrd page
export async function resetPswrdPage(req, res) {
  res.render("user-resetPswrd", { layout: false });
}

// signup page
export async function registerPage(req, res) {
  res.render("user-register", { layout: false });
}
export async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "provide email, name, password",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (user) {
      return res.json({
        message: "All ready redgister",
        error: true,
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const payload = {
      name,
      email,
      password: hashPassword,
    };

    const newUser = new UserModel(payload);
    const save = await newUser.save();
    const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify email from Ecom",
      html: verifyEmailTemplate({
        name,
        email,
        url: VerifyEmailUrl,
      }),
    });

    return res.redirect("/views/home");
  } catch (error) {
    console.log("err msg", error);
    return res.status(500).json({
      message: error.message || error,
      status: true,
      success: false,
    });
  }
}
