import UserModel from "../models/User-Model.js";
import bcrypt from "bcrypt";
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generatedAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/genarateRefreshToken.js";

// home page
export async function homePage(req, res) {
  res.render("home", { layout: false });
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

    return res.redirect("/home");
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      status: true,
      success: false,
    });
  }
}

// verify email
export async function verifyEmailController(req, res) {
  try {
    const { code } = req.body;

    const user = await UserModel.findOne({ _id: code });

    if (!user) {
      return res.status(400).json({
        message: "invalid code",
        error: true,
        success: false,
      });
    }

    const updateUser = await UserModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      },
    );

    return res.json({
      message: "Verify email done",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      sucess: true,
    });
  }
}

// login page
export async function loginPage(req, res) {
  res.render("user-login", { layout: false });
}

// LOGIN CONTROLLER
export async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.redirect("/login");

      // status(400).json({
        // message: "provide the email",
        // error: true,
        // success: false,
      // });
    }
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.redirect("/login");
      // status(400).json({
      //   message: "User not register",
      //   error: true,
      //   success: false,
      // });
    }
    if (user.status !== "Active") {
      return res.redirect("/login")
      // status(400).json({
      //   message: "Connect to Admin",
      //   error: true,
      //   success: false,
      // });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.redirect("/login")
    //   status(400).json({
    //     message: "Check your password",
    //     error: true,
    //     success: false,
    //   });
     }
    const accesstoken = await generatedAccessToken(user._id);
    // const refreshToken = await generateRefreshToken(user._id);
    const cookiesOption = {
      httpOnly: true,
      secure: true,       // true only if HTTPS
      sameSite: "None",
    };
    // res.cookie("accessToken", accesstoken, cookiesOption);
    // res.cookie("refreshToken", refreshToken, cookiesOption);

    return res.redirect("/home");

    // console.log(
    //   "error 9;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;",
    // );
    // // THIS POSTMAN CHECK CODE
    // return res.json({
    //   message: "Login successfuly",
    //   error: true,
    //   success: false,
    //   data: {
    //     accesstoken,
    //     refreshToken,
    //   },
    // });
  } catch (error) {
    return res.redirect("/login");
    // return res.status(500).json({
    //   message: error.message || error,
    //   error: true,
    //   success: false,
    // });
  }
}

// LOGOUT CONTROLLER
export async function logOutController(req, res) {
  try {
    const userid = req.userId //middleware
    const cookiesOption = {
      httpOnly: true,
      secure: true,    // set false if local HTTP
      sameSite: "None",
    };

    // remove refresh token from DB
    res.clearCookie("accessToken",cookiesOption);
    res.clearCookie("refreshToken",cookiesOption);

      await UserModel.findByIdAndUpdate(userid,{
      refresh_token : "",
    })

    return res.redirect("/login")
    // json({
    //   message : 'logout successfully',
    //   error : false,
    //   success : true
    // })
  } catch (error) {
    return res.redirect("/login")
    // .status(500).json({
    //   message: error.message || error,
    //   error: true,
    //   success: false,
    // });
  }
}
