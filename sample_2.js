//Simple Web server//
const http = require('http');

const hostname = '127.0.0.1';
const port = 1337;

//서버를 생성//
http.createServer((req, res) =>
{
    res.writeHead(200, {'Content-Type' : 'text/plain'});
    res.end('Hello World nodejs\n');
}).listen(port, hostname, () =>
{
    //node에서는 `, ' 는 다르다.//
    console.log(`Server running at http://${hostname}:${port}/`);
});