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
var del_filename;

router.post('/file_del', function(request, response){
    del_filename = request.body.filename; //전송할 메세지를 받는다.//

    console.log('remove file name: '+del_filename);

    //삭제하는 작업을 진행(비동기 순차적 진행)//
    File_remove(del_filename, response);
});
/////////////////////////////
function File_remove(del_filename, response)
{
    //내부적으로 파일 유효성 검증과 제거를 순차적으로 진행(비동기 -> 순차적)//
    //waterfall방식으로 하여 내부적으로 task들끼리 값을 주고 받도록 모드 설정//
    async.waterfall([
        //파일이 현재 저장소에 저장되어있는지 검사//
        function(callback) //첫 시작은 하나의 callback으로 시작한다.//
        {
            console.log('search file name: '+del_filename);
    
            //우선 검색을 하기 위해서 데이터베이스의 내용을 리스트로 불러와야 한다.//
            var connection = db_connection_pool(); //DB Connection pool//

            connection.query('select filenumber, filename from filetable', function(error, rows, fields){
                if(error) throw error;
                else{
                    var is_check = false; //처음에는 파일이 없다고 가정//
                    var file_number = ''; //PK를 위해서 값을 할당.//

                    for(var i=0; i<rows.length; i++)
                    {
                        if(rows[i].filename == del_filename) //행을 돌면서 비교//
                        {
                            is_check = true; //파일이 존재//

                            file_number = rows[i].filenumber; //PK추출//

                            break;
                        }
                    }

                    if(is_check == true) //중복파일이 존재하는 경우//
                    {
                        console.log('['+del_filename+'] file is exist...(delete ok db)');

                        callback(null, is_check, file_number); //콜백을 통해 다음 작업으로 넘기는 것을 알린다.//
                    }

                    else if(is_check == false) //중복파일이 존재하지 않는 경우// 
                    {
                        console.log('['+del_filename+'] file is not exist...(not delete db)');

                        callback(null, is_check, file_number);
                    }
                }
            });

            connection.end(); //데이터베이스 작업을 한 이후 반드시 닫아준다.//
        },
        //파일을 저장소(데이터베이스)에서 삭제//
        function(is_check, file_number, callback)
        {
            console.log('is check: '+is_check);
            console.log('file number: '+file_number);

            if(is_check == true) //파일이 존재하므로 삭제 가능한 경우//
            {
                //삭제작업 진행//
                var connection = db_connection_pool(); //DB Connection pool//

                var is_success = false; //처음 실패라 가정//

                //파일제거(주요키를 이용)//
                connection.query('delete from filetable where filenumber='+file_number, function(error, result){
                    if(error) throw error;
                    else{
                        console.log('delete success...');

                        is_success = true; //성공이라 설정//

                        callback(null, is_success, file_number); //콜백함수의 인자에 맞추어서 매개변수를 설정//
                    }
                });

                connection.end(); //데이터베이스 작업을 한 이후 반드시 닫아준다.//
            }

            else if(is_check == false) //파일이 존재하지 않아서 삭제 불가능한 경우//
            {
                var is_success = false;

                callback(null, is_success, file_number);
            }
        } 
    ],
    //callback (final) -> 요기서 결과 판단하에 JSON을 만들어서 최종적으로 send한다.//
    function(err, is_success, file_number)
    {
        //전송할 JSON포맷을 만든다.//
        var result = 
        {
            'file_number': file_number
        }

        var trans_objeect = 
        {
            'is_delete':is_success,
            'info': result
        }

        if(is_success == true)
        {

            response.send(trans_objeect);
        }

        else if(is_success == false)
        {
            response.send(trans_objeect);
        }
    });
}
////////////////////////////
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
////////////////////////////
module.exports = router; //모듈 적용//