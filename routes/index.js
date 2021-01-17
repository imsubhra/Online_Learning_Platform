var express = require('express');
var router = express.Router();



router.get("/",(req,res)=>{
	res.send("Login Page");
})


var teacherRoutes = require('./Teacher/teacher'); 
router.use("/teacher", teacherRoutes); 

module.exports = router;