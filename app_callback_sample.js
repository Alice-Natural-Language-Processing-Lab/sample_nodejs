//함수인자로 맨 마지막 부분이 function(result) <-> callback과 대응되는 구조이다.//
//callback말고도 다른 이름으로 할 수 있지만 통상 callback으로 명명한다.//
plus = function(a,b,callback){
    var result = a + b;

    callback(result); //callback()으로 비동기 작업의 완료를 알리면서 result결과 반환//
    //위의 함수 호출구조로 보았을 경우 결국 function(result)랑 같은 의미이다.//
}

//plus는 위에서 정의한 함수를 가리킨다.//
plus(5,10, function(res){
    console.log(res);
});
/////////////////////