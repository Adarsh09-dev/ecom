import UserModel from "../models/User-Model.js";
import bcrypt from "bcrypt";
import session from "express-session";
import flash from "connect-flash";

// LOGIN PAGE
export async function adminLoginPage(req, res) {
  res.render("Admin/admin-login", { layout: false });
}

// LOGIN CONTROLLER
export async function adminLoginController(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      req.flash("error", "Email and password are required");
      return res.redirect("/admin");
    }

    // Find admin user
    const user = await UserModel.findOne({
      email,
      role: "ADMIN",
    });

    if (!user) {
      req.flash("error", "Email not found");
      return res.redirect("/admin");
    }

    // Check account status
    if (user.status !== "Active") {
      req.flash("error", "Your account is inactive");
      return res.redirect("/admin");
    }

    // Verify password
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      req.flash("error", "Wrong password");
      return res.redirect("/admin");
    }

    // Create session
    req.session.admin = {
      id: user._id,
      email: user.email,
    };

    // Success message
   req.flash("success", "Login successful");

    return res.redirect("/category");

  } catch (error) {
    console.error(error);

    req.flash("error", "Server error. Please try again.");

    return res.redirect("/admin");
  }
}

// LOGOUT CONTROLLER
export async function adminLogoutController(req, res) {
  try {
    req.session.destroy((error) => {
      if (error) {
        console.error("Logout Error:", error);
        req.flash("error", "Unable to log out. Please try again.");
        return res.redirect("/category");
      }

      res.clearCookie("connect.sid");

      req.flash("success", "You have been logged out successfully.");

      return res.redirect("/admin");
    });
  } catch (error) {
    console.error("Logout Exception:", error);
    req.flash("error", "Something went wrong. Please try again.");
    return res.redirect("/category");
  }
}