var http = require('http');
var url = require('url'); //GET방삭의 URL해석을 위해 필요//
var querystring = require('querystring'); //POST방식에서 chunk해석을 위해 필요//

http.createServer(function(req, res)
{
    var uri = req.url;
    var query = url.parse(uri, true).query; //URL파싱(GET)//

    //GET방식//
    if(req.method == 'GET')
    {
        res.writeHead(200, {'Content-type': 'text/html'});
        //매개변수로 설정한 값을 이용한다.//
        res.end('ID:'+query.id+'pwd:'+query.pwd);
    }

    else if(req.method == 'POST')
    {
        req.on('data', function(chunk)
        {
            console.log(chunk.toString());

            var data = querystring.parse(chunk.toString()); //POST방식의 데이터 파싱//

            res.writeHead(200, {'Content-type':'text/html'});
            res.end('id:'+data.id+'pwd:'+data.pwd);
        })
    }
}).listen(8888, function(){
    console.log('server running on 8888');
});