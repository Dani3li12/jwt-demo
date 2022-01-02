const router = require("express").Router();
const { publicPosts, privatePosts } = require("../db")
const checkAuth = require("../middleware/checkAuth")

router.get("/public", (req, res)=> {
    res.json({
        publicPosts
    })
})
router.get("/private", checkAuth, (req, res, next) => {
    res.json({
        errors: [
            {
                "msg": "you need to log in. this is private",
            }
        ]
    })
})

module.exports = router;