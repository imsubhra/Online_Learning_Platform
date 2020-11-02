var express =require('express')
var router = express.Router()


var Teacher = require('../../models/teacher')

//Routes 
router.get('/',(req,res)=>{
    res.send("Registration Page for Teacher !");
})

module.exports = router;