const Listing = require("../models/listing");
const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res) => {

    try {
        let { username, email, password } = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) =>{
            if(err){
                return next(err);
            }
             req.flash("success", "user was registerd");
             res.redirect("/listings");
        });
       
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }

}

module.exports.renderLoginForm =  (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
        req.flash("success", "Walcome back to wanderlust!");
        let redirect = res.locals.redirectUrl || "/listings";
        res.redirect(redirect);
}

module.exports.userLogute = (req, res) => {
req. logout ((err) => {
if (err) {
return next(err);

}
req. flash("success", "logged you out!");
res.redirect("/listings");
});
}