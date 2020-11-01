const express = require('express');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const path = require('path');

const app = express();
app.use(express.json());

// using dotenv module for environment
require("dotenv").config();



const PORT = process.env.PORT || 3000;


//body parser
app.use(express.urlencoded({extended:true}));

//Setup for rendering static pages
//for static page
const publicDirectory = path.join(__dirname,'../public');
app.use(express.static(publicDirectory));



//Start the server
app.listen(PORT,()=>{
	console.log('Server listening on port',PORT);
})