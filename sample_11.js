//form-data(파일전송, multipart/form-data)//
var express = require('express');
var formidable = require('formidable');
var fs = require('fs');
var bodyParser = require('body-parser'); //POST방식//
var util = require('util');

var app = express();
//POST설정//
app.use(bodyParser.json());

var form = new formidable.IncomingForm();
//업로드 정보(인코딩, 저장 디렉터리) 설정//
form.encoding = 'utf-8'; //인코딩 타입 정의//
form.uploadDir = '/Users/apple/Desktop/Programmingfile/nodejs/sample_nodejs/upload_file_folder'; //저장 디렉터리 지정//
form.multiples = true; //request.files to be arrays of files//
form.keepExtensions = true; //확장자 표시//

//받는 변수//
var fields = new Array();
var files = new Array();

//기본 post방식으로 전송//
app.post('/file_upload', function(request, response){
    //form타입 필드(text타입)에 따른 이벤트//
    form.on('field', function(field, value){
        //console.log('[field]' + field, value);
        fields.push([field, value]);
    //from타입 필드(file타입)에 따른 이벤트//
    }).on('file', function(field, file){
        //console.log('[file]' + field, file);
        fs.rename(file.path, form.uploadDir+ '/' + file.name); //파일의 이름 변경//
        files.push([field, file.name]);
    }).on('end', function() {
        //console.log('-> upload done');
        response.writeHead(200, {'content-type': 'text/plain'});
        response.write('received fields:\n\n '+util.inspect(fields));
        response.write('\n\n');
        response.end('received files:\n\n '+util.inspect(files));

        console.log('----------<fields>----------');
        var field_json = JSON.stringify(fields); //string으로 반환//
        console.log(field_json);
        console.log('----------<files>------------');
        var files_json = JSON.stringify(files); //string으로 반환//
        console.log(files_json);
        console.log('-----------------------------');

        fields = [];
        files = [];
    }).on('error', function(error) {
        console.log('[error] error : ' + error);
    });

    form.parse(request, function(error, field, file) {
        // end 이벤트까지 전송되고 나면 최종적으로 호출되는 부분
        console.log('[parse()] error : ' + error + ', field : ' + field  + ', file : ' + file);
        console.log('upload succcess...');
    });
});

app.listen(3000, function(){
    console.log('file upload test server');
})