const express = require("express");
// const { route } = require("./listing");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savRedirectUrl } = require("../middelware.js");
// const { userSignup } = require("../controllers/user.js");
const userController = require("../controllers/user.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(
    savRedirectUrl,
     passport.authenticate("local",
       { failureRedirect: "/login",
       failureFlash: true, 
    }), userController.login);

router.get("/logout", userController.userLogute);

module.exports = router;