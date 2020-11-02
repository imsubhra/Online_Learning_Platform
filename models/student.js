var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var Student = new Schema({
    name:{type:String,required:true}, 
	contact_number:{type:String,required:true} ,
	email_id :{type:String,required:true} ,  
    department:{type:String,required:true} ,
    Semester:{type:String,required:true} ,
    batch:{type:String,required:true} 
}); 



module.exports = mongoose.model('Student', Student);