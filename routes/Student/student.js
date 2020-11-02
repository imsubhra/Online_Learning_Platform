var express = require('express'); 
var router = express.Router();

var auth = require('./auth'); 
router.use(auth); 

module.exports = router; 