const jwt = require("jsonwebtoken");
const secret = "movieApp";

module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };
    return jwt.sign(data, secret); // expiresIn optional
};

module.exports.verify = (req, res, next) => {
    const hdr = req.headers.authorization;
    if (!hdr) return res.status(401).send({ auth: "Failed", message: "No token provided" });

    // Accept both "Bearer <token>" and raw token
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : hdr;

    jwt.verify(token, secret, (err, decoded) => {
        if (err) return res.status(401).send({ auth: "Failed", message: err.message });
        req.user = decoded;
        return next();
    });
};

module.exports.verifyAdmin = (req, res, next) => {
    if (req.user?.isAdmin) return next();
    return res.status(403).send({ auth: "Failed", message: "Action Forbidden" });
};

/*
const jwt = require("jsonwebtoken");
const secret = "movieApp";

module.exports.createAccessToken = (user) => {

    const data = {
        id : user._id,
        email : user.email,
        isAdmin : user.isAdmin
    };

    return jwt.sign(data, secret, {});

};

module.exports.verify = (req, res, next) => {
    console.log(req.headers.authorization);

    let token = req.headers.authorization;

    if(typeof token === "undefined"){
        return res.send({ auth: "Failed. No Token" });
    } else {
        token = token.slice(7, token.length);
        jwt.verify(token, secret, function(err, decodedToken){

            if(err){
                return res.send({
                    auth: "Failed",
                    message: err.message
                });

            } else {

                req.user = decodedToken;
                next();
            }
        })
    }
};

module.exports.verifyAdmin = (req, res, next) => {
    if(req.user.isAdmin) {
        next();
    } else {
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden"
        })
    }
}
 */
