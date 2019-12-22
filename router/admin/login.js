var express = require('express');
var router = express.Router();

router.get('/login',function(req,res,next){
  res.send('用户登录')
})

module.exports=router;