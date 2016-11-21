//express모듈(endpoint등록가능)//
var express = require('express');
var app = express(); 

//POST를 적용하기 위한 설정//
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

//GET방식//
app.get('/endpoint_get', function(request, response){
    var id = request.query.id;

    response.end('id(get): '+id);
});

//POST방식//
app.post('/endpoint_post', function(request, response){
    var id = request.body.id;

    //관련 작업하기//
    if(id == 'scw0531')
    {
        data_trans(response);
    }

    else{
        response.end('id(post): '+id);
    }
});

app.listen(3000, function(){
    console.log('node express app started at http://localhost:3000');
});
///////////////////////
function data_trans(response)
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
    response.end(accountstrStr);
}