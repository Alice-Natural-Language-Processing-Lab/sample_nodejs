var express = require('express');
var mysql = require('mysql'); //데이터베이스 연결 모듈//
var bodyParser = require('body-parser'); //POST방식//
var async = require('async'); //비동기 순차처리를 위한 모듈//

//라우터별로 분리하기 위해 express의 라우터 기능 사용//
var router = express.Router();

//POST설정//
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({     //to support URL-encoded bodies (url-encoded방식)//
    extended: true
}));

//입력변수//
var fileurl;

router.post('/ios_file_upload', function(request, response){
    fileurl = request.body.fileurl; //전송할 메세지를 받는다.//
    //ios는 assets-library형태이기에 url값을 받는다.//

    console.log('upload file url: '+fileurl);

    //삭제하는 작업을 진행(비동기 순차적 진행)//
    File_upload(fileurl, response);
});
/////////////////////////////
router.get('/ios_file_list', function(request, response){
    console.log('get file list');

    get_filelist(response);
});
/////////////////////////////
function File_upload(fileurl, response){
    async.waterfall([
        //파일이 현재 저장소에 저장되어있는지 검사//
        function(callback) //첫 시작은 하나의 callback으로 시작한다.//
        {
            var connection = db_connection_pool(); //DB Connection pool//

            //insert할 형식을 맞추어준다.//
            var field_array = {
                file_url:fileurl
            }

            connection.query('insert into file set ?',field_array, function(error, result){
                if(error) throw error;
                else{
                    console.log('insert success...');

                    callback(null, 'insert success...');
                }
            });

            connection.end(); //데이터베이스 작업을 한 이후 반드시 닫아준다.//
        }
    ],
    //Final Task : send result//
    function(callback, message){
        var trans_objeect = 
        {
            'result':message
        } 

        var trans_json = JSON.stringify(trans_objeect); //json으로 반환//

        response.send(trans_json);

        console.log('--------------------------');
    });
}
/////////////////////////////
function get_filelist(response){
    //Task 1 : 데이터베이스 개방//
    async.waterfall([
        function(callback) //첫 시작은 하나의 callback으로 시작한다.//
        {
            var connection = db_connection_pool(); //DB Connection pool//

            var file_list = new Array(); //유저리스트이기에 배열을 선언//

            connection.query('select file_num, file_url from file', function(error, rows, fields){
                if(error) throw error;
                else{
                    for(var i=0; i<rows.length; i++)
                    {
                        //데이터 형식에 맞게 객체를 지정//
                        var object = 
                        {
                            "file_num":rows[i].file_num,
                            "file_url":rows[i].file_url
                        }

                        file_list.push(object);
                    }
                }

                callback(null, file_list);
            });

            connection.end(); //데이터베이스 작업을 한 이후 반드시 닫아준다.//
        }
    ],
    //Final Task : 리스트 전송//
    function(callback, file_list){
        console.log('trans data : '+file_list);

        //전송 json객체를 만든다.//
        var result = 
        {
            "results":file_list,
        }

        var trans_json = JSON.stringify(result); //json으로 반환//

        response.send(trans_json);
    });
}
/////////////////////////////
function db_connection_pool()
{
    //데이터베이스 정보 설정//
    var connection = mysql.createConnection({
        host : 'localhost', //db ip address//
        port : 3306, //db port number//
        user : 'root', //db id//
        password : '3315', //db password//
        database : 'test' //db schema name//
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
////////////////////////////
module.exports = router; //모듈 적용//