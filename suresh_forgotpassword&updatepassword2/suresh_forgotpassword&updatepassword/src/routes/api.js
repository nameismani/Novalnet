const express = require('express');
const router = express.Router();
const { authenticateLogin, createUser, resetPassword, forgotpasswordController } = require('../middleware/auth');
const flag = 1
const path = require("path");
const users_model = require('../models/users.models');




router.post('/auth/login', authenticateLogin);

// router.post("/user/password-reset", passwordReset);

router.get("/forgotpassword", (req, res) => {
    res.render("forgotpassword")
})

router.get("/resetpassword", async (request, response) => {
    try {
        const { token } = request.query
        if (!token) {
            if (flag == 0) {
                return response.redirect('/api/forgotpassword')
            }
            if (request.session.loggedin) {
                return response.render("resetpassword", { title: "Update password" })
            }
            return response.redirect("/")

        }
        // check if token in databasee or not
        const [tokendetails] = await request.app.get('db').query('select * from password_reset_token where token = ?', [token])
        if (!tokendetails || tokendetails.token !== token) {
            return response.redirect("/api/tokenexpire")

        }
        return response.render("resetpassword", { title: "Reset password" })
    }

    catch (err) {

        return response.json({

            message: err.message,
            status: "500"
        })
    }
})


router.put("/resetpassword", resetPassword)

router.post("/forgotpassword", forgotpasswordController)

router.get("/tokenexpire", (req, res) => {
    res.render("error.ejs")
})


// router.post("/forgot_password",resetPasswordController)

router.post("/user/create", createUser);

// Handling email exist request
router.get("/user/logout", (req, res, next) => {
    req.session.loggedin = false;
    req.session.save();
    req.session.destroy();
    console.log("user logout success")
    res.redirect("/");
    res.end();
})

module.exports = router;
