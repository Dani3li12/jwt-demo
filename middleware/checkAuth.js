const jwt = require("jsonwebtoken")

module.exports = async (req, res, next) => {
    const token = req.header("x-auth-token")
    if (!token) {
        return res.status(400).json({
            errors: [
                {
                    "msg": "no token found",
                }
            ]
        })
    }
    try {
        let user = await jwt.verify(token, "ib2iob32j3b3l23j2")
        req.user = user.email  //updates the used email
    } catch (error) {
        return res.status(400).json({
            errors: [
                {
                    "msg": "token invalid",
                }
            ]
        })
    }
}