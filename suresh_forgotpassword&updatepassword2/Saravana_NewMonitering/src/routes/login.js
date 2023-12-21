const router = require("express").Router();
const path = require("path");
const bcrypt = require("bcrypt");
const validator = require("validator");
const crypto = require("crypto");
const util = require("../util.js");
const fs = require("fs");


// Handling login request
router.post("/login", async (req, res, next) => {
	let auth = req.headers.authorization
	const login_token = crypto.randomUUID()
console.log(auth);
console.log(req.cookies.login_token);
	if(auth==req.cookies.login_token){
		const loginPassword = "novalnet";
		const lang = req.app.get("locale");
		const email = req.body.email;
		const password = req.body.password;
	
		var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
		const login_qry =
			"SELECT id, login, psp_id, language_id, gender, first_name, family_name, email, password, nn_title, active FROM psp_staff WHERE login = ? LIMIT 1";
	
		const encrypted_password = util.encryption(password);
		const encrypted_login_password = util.encryption(loginPassword);
	
		const staff_result = {
			id: 1,
			login: true,
			psp_id: 1,
			language_id: 1,
			first_name: "Fresher",
			family_name: "Trainee",
			email: email,
			password: encrypted_password,
			nn_title: "novalnet",
			active: 1,
		};
		//~ if(result.length == 1) {
		//~ const staff_result = result[0];
		if (staff_result.active !== 1) {
			return res.send({
				status: 103,
				status_desc: lang("account_blocked_contact_admin"),
			});
			// next();
		} else if (staff_result.login_attempt > 3) {
			console.log(
				"Failed attempt reached. The current login_attempt: " +
				staff_result.login_attempt
			);
			return res.send({
				status: 104,
				status_desc: lang("maximum_attempt_account_blocked"),
			});
			// next();
		} else {
			
			if(!validator.isEmail(email)){
				return res.send({
				  status: 102,
				  status_desc: "Invalid Eamil ID",
				});
			  }
	
			// temprary user json store
			const users = JSON.parse(fs.readFileSync(path.join(__dirname, "../../media/files/json/users.json")));
			if (!users[email]) {
				users[email] = { email, password: encrypted_login_password };
				fs.writeFileSync(
					path.join(__dirname, "../../media/files/json/users.json"),
					JSON.stringify(users, null, 2));
	
			}
			fs.readFile(path.join(__dirname, "../../media/files/json/users.json"),
				function (err, user) {
					if (err) {
						console.log(err);
						return res.status(200).send({
							status: 101,
							status_desc: err,
						});
					}
					user = JSON.parse(user)
					let userPassword = user[email].password;
	
					//~ const decrypted = util.decryption(staff_result.password);
					if (encrypted_password === userPassword) {
						// if (encrypted_password === encrypted_login_password) {
						req.session.staff_email = staff_result.email;
						// req.session.loggedin = true;
						req.session.staff_id = staff_result.id;
						req.session.staff_title = staff_result.nn_title;
						req.session.staff_first_name = staff_result.first_name;
						req.session.staff_family_name = staff_result.family_name;
						req.session.staff_lang = staff_result.language_id;
						req.session.login = staff_result.login;
						req.session.resend_otp=3;
						req.session.otp_time=new Date().getTime() +  1000 * 20
						req.session.save();
						//~ req.session.save();
						/*req.session.loggedin = true;
							  req.session.staff_id = staff_result.id; 
							  req.session.staff_title = staff_result.nn_title; 
							  req.session.staff_first_name = staff_result.first_name;  
							  req.session.staff_family_name = staff_result.family_name; 
							  req.session.staff_lang = staff_result.language_id; 
							  req.session.login = staff_result.login; 
							  req.session.save();
								  return res.send({
									  "status": 100,
									  "redirect": "/dashboard",  
									  "status_desc": lang("successful")
								  });
								  next();*/
						const otp = util.generateOtp(1111, 9999);
						const token = crypto
							.createHash("md5")
							.update(staff_result.email + "-" + otp)
							.digest("hex");
						//~ req.app.get('nmp_db').query("INSERT INTO staff_login_token (psp_staff_id, token, token_value, ip, valid_till, creation_date) VALUES (?,?,?,?, date_add(now(),interval 30 minute), now())", [staff_result.id, token, otp, ip]).then(staff_login_token_tbl => {
						//~ if(staff_login_token_tbl.affectedRows == 1) {
						console.log("OTP: " + otp);
	
						req.session.otp = otp;
						// console.log(req.session);
						req.app
							.get("nmp_ejs")
							.renderFile(
								path.join(__dirname, "/../../email_templates/login_otp.ejs"),
								{
									otp: otp,
									first_name: staff_result.first_name,
								}
							)
							.then((result) => {
								emailTemplate = result;
								req.app.get("nmp_mailer").sendMail(
									{
										from: '"Novalnet Monitoring Team" thangadurai_s@novalnetsolutions.com',
										//~ to: staff_result.email,
										to: email,
										subject: "Novalnet AG Monitoring Portal Verification Code",
										html: result,
									},
									function (err, info) {
										if (err) {
											console.log(err);
										} else {
											console.log("Message sent: " + info.response);

											res.cookie("login_token", login_token, {
												httpOnly: true,
												secure: true,
												sameSite: "strict",
											})

											return res.send({
												status: 100,
												redirect: "/otp_verify/" + token,
												status_desc: lang("successful"),
												csrf: login_token
											});
	
										}
									}
								);
							})
							.catch((err) => {
								console.log(err);
							});
						//~ } else {
						//~ console.log(err)
						//~ return res.send({
						//~ "status": 102,
						//~ "status_desc": lang("invalid")
						//~ })
						//~ }
						//~ });
					} else {
						res.cookie("login_token", login_token, {
							httpOnly: true,
							secure: true,
							sameSite: "strict",
						  })
						return res.send({
							status: 102,
							status_desc: lang("invalid_credentials"),
							csrf: login_token
						});
						next();
					}
				});
		}
		//~ }
		//~ else {
		//~ return res.send({
		//~ "status": 102,
		//~ "status_desc": lang("invalid_credentials")
		//~ })
		//~ next()
		//~ }
	}
	else{
		res.cookie("login_token", login_token, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
		  })
		return res.json({
			"status":403,
			"status_desc":"Invalid Token",
			"message":"Forbidden",
			"csrf":login_token
		})
	}
	
});


router.post("/otp/verify", async (req, res, next) => {
	const lang = req.app.get("locale");
	try {
		let hashedOtp = crypto.createHash("md5").update(req.session.staff_email+"-"+req.session.otp).digest("hex");
		let token=req.body.token;
		const req_otp = req.body.otp;
		const generateOtp = req.session.otp;
     	console.log(token);
		if (!req.body.token) {
			return res.send({
				status: 101,
				status_desc: lang("missing_input_data"),
			});
		}
		console.log("==>",req_otp,generateOtp);
		if(token !== hashedOtp) {
			return res.send({
				status: 101,
				status_desc: lang("missing_input_data"),
			});
		}
		if (generateOtp != req_otp) {
			req.session.loggedin = false;
		    req.session.save();
			// req.session.destroy();

			return res.send({
				status: 103,
				status_desc: lang("wrong_otp"),
			});
		}
		//console.log('gggggggggggggggg');

		//~ req.app.get('nmp_db').query("SELECT id, psp_staff_id, token, token_value FROM staff_login_token WHERE token = ? AND active = 1 AND valid_till >= now() LIMIT 1", [token]).then(staff_token_result => {
		//~ if(staff_token_result.length == 1) {
		//~ otp = staff_token_result[0].token_value;
		//~ // Verify the OTP
		//~ if(req_otp == otp) {
		//~ const staff_otp_id = staff_token_result[0].id;
		//~ const staff_id = staff_token_result[0].psp_staff_id;
		//~ req.app.get('novalnet_db').query("SELECT id, login, psp_id, language_id, gender, first_name, family_name, email, password, nn_title, active FROM psp_staff WHERE id = ? LIMIT 1", [staff_id]).then(staff_tbl => {
		//~ if(staff_tbl.length == 1) {
		//~ req.app.get('nmp_db').query("DELETE FROM staff_login_token WHERE id = ? LIMIT 1", [staff_otp_id]).then(async staff_login_token_tbl => {
		//~ if(staff_login_token_tbl.affectedRows == 1) {
		//~ //req.session.staff_email = staff_tbl[0].email;
		//~ req.session.staff_email = 'thangadurai_s@novalnetsolutions.com';
		//~ req.session.loggedin = true;
		//~ req.session.staff_id = staff_tbl[0].id;
		//~ req.session.staff_title = staff_tbl[0].nn_title;
		//~ req.session.staff_first_name = staff_tbl[0].first_name;
		//~ req.session.staff_family_name = staff_tbl[0].family_name;
		//~ req.session.staff_lang = staff_tbl[0].language_id;
		//~ req.session.login = staff_tbl[0].login;
		//~ req.session.save();

		let cookieState =util.encryption('true')
		res.cookie('login',cookieState, {
			httpOnly: true,
			secure: true,
			sameSite: "strict"
			
		})
		req.session.loggedin = true;
		req.session.expires=(Date.now() +  60 * 1000);
		req.session.save()
			
		return res.send({
			status: 100,
			redirect: "/dashboard",
			status_desc: lang("successful"),
		});
		//~ }
		//~ })
		//~ }
		//~ });
		//~ } else {
		//~ // Failed
		//~ return res.send({
		//~ "status": 103,
		//~ "status_desc": lang("wrong_otp")
		//~ });
		//~ }
		//~ } else {
		//~ return res.send({
		//~ "status": 102,
		//~ "status_desc": lang("invalid")
		//~ });
		//~ }
		//~ });
	} catch (err) {
		return res.send({
			status: 101,
			status_desc:err
		});
	}
});



router.post("/otp/resend", async (req, res, next) => {

	const lang = req.app.get("locale");
	try {
		if (!req.body.token) {
			return res.send({
				status: 101,
				status_desc: lang("missing_input_data"),
			});
		}
		const token = req.body.token;
		let otp = util.generateOtp(1111, 9999);
		let email = req.session.staff_email;
		let first_name = req.session.staff_first_name;

		console.log('ressended otp', otp);
		// const staff_token_result = await req.app
		// 	.get("nmp_db")
		// 	.query(
		// 		"SELECT id, psp_staff_id, token, token_value FROM staff_login_token WHERE token = ? AND active = 1 AND valid_till >= now() LIMIT 1",
		// 		[token]
		// 	);
		// if (staff_token_result.length == 1) {
		// 	otp = staff_token_result[0].token_value;
		// 	let staff_id = staff_token_result[0].psp_staff_id;
		// 	const staff_result = await req.app
		// 		.get("novalnet_db")
		// 		.query(
		// 			"SELECT id, login, email, first_name FROM psp_staff WHERE id = ? LIMIT 1",
		// 			[staff_id]
		// 		);
		// 	if (staff_result.length == 1) {
		// 		email = staff_result[0].email;
		// 		first_name = staff_result[0].first_name;
		// 	}
		// } else {
		// 	return res.send({x
		// 		status: 102,
		// 		status_desc: lang("invalid"),
		// 	});
		// }
		let resend_otp_limit = req.session.resend_otp - 1
		if (otp) {
			if (resend_otp_limit >= 0) {

				req.session.resend_otp = resend_otp_limit
				req.session.otp_time = new Date().getTime() + 1000 * 20;
				// initite the resending otp process
				req.app
					.get("nmp_ejs")
					.renderFile(
						path.join(__dirname, "/../../email_templates/login_otp.ejs"),
						{
							otp: otp,
							first_name: first_name,
						}
					)
					.then((result) => {
						emailTemplate = result;
						req.session.otp = otp;
						console.log("resend", req.session);

						console.log(req.session.otp, " --", otp);
						req.app.get("nmp_mailer").sendMail(
							{
								from: '"Novalnet Monitoring" thangadurai_s@novalnetsolutions.com',
								//~ to: staff_result.email,
								to: email,
								subject: "Novalnet AG Monitoring Portal Verification Code",
								html: emailTemplate,
							},
							function (err, info) {
								if (err) {
									console.log(err);
								} else {
									console.log("Message sent: " + info.response);
									return res.send({
										status: 100,
										resend: resend_otp_limit,
										time: req.session.otp_time,
										status_desc: lang("successful"),
									});
								}
							}
						);
					})
					.catch((err) => {
						console.log(err);
						return res.send({
							status: 101,
							status_desc: "Unable Send Given Email",
						  });
					});
			}
			else {
				return res.send({
					status: 102,
					status_desc: lang("resend limit")
				})
			}

		} else {
			return res.send({
				status: 102,
				status_desc: lang("invalid"),
			});
		}
	} catch (err) {
		console.log(err);
		return res.send({
			status: 101,
		});
	}
});

module.exports = router;
