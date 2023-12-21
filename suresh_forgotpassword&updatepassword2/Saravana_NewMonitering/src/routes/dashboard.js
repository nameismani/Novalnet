const nmp = require("../init.js");
const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const sessionAuth = nmp.sessionAuth;
const sessionAccountLock = nmp.sessionAccountLock;
const uuid = require('uuid');
const util = require("../util.js");
const lang = nmp.lang;
const session_hold = nmp.session_hold;



router.post("/new_dashboard", sessionAuth, session_hold, sessionAccountLock, (req, res) => {
  const newcustom_dashboard = req.body;
  fs.readFile(
    path.join(__dirname, "../../media/files/json/custom_dashboard.json"),
    function (err, data) {
      if (err) {
        return res.status(200).send({
          status: 101,
          status_desc: err,
        });
      } else {
        var json = JSON.parse(data);
        var custom_dashboard = json.custom_dashboard;

        let checkName = custom_dashboard.find(function (element) {
          return element.name == newcustom_dashboard.name;

        });
        if (checkName) {
          return res.status(200).json({
            status: 101,
            status_desc: "Dashboard Name Already Exist !",
          });
        }
        var dashboard_id = uuid.v1();

        newcustom_dashboard.id = dashboard_id;
        newcustom_dashboard.default_dashboard = "0";
        custom_dashboard.push(newcustom_dashboard);

        fs.writeFile(
          path.join(__dirname, "../../media/files/json/custom_dashboard.json"),
          JSON.stringify({ custom_dashboard }, null, 2),
          (error) => {
            if (error) {
              return res.status(200).send({
                status: 101,
                status_desc: error,
              });
            } else {
              return res.status(200).send({
                status: 100,
                status_desc: 'Dashboard Saved Successfully.',
                redirect: dashboard_id,
                dashboard_name: newcustom_dashboard.name

              });
            }
          }
        );
      }
    }
  );
});

router.get("/edit_dashboard/:id", sessionAuth, session_hold, sessionAccountLock, (req, res) => {
  let id = req.params.id;

  fs.readFile(
    path.join(__dirname, "../../media/files/json/custom_dashboard.json"),
    function (err, dashboards) {
      if (err) {
        return res.status(200).send({
          status: 101,
          status_desc: err,
        });
      } else {
        dashboards = JSON.parse(dashboards).custom_dashboard;

        dashboards.forEach((element) => {
          if (element.id == id) {
            res.render("edit_dashboard", {
              lang: lang,
              dashboard: element,
              // dashboards: dashboards,
              widget_ids: element.widget_ids,
              activeTab: "dashboard-",
              activeMenu: "id-",
              id: id
            });

          }
        });
      }
    }
  );
});


router.put("/edit_dashboard", sessionAuth, session_hold, sessionAccountLock, (req, res) => {
  const dashboard = req.body.dashboard;
  let widget_modified = false;
  fs.readFile(
    path.join(__dirname, "../../media/files/json/custom_dashboard.json"),
    function (err, data) {
      if (err) {
        return res.status(200).send({
          status: 101,
          status_desc: err,
        });
      } else {
        var json = JSON.parse(data);
        var custom_dashboard = json.custom_dashboard;
        for (let i = 0; i < custom_dashboard.length; i++) {
          if (custom_dashboard[i].id == dashboard.id) {
            if (!(JSON.stringify(custom_dashboard[i].widget_ids) === JSON.stringify(dashboard.widget_ids))) {
              custom_dashboard[i].id = dashboard.id;
              custom_dashboard[i].name = dashboard.name;
              custom_dashboard[i].widget_ids = dashboard.widget_ids;
              widget_modified = true;
            }

          }
        }

        if (widget_modified) {
          fs.writeFile(
            path.join(__dirname, "../../media/files/json/custom_dashboard.json"),
            JSON.stringify({ custom_dashboard }, null, 2),
            (error) => {
              if (error) {
                return res.status(200).send({
                  status: 101,
                  status_desc: error,
                });
              } else {
                return res.status(200).send({
                  status: 100,
                  status_desc: "success",
                  redirect: dashboard.id,
                });
              }
            }
          );
        } else {
          return res.status(200).send({
            status: 100,
            status_desc: "success",
            redirect: dashboard.id,
          });
        }

      }
    }
  );
});

router.delete("/delete_dashboard", sessionAuth, session_hold, sessionAccountLock, (req, res) => {
  let id = req.body.dashboard;

  fs.readFile(
    path.join(__dirname, "../../media/files/json/custom_dashboard.json"),
    function (err, dashboards) {
      if (err) {
        return res.status(200).send({
          status: 101,
          status_desc: err,
        });
      }
      else {
        dashboards = JSON.parse(dashboards).custom_dashboard;
        let delete_dashboard_name;
        const custom_dashboard = dashboards.filter((item) => {
          if (item.id != id) {
            return item
          }
          if (item.id == id) {
            delete_dashboard_name = item.name
          }

        })

        fs.writeFile(
          path.join(__dirname, "../../media/files/json/custom_dashboard.json"),
          JSON.stringify({ custom_dashboard }, null, 2),
          (error) => {
            if (error) {
              return res.status(200).send({
                status: 101,
                status_desc: error,
              });
            } else {
              return res.status(200).send({
                status: 100,
                status_desc: "success",
                redirect: "standard",
                dashboard_name: delete_dashboard_name
              });
            }
          }
        );
      }


    })
});

router.post("/dashboard_status", sessionAuth, session_hold, sessionAccountLock, (req, res) => {
  let id = req.body.dashboard
  let dashboard_status = req.body.status
  fs.readFile(
    path.join(__dirname, "../../media/files/json/custom_dashboard.json"),
    function (err, dashboards) {
      if (err) {
        console.log("status ferr", err);
        return res.status(200).send({
          status: 101,
          status_desc: err,
        });
      }
      else {
        dashboards = JSON.parse(dashboards).custom_dashboard;
        const custom_dashboard = dashboards.map((item) => {
          if (item.id == id) {
            item.active = dashboard_status;
          }
          return item
        })

        fs.writeFile(
          path.join(__dirname, "../../media/files/json/custom_dashboard.json"),
          JSON.stringify({ custom_dashboard }, null, 2),
          (error) => {
            if (error) {
              console.log("status err", error);
              return res.status(200).send({
                status: 101,
                status_desc: error,
              });
            } else {
              console.log("status dash");
              return res.status(200).send({
                status: 100,
                status_desc: "success",
                active: dashboard_status,
                dashboards: util.active_dashboard()

              });
            }
          }
        );
      }
    });

});


router.post('/set_default_dashboard', sessionAuth, session_hold, sessionAccountLock, (req, res) => {
  let id = req.body.dashboard_id
  let dashboard_default_status = req.body.status
  fs.readFile(
    path.join(__dirname, "../../media/files/json/custom_dashboard.json"),
    function (err, dashboards) {
      if (err) {
        return res.status(200).send({
          status: 101,
          status_desc: err,
        });
      }
      else {
        dashboards = JSON.parse(dashboards).custom_dashboard;
        let orderByDashboard = []

        const custom_dashboard = dashboards.map((item) => {
          if (item.id == id) {

            item.default_dashboard = dashboard_default_status;
            if (item.active == true) {
              if (dashboard_default_status == true) {
                orderByDashboard.unshift(item)

              } else {
                orderByDashboard.push(item)
              }
            }
          } else {
            item.default_dashboard = '0';
            if (item.active == true) {
              orderByDashboard.push(item);
            }

          }
          return item
        })
        fs.writeFile(
          path.join(__dirname, "../../media/files/json/custom_dashboard.json"),
          JSON.stringify({ custom_dashboard }, null, 2),
          (error) => {
            if (error) {
              return res.status(200).send({
                status: 101,
                status_desc: error,
              });
            } else {
              return res.status(200).send({
                status: 100,
                status_desc: "success",
                active: dashboard_default_status,
                dashboards: orderByDashboard
              });
            }
          }
        );
      }
    })
})

module.exports = router