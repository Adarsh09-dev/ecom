export const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login"); // login page is the '/'
  }
};

export const redirectAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/home");
  } else {
    return next();
  }
};

