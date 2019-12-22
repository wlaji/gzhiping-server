const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/gzhiping', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('数据库连接成功')
});

const userSchema = mongoose.Schema({
  username: { type: String, required: true },//用户名
  password: {type: String,required: true},//密码
  type: {type: String,required: true},//用户类型
  header: {type: String,},//头像名称
  post: {type: String,},//职位
  info: {type: String,},//个人或者职位简介
  company: {type: String,},//公司名称
  salary: {type: String}//月薪
})

const UserModel=mongoose.model('user',userSchema);

exports.UserModel=UserModel;