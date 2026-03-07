export const isAuthenticatedAdmin = (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin");
  }
  next();
};
export const redirectAuthenticatedAdmin = (req, res, next) => {
  if (req.session.admin) {
    return res.redirect("/category");
  }
  next();
};
