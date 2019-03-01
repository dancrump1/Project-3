require('dotenv').config();
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const app = express();
const mongoose = require("mongoose");

require("./services/passport");
require(".models/User");
require("./routes/authRoutes")(app);

let ClientID = process.env.ClientID;

let ClientSecret = process.env.ClientSecret;

const session = require("express-session");

const secret = process.env.SESSION_SECRET || "testsecret"
// Define middleware here
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

// Connect app to mongo db
const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost/neighbor-app";
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
});

app.use(session({secret: secret, resave: false, saveUninitialized: true}));

// Define API routes here
require("./routes/api-routes.js")(app);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, () => {
    console.log(`🌎 ==> API server now on port ${PORT}!`)
});