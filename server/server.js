// synchronous DB
const mysql = require('sync-mysql');

const connection = new mysql({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'gachon654321',
    database: 'parkdb'
}); 

const fs = require("fs")
const express = require('express');
const bodyParser = require('body-parser')
const app = express();

// post 분석을 위한 bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// crocs 프로그램의 get을 허락함
app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// 현재 주차된 차량의 위치와 주차 시간을 반환
app.get('/park/nowState', function(req, res){
    let result = connection.query('select parknow.position, parkcar.start_time from parkcar, parknow where parkcar.car_num = parknow.car_num;');
    let data ={}
    data.park_state = result;
    data.result_code=200;
    res.send(data);
});

// 주차위치, 주차시간 정보
app.get('/park/dateState', function(req, res){
    let result = connection.query('select position, start_time, end_time from parklog;');
    let data ={}
    data.sales = result;
    data.result_code=200;
    res.send(data);
});

// 일간 수익 N일에 N원, M일에 M원... ...
app.get('/park/sales', function(req, res){
    let result = connection.query('select DATE_FORMAT(end_time, "%Y-%m-%d 00:00:00") day, sum(pay) as money from parklog group by day;');
    let data = {}
    data.sales = result;    data.result_code=200;
    res.send(data);
});

// 현재 모듈 동작 상태
app.get('/park/moduleState', function (req, res) {
    let module_state = fs.readFileSync("./config/module.json");
    let data = JSON.parse(module_state);
    data.result_code = 200;
    res.send(data);
});

// 응급상황
app.get('/park/emergency', function (req, res) {
    // 응급 상황 버저 울리는? 그런 요청
    // emergencyOn()
    let data = {}
    data.result_code = 200;
    res.send(data);
});

// 주차장 리셋 요청?
app.get('/park/reset', function (req, res) {
    // 주차장 초기화하는 요청
    // resetSystem()
    let data = {}
    data.result_code = 200;
    res.send(data);
});

// 현재 주차장 요금 설정 조회
app.get('/park/payment', function (req, res) {
    let rule = fs.readFileSync("./config/rule.json");
    let data = {}
    data.rule = JSON.parse(rule);
    data.result_code = 200;
    res.send(data);
});


// 현재 모듈 상태 조회?? 사실 왜 있는지 모르겠음...
app.get('/park/parkInit', function (req, res) {
    let module = fs.readFileSync("./config/module.json");
    let data = JSON.parse(module);
    data.result_code = 200;
    res.send(data);
});

// 측정주기 조회
app.get('/park/timer', function (req, res) {
    let timer = fs.readFileSync("./config/timer.json");
    let data = JSON.parse(timer);
    data.result_code = 200;
    res.send(data);
});

// 주차장 요금 설정 변경
app.post('/park/payment', function (req, res) {
    let rule = fs.readFileSync("./config/rule.json");
    rule.rule = req.body.rule;
    rule = JSON.stringify(rule);
    fs.writeFile("./config/rule.json", rule, "utf-8", function (err) {
        if (err == null) {
            let data = {}
            data.result_code = 200;
            res.send(data);
        } else {
            let data = {}
            data.result_code = 000;
            res.send(data);
        }
    })
});

// 주차장 모듈 설정 변경
app.post('/park/parkInit', function (req, res) {
    let module_state = req.body.module_state;
    module_state = JSON.stringify(module_state);
    fs.writeFile("./config/module.json", module_state, "utf-8", function (err) {
        if (err == null) {
            let data = {}
            data.result_code = 200;
            res.send(data);
        } else {
            let data = {}
            data.result_code = 000;
            res.send(data);
        }
    })
});

// 주차장 측정 주기 변경
app.post('/park/timer', function (req, res) {
    let timer = req.body.timer;
    timer = JSON.stringify(timer);
    fs.writeFile("./config/timer.json", timer, "utf-8", function (err) {
        if (err == null) {
            let data = {}
            data.result_code = 200;
            res.send(data);
        } else {
            let data = {}
            data.result_code = 000;
            res.send(data);
        }
    })
});

app.listen(65011, function () {
    console.log("****server on localhost:65011****")
})
