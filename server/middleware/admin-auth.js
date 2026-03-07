export const isAuthenticatedAdmin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/admin");
  }
  next();
};
export const redirectAuthenticatedAdmin = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/category");
  }
  next();
};
