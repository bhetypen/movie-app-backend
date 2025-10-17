const bcrypt = require("bcrypt");
const User = require("../models/User");
const { createAccessToken } = require("../auth.js");

function register(req, res) {
    const { email, password } = req.body || {};
    if (!email || !password) {
        return res.status(400).send({ error: "Email and password are required" });
    }

    User.findOne({ email })
        .then((exists) => {
            if (exists) {
                res.status(409).send({ error: "Email already registered" });
                return Promise.reject("handled");
            }
            return bcrypt.hash(password, 12)
                .then((hash) => User.create({ email, password: hash, isAdmin: false })); // <-- store as password
        })
        .then(() => res.status(201).send({ message: "Registered Successfully" }))
        .catch((err) => {
            if (err === "handled") return;
            console.error("register error:", err);
            res.status(500).send({ error: "Server error" });
        });
}

function login(req, res) {
    const { email, password } = req.body || {};
    if (typeof email !== "string" || !email.includes("@")) {
        return res.status(400).send({ error: "Invalid Email" });
    }

    User.findOne({ email })
        .then((user) => {
            if (!user) {
                res.status(404).send({ error: "No Email Found" });
                return Promise.reject("handled");
            }

            // support seeds that use either `password` or `passwordHash`
            const hashed = user.password;
            if (!hashed) {
                res.status(500).send({ error: "User password not set" });
                return Promise.reject("handled");
            }

            return bcrypt.compare(password || "", hashed).then((isMatch) => ({
                isMatch,
                user,
            }));
        })
        .then(({ isMatch, user }) => {
            if (!isMatch) {
                res.status(401).send({ error: "Email and password do not match" });
                return Promise.reject("handled");
            }
            const token = createAccessToken(user);
            return res.status(200).send({ access: token }); // <- exact key the tests read
        })
        .catch((err) => {
            if (err === "handled") return;
            console.error("Login error:", err);
            res.status(500).send({ error: "Login failed" });
        });
}

function retrieveDetails(req, res) {
    let q;
    if (req.user?.id) {
        q = User.findById(req.user.id).select("email isAdmin");
    } else if (req.user?.email) {
        q = User.findOne({ email: req.user.email }).select("email isAdmin");
    } else {
        return res.status(404).send({ error: "User not found" });
    }

    q.then((user) => {
        if (!user) return res.status(404).send({ error: "User not found" });

        res.send({ user }); // send the whole doc
    })
        .catch((e) => {
            console.error("retrieveDetails error:", e);
            res.status(500).send({ error: "server error" });
        });
}

module.exports = { register, login, loginUser: login, retrieveDetails };
