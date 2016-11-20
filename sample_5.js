console.log('Sync mode');

var fs = require('fs'); //파일시스템 모듈 설정//
var data = fs.readFileSync('test.txt', {encoding:'utf8'}); //동기화 모드//

console.log(data);

console.log('ASync mode');

//비동기는 Callback이 있다.//
var data = fs.readFile('test.txt', {encoding:'utf8'}, function(err, data){
    if(err) throw err;

    console.log(data);
})
