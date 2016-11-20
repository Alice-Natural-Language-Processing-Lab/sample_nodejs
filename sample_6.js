//JSON타입으로 하기//
//JSON을 자바스크립트 객체로 변환//
//모듈//
var http = require('http');

//네트워크 관련 변수//
var hostname = '127.0.0.1';
var port = 1337;

//서버를 생성//
http.createServer((req, res) =>
{
    res.writeHead(200, {'Content-Type' : 'text/json'}); //헤더작성//
    //res.end('Hello World nodejs\n');
    //Sort_func_1(res, a); //함수를 호출(자바스크립트 : 함수도 객체다.)//
    data_trans(res);
}).listen(port, hostname, () => //listen으로 개방상태, 즉 클라이언트가 접속하는것을 가능.//
{
    //node에서는 `, ' 는 다르다.//
    console.log(`Server running at http://${hostname}:${port}/`);
});

//var accountStr = '{ "name":"John", "members":["Sam", "Smith"], "number":12345, "location":"Seoul"}';
//var accountObj = JSON.parse(accountStr);

//console.log(accountObj.name);
//console.log(accountObj.members);

function data_trans(res)
{
    //자바스크립트 객체를 JSON으로 변환(JSON형식을 만든다.)//
    var accountstrObj = 
    {
        "name":"John",
        "members":["Sam", "Smith"],
        "number":123456,
        "location":"seoul"
    }   

    var accountstrStr = JSON.stringify(accountstrObj); //string으로 반환//

    console.log(accountstrStr); //JSON반환//
    res.end(accountstrStr);
}