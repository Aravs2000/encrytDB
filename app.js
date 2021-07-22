require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb://localhost:27017/userDb", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); //connecting with db

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



userSchema.plugin(encrypt, { secret: process.env.KEY, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err) {
        if (err) res.send(err);
        else res.render("secrets");
    });
});


app.post("/login", function(req, res) {
    const email = req.body.username;
    const password = req.body.password;
    User.findOne({ email: req.body.username }, function(err, foundUser) {
        if (err) console.log(err);
        else {
            if (foundUser) {
                if (foundUser.password === password) {
                    console.log(foundUser.password)
                    res.render("secrets");
                } else {
                    console.log("Password mismatch");
                }
            }
        }
    });
});


let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function() {
    console.log("Server is hosted successfully");
});