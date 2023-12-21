const router=require("express").Router();
const util = require('../util.js');
const fs=require('fs');
const path=require('path');

router.get('/', async (req, res) => {
	const lang = req.app.get('locale');

	
		req.session.accountlock = true; 
		res.render('inactivity', {
			lang: lang,
			lang_text: lang("lang_" + lang.config.lang),
			user_name: req.session.first_name
		});
	
		
	

});

router.post('/dounlock', async (req, res) => {
	const lang = req.app.get('locale');
	console.log("[apsps",req.body.password);
	try {
		if(!req.body.password ) {
			return res.send({
				"status": 101, 
				"status_desc": lang("missing_input_data")
			})
			// next()
		}
		let users=JSON.parse(fs.readFileSync(path.join(__dirname, "../../media/files/json/users.json")))
		console.log("Modda",users);

		// const password = req.body.password; 
		const loginPassword = "novalnet"
		const password = req.body.password
		const username = req.session.login;
		
		let user_qry = "SELECT id, login, first_name, family_name, email, password FROM psp_staff WHERE login = ? LIMIT 1";
		// const result = await req.app.get('novalnet_db').query(user_qry, [username]);
		const encrypted_password = util.encryption(password);
		const encrypted_login_password = util.encryption(loginPassword);
		// if(result.length == 1) { 
			if(encrypted_password ==  users[req.session.staff_email].password){
			// const staff_result = result[0]; 
			// const decrypted = util.decryption(staff_result.password);
			// if(password === decrypted) {
				console.log('accountlock false')
				req.session.accountlock = false;
				return res.send({
					"status": 100,
					"redirect": req.session.currentUrl,
					"status_desc": lang("success")
				});	
				
		}
			 else {
				return res.send({
					"status": 103, 
					"status_desc": lang("incorrect_password")
				});	
			}
		// }
	} catch (err) {
		console.log(err)
        return res.send({
            "status": 102, 
            "status_desc": lang("invalid")
        })
	}	
});

module.exports=router
