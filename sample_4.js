//자바스크립트 함수 실습//
//즉시실행함수 모드('함수도 객체' 다라는 관점)//
var clerk = (function()
{
    var name = 'Seo chang wook';
    var sex = '남성';
    var position = 'App developer';
    //salary private//
    var salary = 2000;
    var taxSalary = 200;
    var totalBonus = 100;
    var taxBonus = 10;

    var payBonus = function()
    {
        totalBonus = totalBonus - taxBonus;

        return totalBonus;
    };

    var paySalary = function()
    {
        return salary - taxSalary;
    };

    //public 속성//
    //값을 반환(여러값을 리턴)//
    return{
        name : name,
        sex : sex,
        position : position,
        paySalary : paySalary,
        payBonus : payBonus
    };
}());

console.log('이름 : ' + clerk.name);
console.log('성별 : ' + clerk.sex);
console.log('직업 : ' + clerk.position);
console.log('salary : ' + clerk.paySalary()); //clerk라는 객체를 가지고 함수를 호출//
console.log('pay bonus : ' + clerk.payBonus());