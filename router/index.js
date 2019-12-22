var express = require('express');
var router = express.Router();
var login = require('./admin/login');
var register = require('./admin/register');

router.use(login);
router.use(register);

module.exports=router;