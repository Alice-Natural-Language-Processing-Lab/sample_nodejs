var express = require('express'); //express는 기본적으로 쿠키의 기능을 가지고 있지 않다.//
var bodyParser = require('body-parser'); //POST방식//

//암호화 모듈//
var crypto = require('crypto');

var app = express();

//POST설정//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     //to support URL-encoded bodies (url-encoded방식)//
    extended: true
}));

// ******<Cipher 암호화 관련 변수>****** //
var crypto_algorithm = 'aes-128-ecb'; //안드로이드와 호환을 위해서 aes-128-ecb로 설정//
var crypto_key = 'CIPHER_KEY'; //해당 키값은 서버와 클라이언트 모두 동일해야 한다.(외부로 노출되면 안된다.)//
//서버, 클라이언트 각각 로컬에 저장. 키 값을 서로 전송하진 않는다.(외부통신 보안에 취약)//
//input - output은 서버와 클라이언트 상호 대치적이다.//
var crypto_inputtype = 'utf8';
var crypto_outputtype = 'hex';
// ********************************* //

//암호화 모듈 서비스//
var cipher = crypto.getCiphers(); //Cipher방식의 암호화 알고리즘의 정보를 출력//
/*Cipher기법은 일반적인 암호화 방식으로 평문 -> 암호문 -> 복호문(평문)의 방식으로 암/복호화를 합니다.//
즉 암호화를 하기 위한 key를 가지고 평문을 암호화하고, 그것을 사용할 때에는 다시 Key를 통해 복호화하여 사용*/

//입력변수//
var cipherd; //aes로 암호화 된 암호문//
var hash_encrypt_data; //해시가 적용된 암호문//

//적용 가능 알고리즘 목록//
var algorithm_list = [{'name':'aes128'}, {'name':'sha512'}];

app.post('/cipher_test', function(request, response){
    cipherd = request.body.input_password; //기존 약속된 암호화 방식으로 암호화된 데이터가 입력//

    Decrypt_str(cipherd, response); //
});

app.post('/hash_trans', function(request, response){
    hash_encrypt_data = request.body.input_str; //해시가 적용되어야 할 일반 평문 데이터//

    save_hash(hash_encrypt_data, response);
});

app.get('/algorithm_list', function(request, response){
    get_data(response);
});

app.listen(3000, function(){
    console.log('Connected 3000 port')
    console.log('--------------------------');
});
////////////////////////
function Decrypt_str(cipherd, response){
    var decipher = crypto.createDecipher(crypto_algorithm, crypto_key);
    decipher.update(cipherd, crypto_outputtype, crypto_inputtype);
    var decipherd = decipher.final(crypto_inputtype);

    console.log('Decrypt str : ' + decipherd);

    //서버 작업 시 복호화된 값을 사용, 복호화된 값을 다시 해시 알고리즘을 이용하여 데이터베이스에 저장가능.//

    //전송할땐 다시 암호화를 해서 전송한다.(보안)//
    var cipher = crypto.createCipher(crypto_algorithm, crypto_key);
    cipher.update(decipherd, crypto_inputtype, crypto_outputtype);
    var cipherd = cipher.final(crypto_outputtype);

    console.log('Encrypt str : ' + cipherd);

    console.log('--------------------------');

    //전송할 JSON포맷을 만든다.//
    var result = 
    {
        'encrypt':cipherd
    }

    var trans_objeect = 
    {
        'is_success':'ok',
        'data':result
    }

    var trans_json = JSON.stringify(trans_objeect); //json으로 반환//

    response.send(trans_json);
}
//////////////////////////
function save_hash(hash_encrypt_data, response){
    console.log('Encrypt hash str : ' + hash_encrypt_data);

    /*눈사태 효과 : 원문(Plaintext)의 한 비트의 변화가 최종 암호문(Ciphertext)에 큰 변화를 주는 효과.모든 암호에서 핵심적으로
    요구되는 암호학적 특징. 특히 블록암호나 단방향 해시 함수에서 주로 요구한다. 조금만 바뀌어도 유사성을 찾을 수 없게 함. 암호를 만들
    때 모든 경우의 수를 다 계산해보지 않는 이상 결과를 알 수 있다는 보장을 할 수 없게 해야 하며 이를 위해 눈사태 효과 개념을 도입.
    대표적인 알고리즘들로는 AES, SHA-1, SHA-2, MD5가 있다. 사용자가 중요 정보의 값을 해시로 전달해서 저장하게 되므로 개발자도 값
    을 알 수 가 없게 된다. 또한 추후 해당 값을 데이터베이스로부터 다시 전송하여 비교함으로서 무결성검사도 할 수 있게 된다.*/

    //암호화된 값을 활용//
    console.log('--------------------------');

    //전송할 JSON포맷을 만든다.//
    var result = 
    {
        'encrypt':hash_encrypt_data
    }

    var trans_objeect = 
    {
        'is_success':'ok',
        'data':result
    }

    var trans_json = JSON.stringify(trans_objeect); //json으로 반환//

    response.send(trans_json);
}
/////////////////////////////
function get_data(response){
    //전송할 JSON포맷을 만든다.//
    var trans_objeect = 
    {
        'algorithms':algorithm_list
    }

    var trans_json = JSON.stringify(trans_objeect); //json으로 반환//

    response.send(trans_json);

    console.log('get data list');

    //암호화된 값을 활용//

    console.log('--------------------------');
}