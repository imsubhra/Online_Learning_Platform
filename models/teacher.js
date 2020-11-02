var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var Teacher = new Schema({
    name:{type:String,required:true}, 
	contact_number:{type:String,required:true} ,
	email_id :{type:String,required:true} ,  
    department:{type:String,required:true} ,
}); 



module.exports = mongoose.model('Teacher', Teacher);