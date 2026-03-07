import UserModel from "../models/User-Model.js";
import bcrypt from "bcrypt";

// LOGIN PAGE
export async function adminLoginPage(req, res) {
  res.render("Admin/admin-login", { layout: false });
}

// LOGIN CONTROLLER
export async function adminLoginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.redirect("/admin");
    }

    const user = await UserModel.findOne({ email, role: "ADMIN" });

    if (!user) {
      // return res.send("email cannot found");
      return res.redirect("/admin");
    }

    if (user.status !== "Active") {
      return res.redirect("/admin");
    }

    // hash password
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.send("Wrong password");
    }

    req.session.admin = {
      email: user.email,
      id: user._id,
    };
    return res.redirect("/category");
  } catch (error) {
    res.send("Server error");
  }
}

// LOGOUT CONTROLLER
export async function adminLogoutController(req, res) {
  try {
    req.session.destroy((error) => {
      if (error) {
        console.error(error);
        return res.redirect("/category");
      }
      res.clearCookie("connect.sid"); // session cookie name
      return res.redirect("/admin");
    });
  } catch {
    console.error(error);
    return res.redirect("/category");
  }
}
