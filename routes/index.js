var express = require('express');
var router = express.Router();



router.get("/",(req,res)=>{
	res.send("Login Page");
})


var teacherRoutes = require('./Teacher/teacher'); 
var studentRoutes = require('./Student/student');
router.use("/teacher", teacherRoutes); 
router.use("/student", studentRoutes); 

module.exports = router;