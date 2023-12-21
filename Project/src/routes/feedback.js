var express = require("express");
const date = require("date-and-time");
var router = express.Router();
const db = require("../../media/db.json");
const activitydb = require("../../media/activity.json");
const fs = require("fs");
let filteredData;
const path = require("path");
const init = require("../init.js");
const upload = require("../middleware/multer");

const writeFile = async (path, data) => {
  fs.writeFile(path, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      throw err;
    }
  });
};

addFeedbackActivityEntry = async (req, feedbackId, note) => {
  if (!feedbackId) {
    feedbackId = req.body.id;
  }
  let data = {
    id: activitydb.data.length
      ? activitydb.data[activitydb.data.length - 1].id + 1
      : 1,
    feedbackId: Number(feedbackId),
    psp_staff_id: req.session.userId,
    note: note,
    date: date.format(new Date(), "YYYY.MM.DD HH:mm:ss"),
  };
  activitydb.data.push(data);
  writeFile("./media/activity.json", activitydb);
};
/* GET feedback page. */
router.all("/", function (req, res) {
  console.log(req.body);
  res.locals.user = req.session;
  res.locals.active_tab = "";
  let {
    feedbackPage: page,
    feedbackActivityPage: activityPage,
    status,
    filter_date,
    show,
  } = req.body;
  let filters = {};
  let data;
  console.log(typeof filter_date, page, status);
  if (!page) {
    page = 1;
  }
  if (!activityPage) {
    activityPage = 1;
  }
  if (!show) {
    show = 10;
  } else {
    show = Number(show);
  }
  let activityData = activitydb.data.slice().reverse();
  let total_count;
  let page_limit_start = page * show - show;
  let page_limit_end = page * show - show + show;
  let total_activity_count = activitydb.data.length;
  let activityPage_limit_start = activityPage * 10 - 10;
  let activityPage_limit_end = activityPage * 10 - 10 + 10;
  let fstartDate = String(String(filter_date).split("-")[0]).split(".");
  let fendDate = String(String(filter_date).split("-")[1]).split(".");

  let filterDate = (startDate, endDate) => {
    filteredData = db.filter((item) => {
      const creationDate = new Date(item.creation_date);
      console.log(creationDate.toISOString().split("T")[0], startDate, endDate);
      return (
        creationDate.toISOString().split("T")[0] >=
          startDate.toISOString().split("T")[0] &&
        creationDate.toISOString().split("T")[0] <=
          endDate.toISOString().split("T")[0]
      );
    });

    return filteredData;
  };

  if (!status) {
    data = db.slice(page_limit_start, page_limit_end);
    total_count = db.length;
    console.log(total_count);
  }
  if ((status && filter_date.length > 0) || status || filter_date > 0) {
    console.log("inside");
    if (status != "All" && filter_date.length > 0) {
      console.log("and");
      filters.status = status;
      filters.filter_date = filter_date;
      const startDate = new Date(
        fstartDate[2],
        Number(fstartDate[1]) - 1,
        fstartDate[0]
      );
      const endDate = new Date(
        fendDate[2],
        Number(fendDate[1]) - 1,
        fendDate[0]
      );
      filteredData = filterDate(startDate, endDate);
      data = filteredData
        .filter((data) => data.status == status)
        .slice(page_limit_start, page_limit_end);
      total_count = filteredData.filter((data) => data.status == status).length;
    } else if (filter_date.length > 0) {
      console.log("fdasdfdsf");
      filters.filter_date = filter_date;
      const startDate = new Date(
        fstartDate[2],
        Number(fstartDate[1]) - 1,
        fstartDate[0]
      );
      const endDate = new Date(
        fendDate[2],
        Number(fendDate[1]) - 1,
        fendDate[0]
      );

      filteredData = filterDate(startDate, endDate);
      data = filteredData.slice(page_limit_start, page_limit_end);
      total_count = filteredData.length;
      console.log(data);
    } else if (status) {
      console.log("status");
      filters.status = status;
      if (status == "All") {
        data = db.slice(page_limit_start, page_limit_end);
        total_count = db.length;
      } else {
        data = db
          .filter((data) => data.status == status)
          .slice(page_limit_start, page_limit_end);
        total_count = db.filter((data) => data.status == status).length;
      }
    }
  }
  let no_of_sub_pages = Math.ceil(parseInt(total_count) / show);
  let no_of_activitysub_pages = Math.ceil(parseInt(total_activity_count) / 10);
  res.render("feedback", {
    feedbacks: data,
    activites: activityData.slice(
      activityPage_limit_start,
      activityPage_limit_end
    ),
    filters: filters,
    total_count: total_count,
    total_activity_count: total_activity_count,
    current: page,
    show: show,
    currentActivity: activityPage,
    page_limit: page_limit_start,
    activity_page_limit: activityPage_limit_start,
    no_of_sub_pages: no_of_sub_pages,
    no_of_activitysub_pages: no_of_activitysub_pages,
  });
});

router.get("/:id", (req, res) => {
  console.log(req.params.id);
  const getData = db.find((feed) => feed.id === parseInt(req.params.id));
  if (getData) {
    res.status(200).json({
      message: "data exist",
      data: getData,
    });
  }
});

router.post("/post", upload, async (req, res) => {
  // console.log(date.format((new Date()), 'YYYY.MM.DD HH:mm:ss'))
  console.log("afdsadfdsf", req.files);
  // let value = ""; 
  let imagesName;
  if(req.files){
      // for(let i=0; i<req.files.length; i++){
      //   value += req.files[i].filename + " "
      // }
      imagesName = req.files.filename.map(val=> val.filename)
  }

  const data = {
    id: db.length ? db[db.length - 1].id + 1 : 1,
    feedback: req.body.note,
    Assignee_id: req.session.userId,
    Assigne_name: req.session.first_name,
    category: req.body.type,
    status: "Openend",
    creation_date: date.format(new Date(), "YYYY.MM.DD HH:mm:ss"),
    isdisabled: 0,
    image:  imagesName.length > 0 ? imagesName.join(',') : "null.png",
  };
  db.push(data);
  writeFile("./media/db.json", db);
  res.status(200).json({
    message: "received data",
  });
});

router.post("/email", async (req, res) => {
  console.log("email");
  const { category, id } = req.body;
  console.log(req.body);
  const rows = await req.app
    .get("db")
    .query("SELECT * FROM psp_staff WHERE id = ? ORDER BY ID DESC LIMIT 1", [
      id,
    ]);
  const email = rows[0].email;
  const userName = rows[0].first_name.concat(" ", rows[0].last_name);
  // console.log(email, userName)
  const template = await req.app
    .get("nmp_ejs")
    .renderFile(path.join(__dirname, "/../../mailtemplate/feedbackmail.ejs"), {
      userName: userName,
      category: category,
    });
  var mailOptions = {
    from: '"Novalnet Ticketing Team" charles_a@novalnetsolutions.com',
    to: "manikanddfgan_b@novalnetsolutions.com",
    subject: "Response for feedback",
    html: template,
  };
  req.app.get("mailer").sendMail(mailOptions, async (error, info) => {
    if (error) {
      res.status(404).json({
        message: "Some error occured",
        status: 404,
      });
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);

      res.status(200).json({
        message: "Email sent successfully",
        staus: 200,
      });
    }
  });
});

router.patch("/patch", async (req, res) => {
  const { id, status, isdisabled } = req.body;
  // note = res.locals.user.first_name + ' ' + res.locals.user.last_name + ' changed the task status from ' + ticketDetails[0].name + ' to ' + currentStatus[0].name;
  const feedback = db.find((feed) => feed.id === parseInt(id));
  if (feedback) {
    if (status) {
      let note =
        res.locals.user.first_name +
        " " +
        res.locals.user.last_name +
        " changed task status for feedback id " +
        id +
        " from " +
        feedback.status +
        " to " +
        status;

      feedback.status = status;
      await addFeedbackActivityEntry(req, id, note);
    } else if (isdisabled) {
      let note =
        res.locals.user.first_name +
        " " +
        res.locals.user.last_name +
        " triggered email for feedback id " +
        id;
      feedback.isdisabled = isdisabled;
      addFeedbackActivityEntry(req, id, note);
    }

    writeFile("./media/db.json", db);
    res.status(200).json({
      message: "Updated successfully",
    });
  } else {
    res.status(404).json({
      message: "Can't update. Feedback not found",
    });
  }
});

router.delete("/delete", async (req, res) => {
  const feedbackIndex = db.findIndex(
    (feed) => feed.id === parseInt(req.body.id)
  );
  let note =
    res.locals.user.first_name +
    " " +
    res.locals.user.last_name +
    " deleted feedback id " +
    req.body.id;
  let feedbackId;
  if (!feedbackId) {
    feedbackId = req.body.id;
  }
  let data = {
    id: activitydb.data.length
      ? activitydb.data[activitydb.data.length - 1].id + 1
      : 1,
    feedbackId: Number(feedbackId),
    psp_staff_id: req.session.userId,
    note: note,
    date: date.format(new Date(), "YYYY.MM.DD HH:mm:ss"),
  };
  activitydb.data.push(data);
  if (feedbackIndex !== -1) {
    db.splice(feedbackIndex, 1);

    writeFile("./media/db.json", db);
    //   addFeedbackActivityEntry(req,id,note)
    fs.writeFile(
      "./media/activity.json",
      JSON.stringify(activitydb, null, 2),
      (err) => {
        if (err) {
          throw err;
        }
      }
    );
    res.status(200).json({
      message: "Deleted successfully",
    });
  } else {
    res.status(404).json({
      message: "some error occured",
    });
  }
});

module.exports = router;
