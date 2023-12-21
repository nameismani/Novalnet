const bcrypt = require('bcrypt');
const rounds = 10;
const users_model = require('../models/users.models');
const path = require('path')
const crypto = require("crypto");
// For authenticate login
const authenticateLogin = async (request, response) => {

    console.log(request)
    try {
        const { user_email, user_password } = request.body;
        const rows = await request.app.get('db').query("SELECT * FROM psp_staff WHERE email = ? ORDER BY ID DESC LIMIT 1", [user_email]);
        if (rows === null || rows.length == 0) {
            response.status(400).json({
                field: "email_address",
                message: "The email address you entered isn't connected to an account.",
            }); `<a href=https://dev7.fobits.de/api/resetpassword/${token}>click here</a>`
        } else {
            const result = rows[0];
            bcrypt.compare(user_password, result.password, function (err, res) {
                if (res == false) {
                    response.status(400).json({
                        field: "password",
                        message: "The password that you've entered is incorrect.",
                    });
                } else {
                    request.session.userId = result.id;
                    request.session.email = result.email;
                    request.session.first_name = result.first_name;
                    request.session.last_name = result.last_name;
                    request.session.is_admin = result.is_admin;
                    request.session.abbreviation = result.abbreviation;
                    request.session.loggedin = true;
                    request.session.save();
                    response.status(200).json({
                        message: "success",
                    });
                }
            });
        }
    } catch (error) {
        response.status(500).json({
            message: "An error occured",
        });
        console.log(error);
    }
}

// create user account
const createUser = async (request, response) => {
    try {
        const email = request.body.email;
        const rows = await request.app.get('db').query("SELECT id FROM psp_staff WHERE email = ? LIMIT 1", [email]);
        if (rows.length > 0) {
            response.status(400).json({
                field: "email",
                message: "The email ID is already created",
            });
        } else {
            users_model.createUser(request, response);
            response.status(200).json({
                message: "success",
            });
        }
    } catch (error) {
        response.status(500).json({
            message: "An error occured",
        });
        console.log(error);
    }
}

// For User's Password Reset
// const passwordReset = async (request, response) => {
//     try {
//         const { email, password } = request.body;

//         const query = `SELECT * FROM psp_staff WHERE email = "${email}" LIMIT 1`;

//         request.app.get('connection').query(query, function(error, data) {
//             if (data === null || data.length == 0)
//             {
//                 response.status(400).json({
//                     field: "email_address",
//                     message: "The email address you entered isn't connected to an account.",
//                 });
//             } else
//             {
//                 bcrypt.genSalt(rounds, (err, salt) => {
//                     bcrypt.hash(password, salt, (err, hash) => {
//                         // Now we can store the password hash in db.
//                         const updatePassword = `UPDATE psp_staff SET password = "${hash}" WHERE email = "${email}" LIMIT 1`;
//                         request.app.get('connection').query(updatePassword, function(error, data) {
//                             if(data.affectedRows == 1) {
//                                 // Success 
//                                 response.status(200).json({
//                                     message: "success",
//                                 });
//                             } else {
//                                 response.status(400).json({
//                                     message: "Error while decoding password",
//                                 });
//                             }
//                         });
//                     });
//                 });
//             }
//         });
//     } catch (error) {
//         response.status(500).json({
//             message: "An error occured",
//         });
//         console.log(error);
//     }
// }
// For User's Password Reset

const forgotpasswordController = async (request, response) => {
    try {
        const [user] = await request.app.get("db").query('select * from psp_staff where email = ?',[request.body.email])
       
    
        if (!user) {
            return response.json({
                message: "No user found with these email address",
                status: "400"
            })
        }
        const userEmail = user.email
        request.id = user.id

        // check user having token or not, if exist then remove
        const [resetToken] = await request.app.get("db").query("select token from password_reset_token where psp_staff_id = ?", [user.id])

        if (resetToken) {
            await users_model.removeToken(request)
        }

        // create and insert the token

        const resetpasswordToken = crypto.randomBytes(32).toString('hex');
        const expiryTime = new Date(Date.now() + 30 * 60 * 1000);
        const query = "INSERT INTO password_reset_token (psp_staff_id, token, expiry_time) values(?,?,?)"
        const result = await request.app.get("db").query(query, [user.id, resetpasswordToken, expiryTime])

        request.app.get('nmp_ejs').renderFile(path.join(__dirname, "/../../mailtemplate/mail.ejs"),
            {
                token: resetpasswordToken,
                email: userEmail,
                name: user.first_name + " " + user.last_name,
            })
            .then(result => {
                emailTemplate = result;
                request.app.get("mailer").sendMail({
                    from: '"Novalnet Ticketing Team" charles_a@novalnetsolutions.com',
                    //~ to: staff_result.email,
                    to: userEmail,
                    subject: 'Reset password link',
                    html: emailTemplate
                }, function (err, info) {
                    if (err) {
                        response.json({ message: err.message, status: "400" })
                    } else {
                        return response.json({
                            message: "We have sent a reset password link to your email.please check",
                            status: "200"
                        })
                    }
                });
            })
            .catch(err => {
                response.json({ message: err.message, status: "400" })
            });

    }

    catch (error) {
        return response.json({
            status: "500",
            message: error.message
        })
    }
}


const resetPassword = async (request, response) => {
    try {
        const { newpassword, confirmPassword } = request.body
        const { token } = request.query


        if (!newpassword || !confirmPassword) {
            return response.json({
                message: "all fields are mandatory",
                status: "400"
            });
        }
        // check newpassword with confirmpassword
        if (newpassword !== confirmPassword) {
            return response.json({
                message: "Newpassword and confirmpassword are not same",
                status: "400"

            });
        }
        if (token == "null") {
            // sometimes loggin user coming directly to updatepassword with out token based on the flag value
            // check if session contains email or not
            // if no email in session, then user is not login user
            const {email} = request.session
            if(!email){
                return response.json({
                    message: "Unauthorized user",
                    status: "401"
                });
            }
            // if email is in session then update the password
            const hashedpassword = await bcrypt.hash(newpassword, 10)
            const updatepassword = await request.app.get("db").query("UPDATE psp_staff SET password = ? WHERE email = ?",[hashedpassword,email])
            return response.json({
                message: "Password updated successfully",
                status: "200"
            });
        }
        // check token exists in database or not
        const [tokendetails] = await request.app.get("db").query("select * from password_reset_token  where token = ?",[token])
        if (!tokendetails) {
            return response.json({
                message: "Unauthorized user",
                status: "401"
            })
        }

        request.id = tokendetails.psp_staff_id
        const [result] = await request.app.get("db").query("select psp_staff_id, token, expiry_time   from password_reset_token  where psp_staff_id = ?", [tokendetails.psp_staff_id])
        const currentTime = new Date(Date.now()).getTime()
        const expiredTime = new Date(result.expiry_time).getTime()
        if (currentTime > expiredTime) {
            await users_model.removeToken(request)
            return response.json({
                message: "Link is expired",
                status: "400"
            })
        }
        //update password and remove the token
        const updatepassword = await users_model.updateUserPassword(request)
        await users_model.removeToken(request)
        return response.json({
            message: "Password reset successfully",
            status: "200"

        })

    }
    catch (error) {
        return response.json({
            status: "500",
            message: error.message
        })
    }

}


module.exports = {
    authenticateLogin,
    createUser,
    // passwordReset,
    forgotpasswordController,
    resetPassword,

};
