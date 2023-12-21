var express = require('express');
var router = express.Router();


router.all('/',async function(req, res, next) {
  
 try {
  const {userInActive} = req.body

  if(userInActive){
  req.session.checkUserActivity.inActiveUser = true
  req.session.prev_page.url = req.headers.referer

  res.status(200).json({
    message:"locked"
  })
}  
 } catch (error) {
  console.log(error);
 }
});

router.all("/page",function(req,res,next){
 
  
  if(req.session.prev_page.formData != null && req.session.prev_page.url != null){
    
    req.session.checkUserActivity.lockPage = 0
    req.session.save()
  }

  if(req.session.checkUserActivity.inActiveUser){
   res.render("lock_screen",{title:"lock_screen"})
  }else{
    res.redirect("/")
  }
})




module.exports = router;