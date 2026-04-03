const jwt = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "You need to be Login First",
                success: false
            });
        }

        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(401).json({
                message: "Invalid",
                success: false
            });
        }

        req.user = decode;
        next();
    }
    catch (err) {
        console.log(err.message);
    }
}

module.exports = isAuthenticated;