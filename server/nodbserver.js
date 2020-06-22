// 데이터베이스 없는 버전
// EXPRESS 모듈만 돌리면 작동됨

const fs = require("fs");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const cookieParser = require("cookie-parser");

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

app.listen(4000, function () {
    console.log("****server on localhost:4000****")
})
