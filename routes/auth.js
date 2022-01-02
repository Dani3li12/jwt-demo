const router = require("express").Router();
const { check, validationResult }=require("express-validator")
const { users } = require("../db")
const bcrypt = require("bcrypt");
const req = require("express/lib/request");
const jwt = require("jsonwebtoken")

router.post("/signup", [
    check("email", "please provide a valid email").isEmail(),
    check("password", "please provide a password that is greater than 5 characters")
        .isLength({
        min: 6
    })
], async(req, res) => {
    const { password, email } = req.body;

    //validated the input
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.sendStatus(400).json({
            errors: errors.array()
        })
    }

    //validate if user doesn't already exist
    let user = users.find((user) => {
        return user.email == email
    })

    if (user) { //if the user exist
        return res.json({
            errors: [
                {
                    "msg": "This email already exists",
                }
            ]
            
        })
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log(hashedPassword);

        users.push({ // update the password in the db with the hashed
            email,
            password: hashedPassword
        })

        const token = await jwt.sign({
            email
        }, "ib2iob32j3b3l23j2", { // do not upload to github, needs to be in .env file. this is the secret key
            expiresIn: 24000
        }) 
        res.json({
            token
        })
    }

})

router.post('/login', async(req, res) => {
    const { password, email } = req.body;
    let user = users.find((user) => {
        return user.email == email
    })
    if (!user) { //if the user is not defined
        return res.json({
            errors: [ 
                {
                    "msg": "Invalid input. there is a problem with the email/password",
                }
            ]
            
        })
    } 
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) { //if the password is not correct
        return res.json({
            errors: [ 
                {
                    "msg": "Invalid password",
                }
            ]
            
        })
    };
    
    const token = await jwt.sign({
        email
    }, "ib2iob32j3b3l23j2", { // do not upload to github, needs to be in .env file. this is the secret key
        expiresIn: 24000
    }) 
    res.json({
        token
    })

})

router.get("/all", (req, res) => {
    res.json(users)
})

module.exports = router;