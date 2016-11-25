//form-data(파일전송, multipart/form-data)//
var express = require('express');
var formidable = require('formidable');
var fs = require('fs');
var bodyParser = require('body-parser'); //POST방식//
var util = require('util');
var os = require('os');
var mysql = require('mysql'); //데이터베이스 연결 모듈//

var app = express();
//라우터별로 분리하기 위해 express의 라우터 기능 사용//
var router = express.Router();

//POST설정//
router.use(bodyParser.json());

//받는 변수//
var fields = new Array();
var files = new Array();
var fields_array = new Array();
var files_array = new Array();

//파일저장형식(IP/PORT)//
var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

var file_save_info = addresses[0]+':3000/';

//기본 post방식으로 전송//
router.post('/file_upload', function(request, response){
    var form = new formidable.IncomingForm(); //헤더를 만들어주는 역할이기에 밖에 있으면 안된다.(헤더 중첩에러 발생)//
    //업로드 정보(인코딩, 저장 디렉터리) 설정//
    form.encoding = 'utf-8'; //인코딩 타입 정의//
    form.uploadDir = '/Users/apple/Desktop/Programmingfile/nodejs/sample_nodejs/upload_file_folder'; //저장 디렉터리 지정//
    form.multiples = true; //request.files to be arrays of files//
    form.keepExtensions = true; //확장자 표시//

    //form타입 필드(text타입)에 따른 이벤트(콜백 방식으로 구성)//
    form.on('field', function(field, value){
        //console.log('[field]' + field, value);
        fields.push([field, value]);
        fields_array.push(value);
    //from타입 필드(file타입)에 따른 이벤트//
    }).on('file', function(field, file){
        //console.log('[file]' + field, file);
        fs.rename(file.path, form.uploadDir+ '/' + file.name); //파일의 이름 변경//
        files.push([field, file.name]);
        files_array.push(file.name);
    }).on('end', function() {
        console.log('----------<fields>----------');
        var field_json = JSON.stringify(fields); //json으로 반환//
        console.log(field_json);
        console.log('----------<files>------------');
        var files_json = JSON.stringify(files); //json으로 반환//
        console.log(files_json);
        console.log('-----------------------------');

        //추가작업(데이터베이스)//
        File_save(fields_array, files_array, field_json, files_json, response)

        //초기화//
        fields = [];
        files = [];
        fields_array = [];
        files_array = [];
    }).on('error', function(error) {
        console.log('[error] error : ' + error);
    });

    form.parse(request, function(error, field, file) {
        // end 이벤트까지 전송되고 나면 최종적으로 호출되는 부분
        console.log('[parse()] error : ' + error + ', field : ' + field  + ', file : ' + file);
        console.log('upload succcess...');
    });
});
//////////////////////////
function File_save(fields_array, files_array, field_json, files_json, response)
{
    var is_success = false; //기본적으로 저장이 실패라 가정//

    //저장변수//
    var name, id, password;
    var file_name = []; //파일은 여러개가 될 수 있으니 배열//

    var result;
    var trans_objeect;

    console.log('db job...');

    for(var i=0; i<fields_array.length; i++)
    {
        //필드에 맞추어서 분할//
        if(i==0)
        {
            name = fields_array[0];
        }

        else if(i==1)
        {
            id = fields_array[1];
        }

        else if(i==2)
        {
            password = fields_array[2];
        }
    }

    console.log('name : ' + name);
    console.log('id : ' + id);
    console.log('password : ' + password);

    file_name = files_array; //배열을 저장.//

    //데이터베이스에 저장.//
    //파일을 1개 들어온다는 가정이니 insert문을 for문을 이용해서 한번만 수행//
    console.log('***********');

    for(var i=0; i<file_name.length; i++)
    {
        console.log('insert ['+file_name[i]+']');

        //파일저장.(비동기 콜백 작업)//
        var file_insert_callback = File_Insert(file_name[i],function(is_success_str){
            console.log('success insert : ' + is_success_str);

            is_success = is_success_str;

            if(is_success == true) //파일저장 성공//
            {
                //전송 json객체를 만든다.//
                this.result = 
                {
                    'fields':field_json,
                    'files':files_json
                }

                this.trans_objeect = 
                {
                    'is_upload':'success',
                    'data': this.result
                }
            }

            else if(is_success == false) //파일저장 실패//
            {
                //전송 json객체를 만든다.//
                this.result = 
                {
                    'fields':field_json,
                    'files':files_json
                }

                this.trans_objeect = 
                {
                    'is_upload':'fail',
                    'data': this.result
                }   
            }
        });
    }

    response.send(trans_objeect);
}
//////////////////////////////
function File_Insert(file_name, callback)
{
    var is_success_str = false; //처음엔 실패했다고 가정//

    //우선 검색을 하기 위해서 데이터베이스의 내용을 리스트로 불러와야 한다.//
    var connection = db_connection_pool(); //DB Connection pool//

    connection.query('select filename from filetable', function(error, rows, fields){
        if(error) throw error;
        else{
            var is_duplicate = false; //기본은 파일에 중복이 있다고 가정//

            for(var i=0; i<rows.length; i++)
            {
                if(rows[i].filename == file_name) //행을 돌면서 비교//
                {
                    is_duplicate = true; //중복이 존재//

                    break;
                }
            }

            if(is_duplicate == true)
            {
                console.log('['+file_name+'] file is exist...(not insert db)');

                is_success_str = true;

                callback(is_success_str);
            }

            else if(is_duplicate == false)
            {
                console.log('['+file_name+'] file is not exist...(insert db)');

                //비동기이므로 콜백작업//
                var insert_file_callback = INSERT_file(file_name, function(is_success){
                    console.log('callback value: '+is_success);

                    is_success_str = is_success; //값을 전달하기 위한 설정//
                    
                    //콜백지옥 발생가능 존재//
                    callback(is_success_str);
                });
            }
        }
    });

    connection.end(); //데이터베이스 작업을 한 이후 반드시 닫아준다.//
}
/////////////////////////////
function INSERT_file(file_name, callback) //콜백 추가//
{
    var connection = db_connection_pool(); //DB Connection pool//

    var is_success = false; //처음 실패라 가정//

    var insert_data_array = [file_name]; //배열로 만든다.//

    connection.query('insert into filetable(filename) values(?)',insert_data_array, function(error, result){
        if(error) throw error;
        else{
            console.log('insert success...');

            is_success = true;

            callback(is_success); //콜백함수의 인자에 맞추어서 매개변수를 설정//
        }
    });

    connection.end(); //데이터베이스 작업을 한 이후 반드시 닫아준다.//
}
//////////////////////////////
function db_connection_pool()
{
    //데이터베이스 정보 설정//
    var connection = mysql.createConnection({
        host : 'localhost', //db ip address//
        port : 3306, //db port number//
        user : 'root', //db id//
        password : '3315', //db password//
        database : 'blogtest' //db schema name//
    });

    //mysql connection//
    connection.connect(function(err){
        if(err){
            console.error('mysql connection error');
            console.error(err);
        }

        else{
            console.log('connection success...');
        }
    });

    return connection;
}
/////////////////////////////
module.exports = router; //모듈 적용//