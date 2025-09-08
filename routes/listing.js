const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middelware.js");

const listingController = require("../controllers/listing.js");
const multer  = require('multer')
// const {storage} = ("../cloudConfig.js");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

router.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.creatListing));
// .post( upload.single('listing[image]'), (req, res) => {
//     // console.log(req.body);
//     res.send(req.file);
//      console.log(req.file);   // 👈 this is why you see that big Buffer object
// });

// router.route("/")
//   .get(wrapAsync(listingController.index))
//   .post(
//     isLoggedIn,
//     upload.single("listing[image]"),
//     validateListing,
//     wrapAsync(listingController.creatListing)
//   );


//New Rout
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing))
.delete( isLoggedIn, isOwner, wrapAsync(listingController.distroyListing));


//index route
// router.get("/", wrapAsync(listingController.index));

//new rout
// router.get('/new', (req, res) => {
//     if (!req.isAuthenticated()) {
//         req.flash("error", "you moust bo logged in to creat listings!");
//         return res.redirect('/login');
//     }
//     res.render("/listings/new.ejs");
// });

//Show rout
// router.get("/:id",
//     wrapAsync(listingController.showListing));

//Create Raut
// router.post("/",
//     isLoggedIn,
//     validateListing,
//     wrapAsync(listingController.creatListing));

// Edit Rout
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//UPDATE ROU/:id", validateListing, 
// router.put("/:id",
//     isLoggedIn,
//     isOwner,
//     validateListing,
//     wrapAsync(listingController.updateListing));

//DELETE ROUT
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.distroyListing));


module.exports = router;