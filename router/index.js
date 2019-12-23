var express = require('express');
var router = express.Router();
var formidable=require('formidable');
var md5=require('blueimp-md5');

const filter={password:0,_v:0};

const {UserModel} = require('../models/index');

router.post('/register',function(req,res){
  var form = new formidable.IncomingForm()
  form.parse(req, function(err, fields, files) {
    const {username,password,type} = fields;
    UserModel.findOne({username},function(err,user){
      if(user){
        res.json({
          code:1,
          msg:'此用户已存在'
        })
      }else{
        new UserModel({username,password:md5(password),type}).save(function(err,user){
          res.cookie('userid',user._id,{maxAge:1000*60*60*24});
          const data={username,type,id:user._id};
          res.json({
            code:0,
            data:data
          })
        })
      }
    })
    
  });
})

router.post('/login',function(req,res){
  var form = new formidable.IncomingForm()
  form.parse(req, function(err, fields, files) {
    const {username,password} = fields;
    UserModel.findOne({username,password:md5(password)},filter,function(err,user){
      if(user){
        res.cookie('userid',user._id,{maxAge:1000*60*60*24});
        res.json({
          code:0,
          data:user
        })
      }else{
        res.json({
          code:1,
          msg:'用户名或密码错误'
        })
      }
    })
    
  });
})

module.exports=router;