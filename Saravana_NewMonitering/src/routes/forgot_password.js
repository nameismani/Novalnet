const nmp = require("../init.js");
const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const util = require("../util.js");
const lang = nmp.lang;
const validator = require('validator');


router.get('/forgot_password', (req, res) => {
  res.locals.lang = lang;
  if (req.session.loggedin) {
    res.writeHead(301, { location: "/" });
    return res.end();
  }
  return res.render('forgot_email_request');
});

router.post('/reset_password', (req, res) => {

  let email = req.body.email;
  if (!validator.isEmail(email)) {
    return res.send({
      status: 101,
      status_desc: "Invalid Eamil ID",
    });
  }
  const users = JSON.parse(fs.readFileSync(path.join(__dirname, "../../media/files/json/users.json")));
  if (!users[email]) {
    return res.status(200).send({
      status: 101,
      status_desc: "Email ID Not Exist, Enter Valid Email",
    });
  } else {
    let Exp_Time = Date.now() + (1000 * 60 * 30);

    let user_Data = JSON.stringify({ 'email': email, 'expire': Exp_Time })
    let token = util.encryption(user_Data);
    users[email].token = token;

    req.app
      .get("nmp_ejs")
      .renderFile(
        path.join(__dirname, "../../email_templates/forgot_password.ejs"),
        {
          link: req.get('origin') + '/forgot_password/' + token,
          first_name: String(email).split('@')[0],
        }
      )
      .then((result) => {
        emailTemplate = result;
        req.app.get("nmp_mailer").sendMail(
          {
            from: '"Novalnet Monitoring Team" thangadurai_s@novalnetsolutions.com',
            //~ to: staff_result.email,
            to: email,
            subject: "Novalnet AG Monitoring Portal Forgot Password Request",
            html: result,
          },
          function (err, info) {
            if (err) {
              console.log(err);
            } else {
              fs.writeFileSync(
                path.join(__dirname, "../../media/files/json/users.json"),
                JSON.stringify(users, null, 2));
              console.log("Message sent: " + info.response);
              return res.send({
                status: 100,
                status_desc: "Forgot Password Link sended Successfully.",
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
})

router.get('/forgot_password/:token', (req, res) => {
  let token = req.params.token;
  res.locals.lang = lang;
  res.locals.token = token;
  try {
    let { email, expire } = JSON.parse(util.decryption(token));
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, "../../media/files/json/users.json")));
    if (users[email].token === token && expire > Date.now() && users[email].token != null) {
      res.render('forgot_password');
    }
    else {
      res.render("404", {
        title: "419",
        errorMessage: "Token Was Expired.",
        status_desc: "You may be already password changed or Token was Expired."


      });

    }
  } catch (err) {
    res.render("404", {
      title: "419",
      errorMessage: "Invalid Token.",
      status_desc: "You may be already password changed or Token was Expired."

    });
  }

});

router.post("/forgot_password", (req, res) => {
  let { token, password } = req.body;
  const users = JSON.parse(fs.readFileSync(path.join(__dirname, "../../media/files/json/users.json")));
  try {
    let { email, expire } = JSON.parse(util.decryption(token));
    if (users[email].token === token && expire > Date.now() && users[email].token != null) {
      users[email].password = util.encryption(password);
      users[email].token = null;
      fs.writeFileSync(
        path.join(__dirname, "../../media/files/json/users.json"),
        JSON.stringify(users, null, 2));
      return res.send({
        status: 100,
        status_desc: "Password Reseted Successfully.",
      });
    } else {
      return res.send({
        status: 102,
        status_desc: "Invalid Token Or Expired Token",
      })
    }
  } catch (err) {
    return res.send({
      status: 102,
      status_desc: "Invalid Token Or Expired Token",
    })
  }
});



module.exports = router;