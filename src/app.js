const express = require('express');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const path = require('path');

const app = express();
app.use(express.json());

// using dotenv module for environment
require("dotenv").config();

//DB connection
mongoose.connect(process.env.MONGO_URL,{ useUnifiedTopology: true },()=>{
	console.log("DB Connected ...")
})

const PORT = process.env.PORT || 3000;


//body parser and View Engine
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));

//Setup for rendering static pages
//for static page
const publicDirectory = path.join(__dirname,'../public')
const viewsDirectory = path.join(__dirname,"views")
app.use(express.static(publicDirectory));
app.use('/uploads',express.static('uploads'));
app.use(express.static(viewsDirectory));

//Routes---------------------------
var IndexRoutes = require('../routes/index')
app.use(IndexRoutes)



//Start the server
app.listen(PORT,()=>{
	console.log('Server listening on port',PORT);
})