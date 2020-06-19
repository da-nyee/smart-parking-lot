// 데이터베이스 없는 버전
// EXPRESS 모듈만 돌리면 작동됨

const fs = require("fs")
const express = require('express');
const bodyParser = require('body-parser')
const app = express();

// post 분석을 위한 bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// 로그인
// 세션에 저장하기
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

                return res.status(200).send(result);    // send()에 end() 포함되어 있음
            }
            else {
                return res.status(401).end();
            }
        }
    })
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
    })
});

// 요금 변경
app.put('/api/sales/charge', function(req, res) {
    let result = req.body.newCharge;
    result = JSON.stringify({ charge: result });

    fs.writeFile("./config/fee.json", result, "utf-8", (err) => {
        if(!err) { return res.status(200).end(); }
        else { return res.status(500).end(); }
    })
});

// 측정 주기 변경
app.put("/api/setting/period", function(req, res) {
    let result = req.body.newPeriod;
    result = JSON.stringify({ period: result });

    fs.writeFile("./config/measure.json", result, "utf-8", (err) => {
        if(!err) { return res.status(200).end(); }
        else { return res.status(500).end(); }
    })
});

// login.json 응답 라우터
// 세션에서 불러오기
app.get("/login", function(req, res) {
    fs.readFile("./config/login.json", "utf-8", (err, data) => {
        if(err) {
            return res.status(500);
        }
        else {
            let loginData = JSON.parse(data);
            res.send(loginData);        // send()에 end() 포함되어 있음

            return res.status(200);
        }
    })
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
    })
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
    })
});

app.listen(4000, function () {
    console.log("****server on localhost:4000****")
})
