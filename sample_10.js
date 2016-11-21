var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser'); //POST방식//

var app = express();

//입력변수//
var name;
var id;
var password;
var type_str;

//POST설정//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.post('/db_sample', function(request, response){
    type_str = request.body.message; //전송할 메세지를 받는다.//

    if(type_str == 'select')
    {
        //데이터베이스 연결객체와 응답객체를 보냄//
        SELECT_func(response);
    }

    else if(type_str == 'insert')
    {
        //입력값을 받는다.//
        name = request.body.name;
        id = request.body.id;
        password = request.body.password;

        INSERT_func(response, name, id, password);
    }

    else if(type_str == 'update')
    {
        //수정할려는 값을 받는다.//
        name = request.body.name;
        id = request.body.id;
        password = request.body.password;

        UPDATE_func(response, name, id, password);
    }

    else if(type_str == 'delete')
    {
        //제거할려는 데이터를 받는다.//
        name = request.body.name;

        DELETE_func(response, name);
    }
    
    else{
        response.send('input command SQL (select, insert, update, delete)');
    }
});

app.listen(3000, function(){
    console.log('db test server');
});
/////////////////////////////
function SELECT_func(response)
{
    var connection = db_connection_pool(); //DB Connection pool//

    connection.query('select * from sample', function(error, rows, fields){
        if(error) throw error;
        else{
            for(var i=0; i<rows.length; i++)
            {
                console.log('name: '+rows[i].name);
            }

            response.send(rows);
        }
    });

    connection.end(); //데이터베이스 작업을 한 이후 반드시 닫아준다.//
}
//////////////////////////////
function INSERT_func(response, name, id, password)
{
    console.log('insert ['+name+','+id+','+password+']');

    var connection = db_connection_pool(); //DB Connection pool//

    var insert_data_array = [name, id, password]; //배열로 만든다.//

    connection.query('insert into sample(name,id,pwd) values(?,?,?)',insert_data_array, function(error, result){
        if(error) throw error;
        else{
            response.send(result);

            console.log('insert success...');
        }
    });

    connection.end(); //데이터베이스 작업을 한 이후 반드시 닫아준다.//
}
/////////////////////////////
function UPDATE_func(response, name, id, password)
{
    console.log('update ['+name+','+id+','+password+']');

    var connection = db_connection_pool(); //DB Connection pool//

    var update_data_array = [id, password, name]; //배열로 만든다.//

    connection.query('update sample set id=?, pwd=? where name=?',update_data_array, function(error, result){
        if(error) throw error;
        else{
            response.send(result);

            console.log('update success...');
        }
    });

    connection.end(); //데이터베이스 작업을 한 이후 반드시 닫아준다.//
}
/////////////////////////////
function DELETE_func(response, name)
{
    console.log('delete ['+name+']');

    var connection = db_connection_pool(); //DB Connection pool//

    var delete_data = [name]; //배열로 만든다.//

    connection.query('delete from sample where name=?',delete_data, function(error, result){
        if(error) throw error;
        else{
            response.send(result);

            console.log('delete success...');
        }
    });

    connection.end(); //데이터베이스 작업을 한 이후 반드시 닫아준다.//
}
/////////////////////////////
function db_connection_pool()
{
    //데이터베이스 정보 설정//
    var connection = mysql.createConnection({
        host : 'localhost', //db ip address//
        port : 3306, //db port number//
        user : 'root', //db id//
        password : '3315', //db password//
        database : 'blogtest' //db schema name//
    });

    //mysql connection//
    connection.connect(function(err){
        if(err){
            console.error('mysql connection error');
            console.error(err);
        }

        else{
            console.log('connection success...');
        }
    });

    return connection;
}