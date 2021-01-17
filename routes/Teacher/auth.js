var express =require('express')
var router = express.Router()
var path = require('path')
var multer = require('multer')
var fs =   require('fs-extra')
var {userJoin,userLeave,getCurrentUser,getRoom} = require('../chat/users')
var {formatMessage}= require('../chat/messages')
var http = require('http').Server(router)
var io   = require('socket.io')(http)
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
    res.render("teacher");
})

//Teacher details - Post Route - /teacher
router.post('/',upload.array('pptimages',100),(req,res)=>{
    //Saving Data
    const TeacherSchema = new teacherSchema();
    TeacherSchema.name = req.body.name;
    TeacherSchema.classname = req.body.classname;
    //console.log(req.files)
    req.files.forEach(function(file){
        TeacherSchema.pptimages.push(file.path);
    });
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
                res.render('linkshare',{data})
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
            res.render('presentation-teacher',{data})
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
            res.render("presentation-student",{data})
            //res.render('presentation-student.ejs',{data})
        }
    })
})

io.on('connection',function(socket){
    socket.on('joinRoom',({username,room})=>{
        const user = userJoin(socket.id,username, room);
        socket.join(user.room);
        var userList = getRoom(room);
        io.to(user.room).emit('newUser',username);
        io.to(user.room).emit('userList',userList);
      })

      socket.on('currentslide',number =>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('changeslide',number);

      })
   

      socket.on('chatMessage', msg =>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username,msg));
      });

    socket.on('disconnect',()=>{
        const user = getCurrentUser(socket.id);
        userLeave(socket.id);
        if(user){
         var userList = getRoom(user.room);
            io.to(user.room).emit('deadUser',user.username);
            io.to(user.room).emit('userList',userList);
        }
      });
});

module.exports = router;