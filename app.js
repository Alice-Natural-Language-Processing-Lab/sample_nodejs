var express = require('express');

var app = express();

//파일들이 있는 디렉터리(정적파일)를 사용하기 위해서 설정//
app.use(express.static('upload_file_folder'));

/* 
(/function) 라우터에 위임된 항목 :
ex) /function/~(각 파일들에 있는 호출파람)
1. function/file_upload.js (라우터 경로))
2. function/push.js
*/
//사용자 정의 모듈 호출(모듈경로)//
var function_fileupload_router = require('./function_fileupload/file_upload');
app.use('/function', function_fileupload_router); 

var function_push_router = require('./function_push/push');
app.use('/function', function_push_router);

/* 
(/sample) 라우터에 위임된 항목 :
ex) /sample/~(각 파일들에 있는 호출파람)
1. sample/sample_8.js
2. sample/sample_9.js
3. sample/sample_10.js
4. sample/sample_11.js
*/
var sample_8_router = require('./sample/sample_8');
app.use('/sample', sample_8_router);

var sample_9_router = require('./sample/sample_9');
app.use('/sample', sample_9_router);

var sample_10_router = require('./sample/sample_10');
app.use('/sample', sample_10_router);

var sample_11_router = require('./sample/sample_11');
app.use('/sample', sample_11_router);

app.listen(3000, function(){
    console.log('connected');
});