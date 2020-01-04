let express = require('express');
let router = express.Router();
let formidable = require('formidable');
let md5 = require('blueimp-md5');

const filter = { password: 0, __v: 0 };

const { UserModel,ChatModel } = require('../models/index');

router.post('/register', function (req, res) {
  let form = new formidable.IncomingForm()
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
  let form = new formidable.IncomingForm()
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
  let form = new formidable.IncomingForm()
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
  UserModel.findOne({ _id: userid }, filter, function (err, user) {
    res.json({ code: 0, data: user });
  })

})

router.get('/userlist', function (req, res) {
  const { type } = req.query;
  UserModel.find({ type }, filter, function (err, users) {
    res.json({ code: 0, data: users });
  })
})


router.get('/msglist', function (req, res) {
  const userid = req.cookies.userid;
  UserModel.find(function(err,userDocs){
    const users={};
    userDocs.forEach(item=>{
      users[item._id] = {username:item.username,header:item.header}
    })

    ChatModel.find({'$or':[{from:userid},{to:userid}]},filter,function(err,chatMsgs){
      res.json({code:0,data:{users,chatMsgs}})
    })
  })
})

//修改指定数据为已读
router.post('/readmsg', function (req, res) {
  let form = new formidable.IncomingForm()
  form.parse(req, function (err, fields, files) {
    const { from } = fields;
    const to = req.cookies.userid;
    ChatModel.update({from,to,read:false},{read:true},{multi:true},function(err,doc){
      res.json({code:0,data:doc.nModified})
    })
  });
})

module.exports = router;