const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const flash = require("connect-flash");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    (req, res, next) => {
      passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
      })(req, res, next);
    },
    userController.login
  );

// Add forgot password routes
router.get("/forgot-password", userController.renderForgotPasswordForm);
router.post("/forgot-password", wrapAsync(userController.forgotPassword));
router.get("/reset-password/:token", wrapAsync(userController.renderResetPasswordForm));
router.post("/reset-password/:token", wrapAsync(userController.resetPassword));

// Logout
router.get("/logout", userController.logout);

module.exports = router;
