export const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

export const redirectAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }
  next();
};
