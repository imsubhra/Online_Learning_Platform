var express =require('express')
var router = express.Router()


var Teacher = require('../../models/student')

//Routes 
router.get('/',(req,res)=>{
    res.send("Registration Page for Student !");
})

module.exports = router;