const md5 = require('blueimp-md5');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/gzhiping_test', { useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('连接成功')
});

const userSchema = mongoose.Schema({
  username: {//用户名
    type: String,
    required: true
  },
  password: {//密码
    type: String,
    required: true
  },
  type: {//用户类型
    type: String,
    required: true
  },
  header: {//头像
    type: String
  }
})

const UserModel = mongoose.model('user', userSchema);//集合名user会自动变为复数users

function testSave() {
  const userModel = new UserModel({
    username: 'Tom',
    password: md5('321321'),
    type: 'dashen'
  })
  userModel.save(function(err,data){
    if(err) return console.log(err);
    console.log(`数据添加成功${data}`)
  })
}

function testFind() {
  UserModel.find(function(err,data){
    if(err) return console.log(err);
    console.log(`数据查询成功${data}`)
  })
  UserModel.findOne({'username':'Tom'},function(err,data){
    if(err) return console.log(err);
    console.log(`数据查询成功${data}`)
  })
}

function testUpdate() {
  UserModel.findByIdAndUpdate(
    {_id:"5dfeec0c8f5cc949547a26ab"},
    {username:'hup'},
    function(err,data){
      console.log('更改数据',err,data)
    }
  )
}

function testDelete() {
  UserModel.remove({_id:'5dfeec0c8f5cc949547a26ab'},function(err,data){
    console.log('删除数据',err,data)
  })
}
testDelete();
