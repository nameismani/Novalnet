var express = require('express');
var router = express.Router();
const users_model = require('../models/users.models');
const {profileUpdateController} = require("../middleware/auth")

/* GET users listing. */
router.all('/', function(req, res, next) {
  res.locals.user = req.session;
  res.locals.active_tab = 'users';

  try {
    Promise.all([
      users_model.fetchAllUsers(req),
      users_model.fetchAllUsers(req, 1)
    ]).then((response) => {
        var page = req.body.page;
        var total_count = response[1][0].total_count
        var no_per_page = 25
        var no_of_sub_pages = Math.ceil(parseInt(total_count)/no_per_page)

        if(!page) {
            page = 1;
        }

        var page_limit = ((page * 25) - 25);

        res.render('users', {
          users: response[0],
          total_count: response[1][0].total_count,
          current: page,
          page_limit: page_limit,
          no_of_sub_pages: no_of_sub_pages,
        });
      });
    } catch (error) {
      // Handle your error here
      console.log(error);

      res.end();
    }
});
 
router.get("/profile",async(req,res)=>{
  res.locals.active_tab = 'users';
  res.render("profile")

})

router.put("/profile", profileUpdateController)





module.exports = router;
