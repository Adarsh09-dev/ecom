import UserModel from "../models/User-Model.js";
import bcrypt from "bcrypt";
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import uploadImageCloudinary from "../utils/uploadImagesCloudinary.js";
import generateOtp from "../utils/generatedOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";

// home page
export async function homePage(req, res) {
  res.render("home", { layout: false });
}

// SIGNUP REGISTER
export async function registerPage(req, res) {
  res.render("user-register", { layout: false });
}
export async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      req.session.message = "All fieldds required";
      return res.redirect("/register");
    }
    const user = await UserModel.findOne({ email });
    if (user) {
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
    res.redirect("/user/checkMail");
  } catch (error) {
    req.session.message = "something went wrong";
    return res.redirect("/register");
  }
}

// CHECK MAIL
export async function check_mail(req, res) {
  res.render("check-email", { layout: false });
}

// VERIFY EMAIL
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

// LOGIN PAGE
export async function loginPage(req, res) {
  res.render("user-login", { layout: false });
}

// LOGIN CONTROLLER
export async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.redirect("/login");
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return send("email cannot found");
      // return res.redirect("/login");
    }
    if (user.status !== "Active") {
      return res.redirect("/login");
    }

    // hash password
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.send("Wrong password");
    }
    req.session.user = {
      email: user.email,
      id: user._id,
    };

    res.locals.user = req.session.user;
    return res.redirect("/user/landing-page");
  } catch {
    console.error(error);
    res.status(500).send("Server error");
  }
}

// LOGOUT CONTROLLER
export async function logOutController(req, res) {
  try {
    req.session.destroy((error) => {
      if (error) {
        console.error(error);
        return res.redirect("/user/home");
      }
      res.clearCookie("connect.sid"); // session cookie name
      return res.redirect("/user/landing-page");
    });
  } catch {
    console.error(error);
    return res.redirect("/user/landing-page");
  }
}

// UPLOAD USER AVATAR
export async function uploadAvatar(req, res) {
  try {
    const userId = req.session.user; // session
    const image = req.file;

    const upload = await uploadImageCloudinary(image);

    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      avatar: upload.url,
    });

    return res.render("/profile ", {
      user: updateUser,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

// UPDATE USER DETAILS
export async function updateUserDetails(req, res) {
  try {
    const userId = req.session.user; // session
    const { name, email, mobile, password } = req.body;

    let hashPassword = "/profile";

    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
    }

    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      ...(name && { name: name }),
      ...(email && { email: email }),
      ...(mobile && { mobile: mobile }),
      ...(password && { password: hashPassword }),
    });

    return res.redirect("/profile", {
      user: updateUser,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

// FORGOT PASSWORD (NOT LOGIN)
// forgot page
export async function forgotPage(req, res) {
  res.render("user-forgot", { layout: false });
}
// forgot controller
export async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      req.session.message = "Email is required";
      return res.redirect("/user/forgot-password");
    }
    const user = await UserModel.findOne({ email });

    if (!user) {
      req.session.message = "Email not available";
      return res.redirect("/user/forgot-password");
    }
    const otp = generateOtp();
    const expireTime = new Date(Date.now() + 5 * 60 * 1000); // 5min
    await UserModel.findByIdAndUpdate(user.id, {
      forgot_password_otp: otp,
      forgot_password_expiry: expireTime,
    });

    await sendEmail({
      sendTo: email,
      subject: "Forgot password from Ecom",
      html: forgotPasswordTemplate({
        name: user.name,
        email: email,
        otp: otp,
      }),
    });
    req.session.resetEmail = email;

    // save session before redirect
    req.session.save(() => {
      res.redirect("/user/verify-otp");
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

// VERIFY FORGOT PASSWORD OTP
// verify page
export async function verifyPage(req, res) {
  res.render("user-otp", {
    layout: false,
    message: req.session.message || null,
    email: req.session.resetEmail || null,
  });

  //   req.session.message = null;
}

//VERIFY CONTROLLER
export async function verifyForgotPasswordOtp(req, res) {
  try {
    const { otp, email: formEmail } = req.body;
    const email = formEmail || req.session.resetEmail;
    console.log("SESSION EMAIL:", req.session.resetEmail);

    if (!email || !otp) {
      req.session.message = "Provide email and OTP";
      return res.redirect("/user/verify-otp");
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      req.session.message = "Email not available";
      return res.redirect("/user/verify-otp");
    }

    const currentTime = new Date();

    if (
      !user.forgot_password_expiry ||
      user.forgot_password_expiry < currentTime
    ) {
      console.log("DB OTP:", user?.forgot_password_otp);
      console.log("EXPIRY:", user?.forgot_password_expiry);
      req.session.message = "OTP is expired";
      return res.redirect("/user/verify-otp");
    }

    if (String(otp) !== String(user.forgot_password_otp)) {
      req.session.message = "Invalid OTP";
      return res.redirect("/user/verify-otp");
    }

    //  OTP Success
    user.forgot_password_otp = null;
    user.forgot_password_expiry = null;
    await user.save();

    req.session.isOtpVerified = true;
    req.session.resetEmail = email;

    return res.redirect("/user/reset-password");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

// RESET THE PASSWORD
// reset pswrd page
export async function resetPswrdPage(req, res) {
  res.render("user-resetPswrd", { layout: false });
}
// reset pswrd controller
export async function resetPassword(req, res) {
  try {
    const { newPassword, confirmPassword } = req.body;
    const email = req.session.resetEmail;

    console.log("body : ", req.body);
    console.log("BODY DATA:", email);

    // Check required fields
    if (!email || !newPassword || !confirmPassword) {
      req.session.message = "All fields are required";
      return res.redirect("/user/reset-password");
    }

    // Check required fields
    const user = await UserModel.findOne({ email });
    if (!user) {
      req.session.message = "user not found";
      return res.redirect("/user/reset-password");
    }

    // Check passsword match
    if (newPassword !== confirmPassword) {
      req.session.message = "Password do not match";
      return redirect("/user/reset-password");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await UserModel.findOneAndUpdate(user._id, {
      password: hashPassword,
    });

    req.session.message = "Password update successfully";
    return res.redirect("/user/login");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

// landing page
export async function landingPage(req, res) {
  res.render("landingPage", { layout: false });
}

// GET LOGIN USER DETAILS AND PROFILE PAGE
export async function profilePage(req, res) {
  console.log("check the profile : ");
  const user = await UserModel.findById(req.session.user.id);
  console.log("check the profile :ooooooooo ", req.session.user.id);
  console.log("check the profile :----------------- ", user);

  res.render("user-details", {
    layout: false,
    user,
  });
}

// UPDATE USER DATA

export async function updateUserData(req, res) {
   try {
    const userId = req.session.user.id; // or req.user._id
    console.log("33333333333",req.body)
   await UserModel.findByIdAndUpdate(userId, {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      address_detials: req.body.address
   }, {new :  true});

   console.log("updated..")
   res.redirect("/user/profile");

    console.log("updated..9999")
   } catch (error) {
    
     return res.status(500).send(error.message);
   }
  }
