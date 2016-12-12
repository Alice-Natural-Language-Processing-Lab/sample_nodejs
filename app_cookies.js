var express = require('express'); //express는 기본적으로 쿠키의 기능을 가지고 있지 않다.//
var cookieParser = require('cookie-parser') //쿠키//
var app = express();

app.use(cookieParser()) //쿠키파서 등록//

app.get('/count', function(request, response){
    if(request.cookies.count)
    {
        var count = parseInt(request.cookies.count); //숫자로 파싱//
    }

    else //count값이 없으면 0//
    {
        var count = 0;
    }

    count = count + 1;

    response.cookie('count', count); //쿠키전송//
    response.send('count : ' + count); //request의 쿠키값 추출//
});

app.listen(3000, function(){
    console.log('Connected 3000 port')
});