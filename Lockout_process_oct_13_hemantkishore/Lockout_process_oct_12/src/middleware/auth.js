const bcrypt = require('bcrypt');
const rounds = 10;
const users_model = require('../models/users.models');

// For authenticate login
const authenticateLogin = async (request, response) => {
    try {
        const { user_email, user_password } = request.body;
        const rows = await request.app.get('db').query("SELECT * FROM psp_staff WHERE email = ? ORDER BY ID DESC LIMIT 1", [user_email]);
        if (rows === null || rows.length == 0)
        {
            response.status(400).json({
                field: "email_address",
                message: "The email address you entered isn't connected to an account.",
            });
        } else
        {
            const result = rows[0];
            // console.log(result);
            bcrypt.compare(user_password, result.password, function(err, res) {
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
                    request.session.checkUserActivity = {
                        inActiveUser : false,
                        lockPage:1
                    };
                    request.session.prev_page = {
                        isBack:false,
                        status:null,
                        formData:null,
                        url:null,
                    }
        
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
        if (rows.length > 0)
        {
            response.status(400).json({
                field: "email",
                message: "The email ID is already created",
            });
        } else
        {
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
const passwordReset = async (request, response) => {
    try {
        const { email, password } = request.body;

        const query = `SELECT * FROM psp_staff WHERE email = "${email}" LIMIT 1`;

        request.app.get('connection').query(query, function(error, data) {
            if (data === null || data.length == 0)
            {
                response.status(400).json({
                    field: "email_address",
                    message: "The email address you entered isn't connected to an account.",
                });
            } else
            {
                bcrypt.genSalt(rounds, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        // Now we can store the password hash in db.
                        const updatePassword = `UPDATE psp_staff SET password = "${hash}" WHERE email = "${email}" LIMIT 1`;
                        request.app.get('connection').query(updatePassword, function(error, data) {
                            if(data.affectedRows == 1) {
                                // Success 
                                response.status(200).json({
                                    message: "success",
                                });
                            } else {
                                response.status(400).json({
                                    message: "Error while decoding password",
                                });
                            }
                        });
                    });
                });
            }
        });
    } catch (error) {
        response.status(500).json({
            message: "An error occured",
        });
        console.log(error);
    }
}

const checkLockScreenUser = async(request, response) =>{
   try {
    const email = request.session.email
    const { password } = request.body
    console.log(request.session.prev_page.url,"bhb");
    const rows = await request.app.get('db').query("SELECT * FROM psp_staff WHERE email = ? ORDER BY ID DESC LIMIT 1", [email]);

    if (rows === null || rows.length == 0)
        {
            response.status(400).json({
                field: "email_address",
                message: "Kindly, Please login to continue.",
            });
        }else{
            const result = rows[0]
            bcrypt.compare(password,result.password,function(err,res){
                if (res == false) {
                    response.status(400).json({
                        field: "password",
                        message: "The password that you've entered is incorrect.",
                    });
                }else{                    
                    request.session.checkUserActivity.inActiveUser = false;
                    response.status(200).json({
                        message:"unlocked",
                        url:request.session.prev_page.url,
                })
                }
            })
        }

   } catch (error) {
    response.status(500).json({
        message: "An error occured",
    });
    console.log(error);
   }
}

module.exports =  {
    authenticateLogin,
    createUser,
    passwordReset,
    checkLockScreenUser
};