var express =require('express')
var router = express.Router()
var path = require('path')
var multer = require('multer')
var fs =   require('fs-extra')


var teacherSchema = require('../../models/teacher')
const { isNullOrUndefined } = require('util')

//multer storage engine
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const path = './uploads/' + req.body.name
        fs.mkdirsSync(path);
        cb(null, path)
    },
    filename: function (req, file, cb) {
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname)) //path... will give the original extension in the file
    }
  })
 
  var upload = multer({ 
      storage: storage ,
      limits:{fileSize:10000000},
      fileFilter:(req,file,cb)=>{
        //allowed extension
        const filetypes = /jpeg|jpg|png/
        //check extension
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
        //check mimetype
        const mimetype = filetypes.test(file.mimetype)

        if(mimetype && extname){
            cb(null,true)
        }else{
            cb("Error: Image only !",false)
        }
      }
    })


//Routes 

//Teacher - Get route - /teacher
router.get('/',(req,res)=>{
    res.render("teacher.ejs");
})

//Teacher details - Post Route - /teacher
router.post('/',upload.array('pptimages',40),(req,res)=>{
    //Saving Data
    const TeacherSchema = new teacherSchema();
    TeacherSchema.name = req.body.name;
    TeacherSchema.classname = req.body.classname;
    //console.log(req.files)
    
    const reqFiles = []
    const url = req.protocol + '://' + req.get('host')
    for (var i = 0; i < req.files.length; i++) {
     reqFiles.push(url + '/public/' + req.files[i].filename)
    }
    TeacherSchema.pptimages = reqFiles;
    TeacherSchema.save(function(err,data){
        if(err){
            console.log(err);
            res.render("/teacher",{msg :"Something Went Wrong"});
        }
        else{
            
            res.redirect("/teacher/"+data._id);
        }
    })
})

//Join class id link - Get route - teacher/:id
router.get('/:id', (req,res)=>{
    teacherSchema.findById(req.params.id, (err,data)=>{
            if(err)
            {
                console.log(err)
                res.redirect('/teacher')
            }
            else 
            {
                console.log(data)
                res.render('linkshare.ejs',{data})
            }
    })
})

//Start Session - Get Route - /teacher/session/:id 
router.get('/session/:id',(req,res)=>{
    teacherSchema.findById(req.params.id,(err,data)=>{
        if(err)
        {
            console.log(err)
            res.redirect('www.google.com')
        }
        else 
        {
            res.send('In Presentation Page for Teacher')
            //res.render('presentation-teacher.ejs',{data})
        }
    })
})


//Start Session - Get Route - /teacher/student/session/:id - Student Route
router.get('/student/session/:id',(req,res)=>{
    teacherSchema.findById(req.params.id,(err,data)=>{
        if(err)
        {
            console.log(err)
            res.redirect('/teacher');
        }
        else 
        {
            res.send("In Presentation page for Student")
            //res.render('presentation-student.ejs',{data})
        }
    })
})



module.exports = router;