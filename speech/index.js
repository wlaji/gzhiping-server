let AipSpeech = require("baidu-aip-sdk").speech;
let fs = require('fs');

let client = new AipSpeech(0, 'mrWlTnpbX9y45bIGLbGfFNiz', 'HSb23A0DyE5eEk6wvgsmOmuYAatYKFEY');

let voice = fs.readFileSync('./assets/16k_test.pcm');

let voiceBase64 = new Buffer(voice);

// 识别本地语音文件
client.recognize(voiceBase64, 'pcm', 16000).then(function(result) {
    console.log('语音识别本地音频文件结果: ' + JSON.stringify(result));
}, function(err) {
    console.log(err);
});