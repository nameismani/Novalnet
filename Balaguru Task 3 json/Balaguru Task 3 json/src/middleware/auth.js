const bcrypt = require('bcrypt');
const rounds = 10;
const users_model = require('../models/users.models');


const ipinfo = require('ipinfo');
var fs = require('fs');
const date = require('date-and-time');

const authenticateLogin = async (request, response) => {
    try {
        const { user_email, user_password } = request.body;
        const rows = await request.app.get('db').query("SELECT * FROM psp_staff WHERE email = ? ORDER BY ID DESC LIMIT 1", [user_email]);
        if (rows === null || rows.length == 0) {
            response.status(400).json({
                field: "email_address",
                message: "The email address you entered isn't connected to an account.",
            });
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
                    let session_mail = request.session.email
                    const matchedUser = JSON.parse(fs.readFileSync("./media/mailalert.json", 'utf8')).find(user => user.email === session_mail && user.mailLoginALert === 1);
                    if (matchedUser) {
                        const mail_template = fs.readFileSync("./mailtemplate/login_mail.ejs", 'utf-8');
                        ipinfo((err, data) => {
                            if (err) {
                                console.error(err);
                            } else {
                                const location = `${data.city},${data.region}, ${data.country}`
                                const loginInfo = { first_name: result.first_name, last_name: result.last_name, ip: data.ip, location: location, login_time: date.format((new Date()), 'DD.MM.YYYY HH:mm:ss') }
                                const compiledTemplate = request.app.get('nmp_ejs').compile(mail_template);
                                const emailContent = compiledTemplate(loginInfo)
                                request.app.get("mailer").sendMail({
                                    from: 'Novalnet Ticketing System charles_a@novalnetsolutions.com',
                                    to: session_mail,
                                    subject: "Ticketing System Account Login Alert Mail",
                                    html: emailContent,
                                }, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                    }
                                });
                            }
                        });
                    }
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
const passwordReset = async (request, response) => {
    try {
        const { email, password } = request.body;

        const query = `SELECT * FROM psp_staff WHERE email = "${email}" LIMIT 1`;

        request.app.get('connection').query(query, function (error, data) {
            if (data === null || data.length == 0) {
                response.status(400).json({
                    field: "email_address",
                    message: "The email address you entered isn't connected to an account.",
                });
            } else {
                bcrypt.genSalt(rounds, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        // Now we can store the password hash in db.
                        const updatePassword = `UPDATE psp_staff SET password = "${hash}" WHERE email = "${email}" LIMIT 1`;
                        request.app.get('connection').query(updatePassword, function (error, data) {
                            if (data.affectedRows == 1) {
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

const mailLoginAlert = async (request, response) => {
    try {
        const user_data = { email: request.session.email, mailLoginALert: request.body.checked }
        let jsonFile = JSON.parse(fs.readFileSync('./media/mailalert.json', 'utf-8'))
        const existingData = jsonFile.findIndex((obj) => obj.email === user_data.email);
        if (existingData !== -1) {
            jsonFile[existingData] = user_data;
        } else {
            jsonFile.push(user_data);
        }
        const updatedJsonString = JSON.stringify(jsonFile, null, 2);
        fs.writeFileSync('./media/mailalert.json', updatedJsonString);
        response.status(200).json({
            message: "success",
        });
    } catch (error) {
        response.status(500).json({
            message: "An error occured",
        });
    }
}


module.exports = {
    authenticateLogin,
    createUser,
    passwordReset,
    mailLoginAlert
};