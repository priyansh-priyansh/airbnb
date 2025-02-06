const User = require("../models/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            return res.redirect("/listings");
        });
    } catch(e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    const redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl;
    req.flash("success", "Welcome back!");
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
}

module.exports.renderForgotPasswordForm = (req, res) => {
    res.render("users/forgot-password");
};

module.exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            req.flash("error", "No account with that email address exists");
            return res.redirect("/forgot-password");
        }

        // Generate reset token
        const token = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send email
        const resetURL = `http://${req.headers.host}/reset-password/${token}`;
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USERNAME,
            subject: "Password Reset Request",
            text: `You are receiving this because you (or someone else) requested a password reset.
                  Please click on the following link to complete the process:
                  ${resetURL}
                  If you did not request this, please ignore this email.`
        };

        await transporter.sendMail(mailOptions);
        req.flash("success", "An email has been sent with further instructions");
        res.redirect("/login");
    } catch (err) {
        next(err);
    }
};

module.exports.renderResetPasswordForm = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        req.flash("error", "Password reset token is invalid or has expired");
        return res.redirect("/forgot-password");
    }

    res.render("users/reset-password", { token: req.params.token });
};

module.exports.resetPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            req.flash("error", "Password reset token is invalid or has expired");
            return res.redirect("/forgot-password");
        }

        if (req.body.password !== req.body.confirmPassword) {
            req.flash("error", "Passwords do not match");
            return res.redirect("back");
        }

        await user.setPassword(req.body.password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        req.login(user, (err) => {
            if (err) return next(err);
            req.flash("success", "Your password has been changed");
            res.redirect("/listings");
        });
    } catch (err) {
        next(err);
    }
};