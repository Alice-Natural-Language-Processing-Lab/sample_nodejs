var express = require('express');
var mysql = require('mysql'); //데이터베이스 연결 모듈//
var async = require('async'); //비동기 순차처리를 위한 모듈//
var os = require('os');

//라우터별로 분리하기 위해 express의 라우터 기능 사용//
var router = express.Router();

//입력변수//
var pagenumber; //페이징 처리를 위한 변수(현재는 적용되지 않음)//

router.get('/file_list', function(request, response){
    //검색조건을 쿼리스트링(GET)으로 받는다.//
    pagenumber = request.query.page

    console.log('page: '+pagenumber);

    //리스트 출력 함수(비동기 순차모드)//
    File_LIST(pagenumber, response);
});
////////////////////////////
function File_LIST(page, response)
{
    //파일을 리스트로 출력//
    async.waterfall([
        //Task 1 : select file list
        function(callback)
        {
            console.log('page '+page);

            //우선 검색을 하기 위해서 데이터베이스의 내용을 리스트로 불러와야 한다.//
            var connection = db_connection_pool(); //DB Connection pool//

            //페이징 처리 시 조건을 추가해주면 된다.//
            connection.query('select filenumber, filename from filetable', function(error, rows, fields){
                if(error) throw error;
                else{
                    //필요한 변수 지정//
                    var fileinfo = new Array();
                    var file_totalnumber = 0;

                    file_totalnumber = rows.length; //총 리스트의 개수//

                    for(var i=0; i<rows.length; i++)
                    {
                        //정보를 배열에 저장//
                        var server_info = get_fileserver_info();

                        fileinfo.push([rows[i].filenumber, server_info+rows[i].filename]);
                    }

                    console.log('file count: '+file_totalnumber);

                    callback(null, page, file_totalnumber, fileinfo); //콜백호출//
                }
            });

            connection.end(); //데이터베이스 작업을 한 이후 반드시 닫아준다.//
        }
    ],
    //Final Task : JSON transform//
    function(err, page, file_totalnumber, fileinfo)
    {
        //전송할 JSON포맷을 만든다.//
        var result = 
        {
            'file_info': fileinfo
        }

        var trans_objeect = 
        {
            'page':page,
            'file_total_count':file_totalnumber,
            'data': result
        }

        var trans_json = JSON.stringify(trans_objeect); //json으로 반환//

        response.send(trans_json);
    });
}
////////////////////////////
function get_fileserver_info()
{
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

    var fileserver_url_info = addresses[0]+':3000/';

    return fileserver_url_info;
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