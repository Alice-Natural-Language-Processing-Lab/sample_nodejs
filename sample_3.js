//모듈//
var http = require('http');

var a = [3,1,2];

//네트워크 관련 변수//
var hostname = '127.0.0.1';
var port = 1337;

//서버를 생성//
http.createServer((req, res) =>
{
    res.writeHead(200, {'Content-Type' : 'text/plain'}); //헤더작성//
    //res.end('Hello World nodejs\n');
    Sort_func(res, a); //함수를 호출//
}).listen(port, hostname, () => //listen으로 개방상태, 즉 클라이언트가 접속하는것을 가능.//
{
    //node에서는 `, ' 는 다르다.//
    console.log(`Server running at http://${hostname}:${port}/`);
});
//////////////////
function Sort_func(res, number_array)
{
    number_array.sort();

    console.log(a);

    res.end(a+'\n');
}