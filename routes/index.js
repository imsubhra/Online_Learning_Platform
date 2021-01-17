var express = require('express');
var router = express.Router();

router.get("/info",function(req,res){
    res.render("info");
});

router.get("/",(req,res)=>{
	res.render("index");
})

router.get("/student",(req,res)=>{
	res.render("student");
})

var teacherRoutes = require('./Teacher/teacher'); 
router.use("/teacher", teacherRoutes); 

module.exports = router;