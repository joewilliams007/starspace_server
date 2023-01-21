//  Main file of Starspace Server

const rateLimit = require('express-rate-limit')
const express = require("express")
const port = 2000;
var multer = require("multer");
var upload = multer({ dest: "./uploads/" });
const app = express();
var cors = requiere("cors")

app.use(cors())

const limiter = rateLimit({
	windowMs: 20 * 60 * 1000, // 20 minutes
	max: 4000, // Limit each IP to 100 requests per `window` (here, per 20 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

app.listen(port, () => console.log("Server startet at port ", port));

const threeLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 20 minutes
	max: 3, // Limit each IP to 100 requests per `window` (here, per 20 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const tenLimiter = rateLimit({
	windowMs: 20 * 60 * 1000, // 20 minutes
	max: 10, // Limit each IP to 100 requests per `window` (here, per 20 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})


const longTimeRegistartionLimiter = rateLimit({
	windowMs: 240 * 60 * 1000, // 120 minutes
	max: 5, // Limit each IP to 100 requests per `window` (here, per 20 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const voteLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	max: 10, // Limit each IP to 100 requests per `window` (here, per 20 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const twentyLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 20, // Limit each IP to 100 requests per `window` (here, per 20 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const fiftyLimiter = rateLimit({
	windowMs: 20 * 60 * 1000, // 20 minutes
	max: 50, // Limit each IP to 100 requests per `window` (here, per 20 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const hundredLimiter = rateLimit({
	windowMs: 20 * 60 * 1000, // 20 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 20 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const fivehundredLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 20000, // Limit each IP to 100 requests per `window` (here, per 20 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(express.json())

// GET REQUEST
app.get("/register/:username/:email/:password", threeLimiter, longTimeRegistartionLimiter, require("./scripts/register.js")) // Registration
app.get("/check/:username", fiftyLimiter, require("./scripts/check.js")) // Username Availibility
app.get("/login/:identification/:password", tenLimiter, require("./scripts/login.js")) // Login
app.get("/feed/:type", fivehundredLimiter, require("./scripts/feed.js")) // Feed
app.get("/hashtag/:type/:tag", fivehundredLimiter, require("./scripts/hashtag.js")) // Hashtag
app.get("/posts/:user_id", hundredLimiter, require("./scripts/profile_posts.js")) // Profile Posts
app.get("/profile/:user_id", fivehundredLimiter, require("./scripts/profile.js")) // Profile
app.get("/image/:path", fivehundredLimiter, require("./scripts/image.js")) // Profile
app.get("/post/:post_id", fivehundredLimiter, require("./scripts/post.js")) // Post
app.get("/username-to-userid/:username", fivehundredLimiter, require("./scripts/username_to_userid.js")) // username to user id
app.get("/comments/:post_id", fivehundredLimiter, require("./scripts/get_comments.js")) // Get Comments of Post
app.get("/vote-status/:user_id/:post_id", fivehundredLimiter, require("./scripts/get_vote_status.js")) // Get Vote Status
app.get("/vote/:user_id/:password/:post_id/:direction", voteLimiter, require("./scripts/vote.js")) // Vote a post
app.get("/vote-comment/:user_id/:password/:comment_id/:direction", voteLimiter, require("./scripts/vote-comment.js")) // Vote a comment
app.get("/vote-poll/:user_id/:password/:post_id/:item", voteLimiter, require("./scripts/vote-poll.js")) // Vote a poll
app.get("/delete/:user_id/:password/:post_id", twentyLimiter, require("./scripts/delete_post.js")) // Delete post
app.get("/report/:user_id/:password/:type/:post_id/:comment_id", twentyLimiter, require("./scripts/report.js")) // Report
app.get("/delete-comment/:user_id/:password/:post_id/:comment_id", twentyLimiter, require("./scripts/delete_comment.js")) // Delete comment
app.get('/update', twentyLimiter, function (req, res) { 
	res.download('/home/joe/AndroidStudioProjects/StarSpace/app/release/app-release.apk') 
	console.log("somebody is uploading or updating the app ...")});

app.get("/update-info", hundredLimiter, require("./scripts/update-info.js")) // Update Information
app.get("/notif/:user_id/:password/:type", fivehundredLimiter, require("./scripts/get_notif.js")) // Get Notifications
app.get("/pushnotif/:user_id/:password", require("./scripts/push_notif.js")) // Get Push Notifications
app.get("/notifview/:user_id/:password/:notif_id", fivehundredLimiter, require("./scripts/view_notif.js")) // View Notifications
app.get("/users-group/:type/:action_id", fivehundredLimiter, require("./scripts/user.js")) // Get Users - Example for stars etc
app.get("/notif-amount/:user_id/:password", fivehundredLimiter, require("./scripts/notif_amount.js")) // Get count of Notifs
app.get("/search/:type/:search", fivehundredLimiter, require("./scripts/search.js")) // Search Tags

// POST REQUEST
app.post("/upload-profile-picture", upload.array("file"), tenLimiter, require("./scripts/upload_profile_picture.js")); // Upload Profile Picture
app.post("/upload-post-poll", upload.array("file"), tenLimiter, require("./scripts/upload_post_poll.js")); // Upload Post Poll
app.post("/upload-post-image", upload.array("file"), tenLimiter, require("./scripts/upload_post_image.js")); // Upload Post Image
app.post("/upload-post-text", upload.array("file"), tenLimiter, require("./scripts/upload_post_text.js")); // Upload Post Text
app.post("/upload-comment-text", upload.array("file"), tenLimiter, require("./scripts/upload_comment_text.js")); // Upload Comment Text
app.post("/upload-post-edit", upload.array("file"), tenLimiter, require("./scripts/upload_post_edit.js")); // Upload Edit Post Text
app.post("/upload-account-edit", upload.array("file"), tenLimiter, require("./scripts/upload_account_edit.js")); // Upload Edit Account Text

// DEPRECATED REQUESTS
app.get("/post/:username/:password/:post/:tags", threeLimiter, require("./scripts/upload.js")) // Upload text based post [deprecated] -> File deprecated
app.get("/comment/:username/:password/:post_id/:comment", twentyLimiter, require("./scripts/comment.js")) // Upload text based comment [deprecated] -> File deprecated
app.post("/upload", upload.array("file"), tenLimiter, require("./scripts/upload.js")); // Upload image and text based Post [deprecated] -> File deprecated
app.get("/vote_status/:user_id/:post_id", fivehundredLimiter, require("./scripts/get_vote_status.js")) // Get Vote Status [depreacated] -> request name. Not the file.

process.on('uncaughtException', err => {
	console.error(err && err.stack)
});

