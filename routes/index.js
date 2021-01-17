var express = require('express');
var router = express.Router();



router.get("/",(req,res)=>{
	res.render("index.ejs");
})


var teacherRoutes = require('./Teacher/teacher'); 
router.use("/teacher", teacherRoutes); 

module.exports = router;