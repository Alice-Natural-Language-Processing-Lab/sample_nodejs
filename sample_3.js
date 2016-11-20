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
    //Sort_func_1(res, a); //함수를 호출(자바스크립트 : 함수도 객체다.)//
    var sort_array = Sort_func_2(a);

    res.end('정렬된 배열 : ' + sort_array.sortarray);
}).listen(port, hostname, () => //listen으로 개방상태, 즉 클라이언트가 접속하는것을 가능.//
{
    //node에서는 `, ' 는 다르다.//
    console.log(`Server running at http://${hostname}:${port}/`);
});
//////////////////
function Sort_func_1(res, number_array)
{
    number_array.sort();

    console.log(a);

    res.end(a+'\n');
}
///////////////////
function Sort_func_2(number_array)
{
    var sortarray; //변경된 배열을 가질 변수선언//

    number_array.sort();

    console.log(number_array);

    //반환 데이터 정의//
    return{
        sortarray : number_array
    };
}