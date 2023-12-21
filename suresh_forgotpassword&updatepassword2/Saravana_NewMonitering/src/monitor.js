const nmp = require("./init.js");
const app = nmp.app;
const lang = nmp.lang;
const port = nmp.port;
const path = require("path");
const login = require("./routes/login.js");
const dashboardrouter = require("./routes/dashboard.js")
const transaction = require("./routes/transaction.js");
const fs = require("fs");
const user_inactivity = require("./routes/inactivity.js");
const sessionAuth = nmp.sessionAuth;
const sessionAccountLock = nmp.sessionAccountLock;
const util = require("./util.js");
const cookieAuth = nmp.cookieAuth;
const session_hold = nmp.session_hold;
const crypto = require('crypto');
const forgot_passwordroute = require("./routes/forgot_password.js")

app.use((req, res, next) => {
  req.session.init = "init";
  next();
});

// dashboard data send all routes (middleware)
app.use((req, res, next) => {
  const { active_dashboard, default_dashboard } = util.dashboards()
  res.locals.dashboards = active_dashboard;
  res.locals.default_dashboard = {
    index: default_dashboard.length > 0 ? true : false,
    dashboard: default_dashboard
  }

  let session_expire_time = req.session?.expires
  res.locals.session_time = session_expire_time
  next()
})

app.get("/", (req, res) => {
  if (req.session.loggedin) {
    res.locals.user = req.session;
    const fileName = path.join(
      __dirname,
      "../media/files/json/custom_dashboard.json"
    );
    fs.readFile(fileName, function (err, data) {
      // Check for errors
      if (err) throw err;

      // Converting to JSON
      const dashboards = JSON.parse(data);

      let default_dashboard = dashboards.custom_dashboard.filter((value) => {
        if (value.default_dashboard == true && value.active == true) {
          return value

        }
      })

      res.writeHead(301, { location: default_dashboard.length > 0 ? `/dashboard/${default_dashboard[0].id}` : '/dashboard/standard' });
      res.end();
    })
    // res.writeHead(301, { location: "/dashboard/standard" });
    // res.end();
  } else {
    const token = crypto.randomUUID()
    res.cookie("login_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    res.locals.login_token = token
    res.render("index", {
      lang: lang,
      lang_text: lang("lang_" + lang.config.lang),
      current_lang: "lang_" + lang.config.lang,
    });
  }
});

// Language switcher
app.get("/lang/:lang", util.langCode(), (req, res) => {
  console.log(req.currentLang);
  lang.config.lang = req.currentLang;
  return res.send({
    status: req.statusCode,
    status_desc: lang("successful"),
  });
});

app.get("/chart.js", function (req, res) {
  console.log(path.join(__dirname, "/../node_modules/chart.js/auto/auto.js"));
  res.sendFile(path.join(__dirname, "/../node_modules/chart.js/auto/auto.js"));
});

// OTP Verify page
app.get("/otp_verify/:token", (req, res) => {
  const { token } = req.params
  let hashedOtp = crypto.createHash("md5").update(req.session.staff_email + "-" + req.session.otp).digest("hex");
  if (token === hashedOtp) {
    if (req.session.loggedin) {
      res.locals.user = req.session;
      res.writeHead(301, { location: "/dashboard/standard" });
      res.end();
    } else {
      return res.render("otp-verify", {
        title: "OTP verification",
        token: req.params.token,
        time: req.session.otp_time,
        resend: req.session.resend_otp,
        lang: lang,
      });
    }
  } else {
    res.render("404", {
      title: "419",
      errorMessage: "Invalid Token.",
      status_desc: "You may be Token changed or Token was Expired."
    });
  }
});


//~ app.get('/otp_verify', (req, res) => {
//~ res.render('otp-verify', {
//~ title: 'OTP verification',
//~ lang: lang
//~ })
//~ });

app.get("/dashboard", sessionAuth, cookieAuth, session_hold, sessionAccountLock, (req, res) => {
  // res.writeHead(301, { location: "/dashboard/standard" });
  // res.end();
  res.clearCookie("login_token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  })
  const fileName = path.join(
    __dirname,
    "../media/files/json/custom_dashboard.json"
  );
  fs.readFile(fileName, function (err, data) {
    // Check for errors
    if (err) throw err;

    // Converting to JSON
    const dashboards = JSON.parse(data);

    let default_dashboard = dashboards.custom_dashboard.filter((value) => {
      if (value.default_dashboard == true && value.active == true) {
        return value

      }
    })
    res.writeHead(301, { location: default_dashboard.length > 0 ? `/dashboard/${default_dashboard[0].id}` : '/dashboard/standard' });
    res.end();
  })
});



//20 - oct-23 saravanan
app.post('/change_password', sessionAuth, session_hold, sessionAccountLock, (req, res) => {
  let { oldPassword, newPassword } = req.body;
  const email = req.session.staff_email;
  const users = JSON.parse(fs.readFileSync(path.join(__dirname, "../media/files/json/users.json")));
  const Current_Password = users[email].password;
  oldPassword = util.encryption(oldPassword);
  newPassword = util.encryption(newPassword);

  if (oldPassword === Current_Password) {
    if (newPassword === Current_Password) {
      return res.json({
        status: 101,
        status_desc: 'New password shouldn\'t Same with Old One.'
      })
    }
    users[email].password = newPassword;
    fs.writeFile(
      path.join(__dirname, "../media/files/json/users.json"),
      JSON.stringify(users, null, 2),
      (error) => {
        if (error) {
          return res.status(200).send({
            status: 101,
            status_desc: error,
          });
        }
        res.json({
          status: 100,
          status_desc: 'Password Changed Successfully'
        })
      }
    );

  } else {
    res.json({
      status: 101,
      status_desc: 'Your Current Password Doesn\'t Match'
    })
  }
})

// app.get('/tabs', (req, res) => {
//   res.render('tabcontrol', {
//     lang: lang,
//     dashboard: "element",
//     dashboards: "dashboards",
//     activeTab: "dashboard-",
//     activeMenu: "id-"
//   })
// });



app.get("/settings/:type", sessionAuth, session_hold, sessionAccountLock, (req, res) => {
  let type = req.params.type;

  fs.readFile(
    path.join(__dirname, "../media/files/json/custom_dashboard.json"),
    function (err, data) {
      if (err) {
        return res.status(200).json({
          status: 101,
          status_desc: err,
        });
      } else {
        res.locals.dashboards_list = JSON.parse(data).custom_dashboard;
        let pages = ['personal_information', 'my_dashboard', 'change_password', 'user_settings'];
        if (pages.includes(type)) {
          return res.render(type, {
            lang: lang,
            activeTab: 'Profile',
            activeMenu: 'mydashboard'

          });
        }
        res.writeHead(301, { location: "/settings/personal_information" });
        res.end();


      }
    }
  );

})



app.get("/previous", (req, res) => {
  res.json({
    previousUrl: req.session.previousUrl
  })
});



app.put('/update_profile', sessionAuth, session_hold, sessionAccountLock, (req, res) => {
  const image = req.files?.image
  if (image) {
    const arr_name = image.name.split('.')
    const file_extension = arr_name[arr_name.length - 1]

    image.name = `${arr_name[0]}_${Date.now()}.${file_extension}`
    // image.mv(path.join(__dirname , `../media/images/uploads/${image.name}`))

  }

  res.status(200).send({
    status: 100,
    status_desc: "Profile Updated Successfully",

  })
});

app.post('/session_time', sessionAuth, sessionAccountLock, (req, res, next) => {
  req.session.cookie.maxAge = 30 * 60 * 1000;
  req.session.hold = true
  res.json({
    status: 100,
    status_desc: "Success"
  })
})

app.post('/extend_session', sessionAuth, sessionAccountLock, (req, res, next) => {
  let { password } = req.body
  console.log(password);
  const email = req.session.staff_email;
  console.log(email);
  const users = JSON.parse(fs.readFileSync(path.join(__dirname, "../media/files/json/users.json")));
  console.log(users);
  let Current_Password = users[email].password;
  Current_Password = util.decryption(Current_Password);
  if (password == Current_Password) {
    req.session.hold = false
    req.session.cookie.maxAge = 60 * 60 * 1000
    req.session.expires = (Date.now() + (60 * 1000));
    req.session.save()
    res.json({
      status: 100,
      status_desc: "Success"
    })
  } else {
    res.json({
      status: 103,
      status_desc: "Incorrect Password"
    })
  }


})


//end mycode

app.get("/dashboard/:type", sessionAuth, cookieAuth, session_hold, sessionAccountLock, (req, res) => {
  const type = req.params.type;
  const fileName = path.join(
    __dirname,
    "../media/files/json/custom_dashboard.json"
  );

  // Read users.json file
  fs.readFile(fileName, function (err, data) {
    // Check for errors
    if (err) throw err;

    // Converting to JSON
    const dashboards = JSON.parse(data);

    if (type == "standard") {
      res.render("dashboard", {
        lang: lang,
        diskSpace: "85",
        // dashboards: dashboards.custom_dashboard,
        activeTab: "dashboard",
        activeMenu: "standard",
      });
    } else {
      let dashboard;
      dashboards.custom_dashboard.forEach((element) => {
        if (type == element.id && element.active == true) {
          dashboard = element;
        }
      });
      if (dashboard != undefined) {
        res.render("dashboard_custom", {
          lang: lang,
          dashboard: dashboard,
          // dashboards: dashboards.custom_dashboard,
          widget_ids: dashboard.widget_ids,
          activeTab: "dashboard",
          activeMenu: dashboard.id,
        });
      } else {
        res.writeHead(301, { location: "/dashboard/standard" });
        res.end();
      }
    }
  });
});

// Transaction
app.use("/transaction", sessionAuth, session_hold, sessionAccountLock, transaction);

app.get("/activity", sessionAuth, session_hold, sessionAccountLock, (req, res) => {
  res.render("activity", {
    lang: lang,
  });
});

app.get("/server", sessionAuth, session_hold, sessionAccountLock, (req, res) => {
  res.render("server", {
    lang: lang,
  });
});

app.get("/logout", (req, res) => {
  req.session.loggedin = false;
  req.session.save();
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    res.clearCookie("login", {
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    });
    return res.redirect("/");
  });
  console.log("user logout success");
});

app.use("/user/", login);
app.use("/", dashboardrouter);
app.use("/", forgot_passwordroute);

app.use("/inactivity", sessionAuth, user_inactivity);

app.get("/create_dashboard", sessionAuth, session_hold, sessionAccountLock, (req, res) => {
  res.render("create_dashboard", {
    lang: lang,
    activeTab: "test",
    activeMenu: "test",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    errorMessage: "Page not found.",
  });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
