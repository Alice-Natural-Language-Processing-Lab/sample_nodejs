var express = require('express'); //express는 기본적으로 쿠키의 기능을 가지고 있지 않다.//
var graph = require('fbgraph'); //페이스북의 그래프 api정보를 호출//
var bodyParser = require('body-parser'); //POST방식//

var app = express();

//POST설정//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     //to support URL-encoded bodies (url-encoded방식)//
    extended: true
}));

//입력변수//
var accessToken;

app.post('/auth/facebook/login', function(request, response){
    accessToken = request.body.accessToken; //전송할 메세지를 받는다.//

    console.log('token: ' + accessToken);

    //사용자의 다양한 프로필 정보를 얻어온다. (Graph API)//
    function_graphapi(accessToken, response)
});

function function_graphapi(accessToken, response)
{
    //페이스북 프로필 이미지 : http://graph.facebook.com/100006497919491/picture?type=normal//
    graph.setAccessToken(accessToken); //액세스 토큰값 설정//
    graph.setVersion("2.4"); //호출버전//

    graph.get("me?fields=id, name, email, gender", function(err, res) {
        console.log(res);

        var id = res.id;
        var name = res.name;
        var email = res.email;
        var gender = res.gender;
        var profile_imageurl = 'http://graph.facebook.com/'+id+'/picture?type=normal';

        console.log(id + "/" + name + "/" + email + "/" + gender + "/" + profile_imageurl);

        response.send(res);
    });
}

app.listen(3000, function(){
    console.log('Connected 3000 port')
});