const express = require('express');
const router = express.Router();
const { authenticateLogin, createUser, passwordReset, checkLockScreenUser } = require('../middleware/auth');

router.post('/auth/login', authenticateLogin);

// router.post("/user/password-reset", passwordReset);

router.post("/user/create", createUser);

//Lockout
router.post("/user/verify",checkLockScreenUser)

// Handling email exist request
router.get("/user/logout", (req,res,next)=>{
    req.session.loggedin = false;
    req.session.save();
    req.session.destroy();
    console.log("user logout success")
    res.redirect("/");
    res.end();
})

module.exports = router;