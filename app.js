var express = require('express');

var app = express();

//라우터별로 분리하기 위해 express의 라우터 기능 사용//

/* 
(/function) 라우터에 위임된 항목 :
ex) /function/~
1. function/file_upload.js
2. function/push.js
*/
//사용자 정의 모듈 호출(모듈경로)//
var function_fileupload_router = require('./function_fileupload/file_upload');
app.use('/function', function_fileupload_router); 

var function_push_router = require('./function_push/push');
app.use('/function', function_push_router);

app.listen(3000, function(){
    console.log('connected');
})