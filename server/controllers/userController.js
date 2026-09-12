import UserModel from "../models/User-Model.js";
import bcrypt from "bcrypt";
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import uploadImageCloudinary from "../utils/uploadImagesCloudinary.js";
import generateOtp from "../utils/generatedOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import ProductModel from "../models/Product-Models.js";
import session from "express-session";
import flash from "connect-flash";

// home page
export const landingPage = async (req, res) => {
  try {
    const products = await ProductModel.find()
      .populate("categoryId")
      .populate("subCategoryId")
      .sort({ createdAt: -1 })
      .limit(6);

    res.render("landingPage", {
      products,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

// SIGNUP REGISTER
export async function registerPage(req, res) {
  res.render("user-register", { layout: false });
}

export async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      req.flash("error", "Please fill in all required fields.");
      return res.redirect("/register");
    }

    // Check if email already exists
    const user = await UserModel.findOne({ email });

    if (user) {
      req.flash("error", "An account with this email already exists.");
      return res.redirect("/register");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = await UserModel.create({
      name,
      email,
      password: hashPassword,
    });

    // Send verification email
    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${newUser._id}`;

    await sendEmail({
      sendTo: email,
      subject: "Verify Your Email Address",
      html: verifyEmailTemplate({
        name,
        email,
        url: verifyEmailUrl,
      }),
    });

    req.flash(
      "success",
      "Registration successful! Please check your email to verify your account."
    );

    return res.redirect("/user/checkMail");
  } catch (error) {
    console.error("Registration Error:", error);

    req.flash(
      "error",
      "We couldn't create your account at this time. Please try again."
    );

    return res.redirect("/register");
  }
}
// CHECK MAIL
export async function check_mail(req, res) {
  req.flash(
    "success",
    "A verification email has been sent to your email address. Please check your inbox and follow the instructions to activate your account."
  );

  res.render("check-email", { layout: false });
}

// VERIFY EMAIL
export async function verifyEmailController(req, res) {
  try {
    const { code } = req.body;

    const user = await UserModel.findById(code);

    if (!user) {
      req.flash("error", "The verification link is invalid or has expired.");
      return res.redirect("/login");
    }

    if (user.verify_email) {
      req.flash("info", "Your email address has already been verified.");
      return res.redirect("/login");
    }

    await UserModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );

    req.flash(
      "success",
      "Your email has been verified successfully. You can now sign in to your account."
    );

    return res.redirect("/login");
  } catch (error) {
    console.error("Email Verification Error:", error);

    req.flash(
      "error",
      "We couldn't verify your email at this time. Please try again later."
    );

    return res.redirect("/login");
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
      req.flash("error", "Please enter both your email address and password.");
      return res.redirect("/login");
    }

    const user = await UserModel.findOne({ email, role: "USER" });

    if (!user) {
      req.flash("error", "No account was found with the provided email address.");
      return res.redirect("/login");
    }

    if (user.status !== "Active") {
      req.flash(
        "error",
        "Your account is currently inactive. Please contact support."
      );
      return res.redirect("/login");
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      req.flash("error", "Incorrect password. Please try again.");
      return res.redirect("/login");
    }

    req.session.user = {
      email: user.email,
      id: user._id,
    };

    res.locals.user = req.session.user;

    req.flash("success", `Welcome back, ${user.name}!`);
    return res.redirect("/user/landing-page");

  } catch (error) {
    console.error(error);
    req.flash("error", "Something went wrong. Please try again later.");
    return res.redirect("/login");
  }
}

// LOGOUT CONTROLLER
export async function logOutController(req, res) {
  try {
    req.session.destroy((error) => {
      if (error) {
        console.error(error);
        req.flash("error", "Unable to log out. Please try again.");
        return res.redirect("/user/profile");
      }

      res.clearCookie("connect.sid");
      req.flash("success", "You have been logged out successfully.");
      return res.redirect("/user/landing-page");
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Something went wrong. Please try again.");
    return res.redirect("/user/landing-page");
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
      req.flash("error", "Please enter your email address.");
      return res.redirect("/user/forgot-password");
    }

    if (!user) {
      req.flash("error", "No account found with that email address.");
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
      req.flash("error", "Please enter the verification code.");
      return res.redirect("/user/verify-otp");
    }

    if (!user) {
      req.flash("error", "No account found with that email address.");
      return res.redirect("/user/verify-otp");
    }

    if (!user.forgot_password_expiry || user.forgot_password_expiry < currentTime) {
      req.flash("error", "Your verification code has expired. Please request a new one.");
      return res.redirect("/user/verify-otp");
    }

    if (String(otp) !== String(user.forgot_password_otp)) {
      req.flash("error", "The verification code you entered is incorrect.");
      return res.redirect("/user/verify-otp");
    }

    req.flash("success", "Verification successful. You can now reset your password.");
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
      req.flash("error", "Please complete all required fields.");
      return res.redirect("/user/reset-password");
    }

    if (!user) {
      req.flash("error", "User account not found.");
      return res.redirect("/user/reset-password");
    }

    if (newPassword !== confirmPassword) {
      req.flash("error", "Passwords do not match.");
      return res.redirect("/user/reset-password");
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      req.flash("error", "User account not found.");
      return res.redirect("/user/reset-password");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    await UserModel.findByIdAndUpdate(
      user._id,
      { password: hashPassword },
      { new: true }
    );

    req.flash(
      "success",
      "Your password has been reset successfully. Please sign in."
    );

    return res.redirect("/user/login");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}



// GET LOGIN USER DETAILS AND PROFILE PAGE
// PROFILE PAGE
export async function profilePage(req, res) {
  try {
    const user = await UserModel.findById(req.session.user.id);

    if (!user) {
      req.flash("error", "Unable to load your profile. Please sign in again.");
      return res.redirect("/user/login");
    }

    res.render("user-details", {
      layout: false,
      user,
      success: req.flash("success"),
      error: req.flash("error"),
    });
  } catch (error) {
    console.error("Profile Page Error:", error);

    req.flash(
      "error",
      "An unexpected error occurred while loading your profile. Please try again."
    );

    return res.redirect("/user/landing-page");
  }
}

// UPDATE USER DATA

export async function updateUserData(req, res) {
  try {
    const userId = req.session.user.id; // or req.user._id
    await UserModel.findByIdAndUpdate(
      userId,
      {
        name: req.body.first_name,
        email: req.body.email,
        mobile: req.body.mobile,
        address_detials: req.body.address,
      },
      { new: true },
    );

    req.flash("success", "Your profile has been updated successfully.");
    return res.redirect("/user/profile");

    console.log("updated..9999");
  } catch (error) {
    req.flash("error", "Unable to update your profile. Please try again.");
  }
}

// UPLOAD USER AVATAR
export async function uploadAvatar(req, res) {
  try {
    const userId = req.session.user.id; // session
    const image = req.file;

    if (!image) {
      req.flash("error", "Please select an image to upload.");
      return res.redirect("/user/profile");
    }

    const upload = await uploadImageCloudinary(image);
    console.log("............", upload);

    await UserModel.findByIdAndUpdate(
      userId,
      { avatar: upload.url },
      { new: true },
    );

    req.flash("success", "Your profile picture has been updated successfully.");
    return res.redirect("/user/profile");
  } catch (error) {
    req.flash("error", "Unable to upload your profile picture. Please try again.");
  }
}
