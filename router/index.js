var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var md5 = require('blueimp-md5');

const filter = { password: 0, _v: 0 };

const { UserModel } = require('../models/index');

router.post('/register', function (req, res) {
  var form = new formidable.IncomingForm()
  form.parse(req, function (err, fields, files) {
    const { username, password, type } = fields;
    UserModel.findOne({ username }, function (err, user) {
      if (user) {
        res.json({
          code: 1,
          msg: '此用户已存在'
        })
      } else {
        new UserModel({ username, password: md5(password), type }).save(function (err, user) {
          res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 * 7 });
          const data = { username, type, id: user._id };
          res.json({
            code: 0,
            data: data
          })
        })
      }
    })

  });
})

router.post('/login', function (req, res) {
  var form = new formidable.IncomingForm()
  form.parse(req, function (err, fields, files) {
    const { username, password } = fields;
    UserModel.findOne({ username, password: md5(password) }, filter, function (err, user) {
      if (user) {
        res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 * 7 });
        res.json({
          code: 0,
          data: user
        })
      } else {
        res.json({
          code: 1,
          msg: '用户名或密码错误'
        })
      }
    })

  });
})

router.post('/update', function (req, res) {
  const userid = req.cookies.userid;
  if (!userid) {
    res.json({ code: 1, msg: '请先登录!' })
    return;
  }
  var form = new formidable.IncomingForm()
  form.parse(req, function (err, fields, files) {
    UserModel.findByIdAndUpdate(
      { _id: userid },
      fields,
      function (error, oldUser) {
        const { _id, username, type } = oldUser;
        const resData = Object.assign(fields, { _id, username, type })
        if (!oldUser) {
          res.clearCookie('userid')
          res.json({ code: 1, msg: '请先登录!' })
        } else {
          res.json({ code: 0, data: resData })
        }
      }
    )
  });
})

router.get('/user', function (req, res) {
  const userid = req.cookies.userid;
  if (!userid) {
    res.json({ code: 1, msg: '请先登录!' })
    return;
  }
  UserModel.findOne({_id:userid},filter,function(err,user){
    res.send({code:0,data:user});
  })

})


module.exports = router;