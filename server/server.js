const fs = require("fs");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const cookieParser = require("cookie-parser");
const { connect } = require("http2");

// post 분석을 위한 bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// 세션 설정
app.use(cookieParser('keyboard cat'));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'keyboard cat',
    cookie: {
        httpOnly: true,
        secure: false
    }
}));

// 로그인
// 세션 저장
app.post('/api/auth/login', function(req, res) {
    fs.readFile("./config/login.json", "utf-8", (err, data) => {
        if(err) {
            return res.status(500).end();
        }
        else {
            let login = JSON.parse(data);

            if(login.username == req.body.username && login.password == req.body.password) {
                let result = {
                    username: login.username,
                    name: login.name
                };
                result = JSON.stringify(result);

                req.session.username = login.username;
                req.session.name = login.name;

                return res.status(200).send(result);    // send()에 end() 포함되어 있음
            }
            else {
                return res.status(401).end();
            }
        }
    });
});

// 세션 확인
app.get('/api/auth/check', function(req, res) {
    if(req.session.username && req.session.name) {
        return res.status(200).end();
    }
    else {
        return res.status(401).end();
    }
});

// 로그아웃
// 세션 삭제
app.get('/api/auth/logout', function(req, res) {
    req.session.destroy();

    return res.status(204).end();           // 204: 내용 정상 처리됨, 콘텐츠 없음
});

// 비밀번호 변경
app.put('/api/auth/register', function(req, res) {
    fs.readFile("./config/login.json", "utf-8", (err, data) => {
        if(err) {
            return res.status(500).end();
        }
        else {
            let adminInfo = JSON.parse(data);

            if(adminInfo.username == req.body.username && adminInfo.password == req.body.oldPassword) {
                let newPassword = req.body.newPassword;

                let result = {
                    username: adminInfo.username,
                    password: newPassword,
                    name: adminInfo.name
                };
                result = JSON.stringify(result);

                fs.writeFile("./config/login.json", result, "utf-8", (err) => {
                    if(!err) { return res.status(200).end(); }
                    else { return res.status(500).end(); }
                });
            }
            else {
                return res.status(401).end();
            }
        }
    });
});

// 요금 변경
app.put('/api/sales/charge', function(req, res) {
    let result = req.body.newCharge;
    result = JSON.stringify({ charge: result });

    fs.writeFile("./config/fee.json", result, "utf-8", (err) => {
        if(!err) { return res.status(200).end(); }
        else { return res.status(500).end(); }
    });
});

// 측정 주기 변경
app.put("/api/setting/period", function(req, res) {
    let result = req.body.newPeriod;
    result = JSON.stringify({ period: result });

    fs.writeFile("./config/measure.json", result, "utf-8", (err) => {
        if(!err) { return res.status(200).end(); }
        else { return res.status(500).end(); }
    });
});

// fee.json 응답 라우터
app.get("/api/sales/charge", function(req, res) {
    fs.readFile("./config/fee.json", "utf-8", (err, data) => {
        if(err) {
            return res.status(500).end();
        }
        else {
            let temp = JSON.parse(data);
            let feeData = {
                oldCharge: temp.charge,
                newCharge: ""
            };

            return res.status(200).json(feeData);
        }
    });
});

// measure.json 응답 라우터
app.get("/measure", function(req, res) {
    fs.readFile("./config/measure.json", "utf-8", (err, data) => {
        if(err) {
            return res.status(500).end();
        }
        else {
            let temp = JSON.parse(data);
            let measureData = {
                oldPeriod: temp.period,
                newPeriod: ""
            };

            return res.status(200).json(measureData);
        }
    });
});

// 모듈 상태 조회
app.get("/api/control/status", function(req, res) {
    fs.readFile("./config/control.json", "utf-8", (err, data) => {
        if(err) {
            return res.status(500).end();
        }
        else {
            let controlData = JSON.parse(data);

            return res.status(200).json(controlData);
        }
    });
});

// 모듈 상태 변경
app.put("/api/control/status", function(req, res) {
    fs.readFile("./config/control.json", "utf-8", (err, data) => {
        if(err) {
            return res.status(500).end();
        }
        else {
            let temp = JSON.parse(data);
            temp = temp["control"];
            
            let name = req.body.name;
            let status = req.body.status;

            for(let i = 0; i < temp.length; i++) {
                if(temp[i]["name"] == name) {
                    temp[i]["status"] = status;
                }
            }

            let controlData = {};
            controlData["control"] = temp;
            controlData = JSON.stringify(controlData);

            fs.writeFile("./config/control.json", controlData, "utf-8", (err) => {
                if(err) {
                    return res.status(500).end();
                }
                else {
                    return res.status(200).end();
                }
            });
        }
    });
});

// 모듈 초기화
app.get("/api/control/init", function(req, res) {
    
    // control.json >>> tempControl.json 복사
    fs.readFile("./config/control.json", "utf-8", (err, data) => {
        if(err) { return res.status(500).end(); }
        else {
            let temp = JSON.parse(data);
            let statusTemp = temp["control"];

            temp = JSON.stringify(temp);

            fs.writeFile("./config/tempControl.json", temp ,"utf-8", (err) => {
                if(err) { return res.status(500).end(); }
            });

            // control.json의 모든 status 값 false로 변경
            for(let i = 0; i < statusTemp.length; i++) {
                statusTemp[i]["status"] = false;
            }

            statusNew = {};
            statusNew["control"] = statusTemp;
            statusNew = JSON.stringify(statusNew);

            fs.writeFile("./config/control.json", statusNew, "utf-8", (err) => {
                if(err) { return res.status(500).end(); }
            });

            // 3초 대기
            // tempControl.json >>> control.json 붙여넣기
            setTimeout(function() {
                fs.readFile("./config/tempControl.json", "utf-8", (err, data) => {
                    if(err) { return res.status(500).end(); }
                    else {
                        let original = JSON.parse(data);
                        original = JSON.stringify(original);

                        fs.writeFile("./config/control.json", original, "utf-8", (err) => {
                            if(err) { return res.status(500).end(); }
                            else {
                                // 원상복구 응답
                                fs.readFile("./config/control.json", "utf-8", (err, data) => {
                                    if(err) { return res.status(500).end(); }
                                    else {
                                        let controlData = JSON.parse(data);
                                        controlData = controlData["control"];

                                        return res.status(200).json(controlData);
                                    }
                                });
                            }
                        });
                    }
                });
            }, 3000);
        }
    });
});

// synchronous DB
const mysql = require('sync-mysql');

const connection = new mysql({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'gachon654321',
    database: 'parkdb'
}); 

// 그래프 출력
// 매출
app.get("/api/graph/sales", function(req, res) {

    // 객체로 날아옴
    let fromDate = req.query.from;
    let toDate = req.query.to;

    // Date 객체로 변경
    // Date 객체를 String 객체로 파싱
    fromDate = new Date(fromDate).toYMD();
    toDate = new Date(toDate).toYMD();

    let salesData = connection.query(
        "SELECT DATE_FORMAT(end_time, '%y-%m-%d') as date, sum(pay) as sales FROM parklog where end_time BETWEEN '" + fromDate + "' AND '" + toDate + "' GROUP BY date;"
    );

    for(let i = 0; i < salesData; i++) {
        salesData[i].sales /= 1000;     // 천단위
    }

    return res.status(200).send(salesData);
});

// 사용률
app.get("/api/graph/usage", function(req, res) {
    let usageList = [];                 // 주차 자리 9개 차있다고 가정
    for(let i = 0; i < 24; i++) {
        usageList[i] = 9;
    }
    let parkSpace = 12;                 // 주차 자리 12개

    let reqDate = req.query.date;
    reqDate = new Date(reqDate).toYMD().substring(0, 11);

    let logData = connection.query(
        "SELECT DATE_FORMAT(start_time, '%H') as startTime, DATE_FORMAT(end_time, '%H') as endTime from parklog WHERE DATE_FORMAT(end_time, '%Y-%m-%d') = '" + reqDate + "';"  
    );

    for(let i = 0; i < logData.length; i++) {
        let start = parseInt(logData[i].startTime);
        let end = parseInt(logData[i].endTime);
        let idx = end - start;
        
        for(let j = start; j < start + idx; j++) {
            usageList[j] += 1;
        }
    }

    let usageData = [];
    for(let i = 0; i < usageList.length; i++) {
        let usageDict = {};

        usageList[i] = (usageList[i] / parkSpace) * 100;        // 비율 계산
        
        let timeIdx = String(i);
        if(timeIdx.length == 1) {
            timeIdx = "0" + timeIdx;
        }

        usageDict["date"] = timeIdx;
        usageDict["usage"] = usageList[i];

        usageData.push(usageDict);
    }

    return res.status(200).send(usageData);
});

// 주차 상황판
app.get("/api/board/parking", function(req, res) {
    let parkingList = connection.query(
        "SELECT n.position, n.car_num, c.start_time FROM parkcar as c RIGHT OUTER JOIN parknow as n ON c.car_num = n.car_num;"
    );

    // 시간당 요금 추출
    let chargeFee = fs.readFileSync('./config/fee.json', 'utf8');
    chargeFee = JSON.parse(chargeFee);

    let parkingData = [];
    for(let i = 0; i < parkingList.length; i++) {
        let parkingDict = {};

        if(parkingList[i].car_num == null) {
            parkingData.push(false);
        }
        else {
            parkingDict["number"] = parkingList[i].car_num;
            parkingDict["start"] = parkingList[i].start_time;

            // 요금 계산
            let startTime = new Date(parkingDict["start"]);
            let nowTime = new Date();
            let parkingFee = chargeFee.charge * (parseInt((nowTime.getTime() - startTime.getTime()) / 3600000) + 1);

            parkingDict["fee"] = parkingFee;

            parkingData.push(parkingDict);
        }
    }

    parkingData = JSON.stringify(parkingData);

    return res.status(200).send(parkingData);
});

// 서버 실행
app.listen(4000, function () {
    console.log("****server on localhost:4000****")
});

// Date 객체를 String 객체로 파싱
(function() {
    Date.prototype.toYMD = Date_toYMD;

    function Date_toYMD() {
        let year, month, day;

        year = String(this.getFullYear());

        month = String(this.getMonth() + 1);
        if(month.length == 1) {
            month = "0"+month;
        }

        day = String(this.getDate() - 1);
        if(day.length == 1) {
            day = "0" + day;
        }

        return year + "-" + month + "-" + day + " " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
    }
})();
