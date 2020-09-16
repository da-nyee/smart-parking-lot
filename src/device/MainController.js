const request = require('request');
const gpio = require('node-wiring-pi');
const mysql = require('mysql');
const mcpadc = require('mcp-spi-adc');
const ws281x = require('@bartando/rpi-ws281x-neopixel');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const readline = require('readline');

const test = require('./modules/test.js');
const logger = require("./log.js");

const SPI_SPEED = 1000000;
const NUM_LEDS = 12;

const park2Red = 4;
const park2Blue = 5;
const park0Red = 27;
const park0Blue = 28;
const park1Red = 6;
const park1Blue = 26;

const accelTrig1 = 0;
const accelEcho1 = 2;
const accelTrig2 = 3;
const accelEcho2 = 21;
const accelTrig3 = 22;
const accelEcho3 = 23;

const accelTrig = 24;
const accelEcho = 25;

const BUZZER = 7;

const RAZER = 29;

const CS_MCP3208_0 = 10;
const CS_MCP3208_1 = 11;

// 주차 차량 감지 (총 3개)
const CAR_PARKING_0 = 0;
const CAR_PARKING_1 = 1;
const CAR_PARKING_2 = 2;

const ELEV_UP = 3;
const ELEV_DOWN = 4;

// 두 자리 주차 차량 감지 (총 2개)
const DOUBLE_PARKING_5 = 5;
const DOUBLE_PARKING_6 = 6;

const PARK_IN = 7;
const PARK_OUT = 0;

let car_lightdata_0 = -1;
let car_lightdata_1 = -1;
let car_lightdata_2 = -1;

let double_lightdata_5 = -1;
let double_lightdata_6 = -1;

var elev_up_lightdata = -1;
var elev_down_lightdata = -1;

var nowInCar = 0;

ws281x.init({ count:NUM_LEDS, stripType: ws281x.WS2811_STRIP_GRB });
ws281x.setBrightness(5);

const LEDon = (color, max) => {
    for(let i = max; i < NUM_LEDS; i++) {
        ws281x.setPixelColor(i, {r:0, g:0, b:0});
        ws281x.show();
    }

    for(let i = 0; i < max; i++) {
        ws281x.setPixelColor(i, color);
        ws281x.show();
    }
}

// asynchronous DB
let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'gachon654321',
    database: 'parkdb'
});

// synchronous DB
var sql = new sync_mysql({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'gachon654321',
    database: 'parkdb'
});

var startTime, startTime1, startTime2, startTime3;
var travelTime, travelTime1, travelTime2, travelTime3;

var accelCount = 0;
var accelCount1 = 0;
var accelCount2 = 0;
var accelCount3 = 0;

var beforeDistance = 0, beforeDistance1 = 0, beforeDistance2 = 0, beforeDistance3 = 0;

var warningBuzzer = 0;

var timeout = 500;
var count = 0;

var url = 'http://192.168.1.103:65001';

// initialization (functions)
const elev_up = mcpadc.openMcp3208(ELEV_UP, {speedHz: SPI_SPEED}, (err) => {
    console.log('elev_up init...');
    if(err)
        console.log('fail!');
});
const elev_down = mcpadc.openMcp3208(ELEV_DOWN, {speedHz: SPI_SPEED}, (err) => {
    console.log('elev_down init...');
    if(err)
        console.log('fail!');
});

const car_parking_0 = mcpadc.openMcp3208(CAR_PARKING_0, {speedHz: SPI_SPEED}, (err) => {
    console.log('car_parking_0 init...');
    if(err) { console.log('car_parking_0 fail!'); }
});
const car_parking_1 = mcpadc.openMcp3208(CAR_PARKING_1, {speedHz: SPI_SPEED}, (err) => {
    console.log('car_parking_1 init...');
    if(err) { console.log('car_parking_1 fail!'); }
});
const car_parking_2 = mcpadc.openMcp3208(CAR_PARKING_2, {speedHz: SPI_SPEED}, (err) => {
    console.log('car_parking_2 init...');
    if(err) { console.log('car_parking_2 fail!'); }
});

const double_parking_5 = mcpadc.openMcp3208(DOUBLE_PARKING_5, {speedHz: SPI_SPEED}, (err) => {
    console.log('double_parking_5 init...');
    if(err) { console.log('double_parking_5 fail!'); }
});
const double_parking_6 = mcpadc.openMcp3208(DOUBLE_PARKING_6, {speedHz: SPI_SPEED}, (err) => {
    console.log('double_parking_6 init...');
    if(err) { console.log('double_parking_6 fail!'); }
});

const park_in = mcpadc.openMcp3208(PARK_IN, {speedHz: SPI_SPEED}, (err) => {
    console.log('park in init...');
    if(err) { console.log('park in fail!'); }
});

const park_out = mcpadc.openMcp3208(PARK_OUT, {speedHz: SPI_SPEED, deviceNumber: 1}, (err) => {
    console.log('park out init...');
    if(err) { console.log('park out fail!'); }
});

// Main Controller
const mainController = () => {
    var result = fs.readFileSync('./config/control.json', 'utf8');
    result = JSON.parse(result);
    data = result['control'];

    if(data[0].status == true) {
        //accel();
        //accel1();
        accel2();
        //accel3();
    }

    if(data[1].status == true) {
        elev();
    }

    // 주차 차량 감지
    if(data[2].status == true) {
        carParking();
    }

    // 두 자리 주차 차량 감지
    if(data[3].status == true) {
        gpio.digitalWrite(RAZER, 1);

        carDoubleParking();

        gpio.digitalWrite(RAZER, 1);
    }

    if(data[4].status == true) {
        maxCar();
    }

    if(data[5].status == true) {
        park_in_out();
    }

    if(warningBuzzer == 1) {
        warningBuzzer = 0;

        gpio.digitalWrite(BUZZER, 1);

        setTimeout(turnOffBuzzer, 1000);
    }

    let result10 = fs.readFileSync('./config/measure.json', 'utf8');
    result10 = JSON.parse(result10);

    setTimeout(mainController, result10.period);
}

const accel = () => {
    gpio.digitalWrite(accelTrig, gpio.LOW);
    gpio.delayMicroseconds(2);
    gpio.digitalWrite(accelTrig, gpio.HIGH);
    gpio.delayMicroseconds(20);
    gpio.digitalWrite(accelTrig, gpio.LOW);

    while(gpio.digitalRead(accelEcho) == gpio.LOW);
    startTime = gpio.micros();

    while(gpio.digitalRead(accelEcho) == gpio.HIGH);
    travelTime = gpio.micros() - startTime;

    distance = travelTime / 58;

    if(beforeDistance < distance) {
        accelCount++;
    }
    else {
        accelCount = 0;
    }

    if(accelCount > 5) {
        accelCount = 0;
        warningBuzzer = 1;
    }

    beforeDistance = distance;
    console.log("0 : " + distance);
}

const accel1 = () => {
    gpio.digitalWrite(accelTrig1, gpio.LOW);
    gpio.delayMicroseconds(2);
    gpio.digitalWrite(accelTrig1, gpio.HIGH);
    gpio.delayMicroseconds(20);
    gpio.digitalWrite(accelTrig1, gpio.LOW);

    while(gpio.digitalRead(accelEcho1) == gpio.LOW);
    startTime1 = gpio.micros();

    while(gpio.digitalRead(accelEcho1) == gpio.HIGH);
    travelTime1 = gpio.micros() - startTime1;

    distance = travelTime1 / 58;

    if(beforeDistance1 < distance) {
        accelCount1++;
    }
    else {
        accelCount1 = 0;
    }

    if(accelCount1 > 5) {
        accelCount1 = 0;
        warningBuzzer = 1;
    }

    beforeDistance1 = distance;
    console.log("1 : " + distance);
}

const accel2 = () => {
    gpio.digitalWrite(accelTrig2, gpio.LOW);
    gpio.delayMicroseconds(2);
    gpio.digitalWrite(accelTrig2, gpio.HIGH);
    gpio.delayMicroseconds(20);
    gpio.digitalWrite(accelTrig2, gpio.LOW);

    while(gpio.digitalRead(accelEcho2) == gpio.LOW);
    startTime2 = gpio.micros();

    while(gpio.digitalRead(accelEcho2) == gpio.HIGH);
    travelTime2 = gpio.micros() - startTime2;

    distance = travelTime2 / 58;

    if(beforeDistance2 > distance) {
        accelCount2++;
    }
    else {
        accelCount2 = 0;
    }

    if(accelCount2 > 3) {
        accelCount2 = 0;
   logger.log("error", "404 : 일방통행 역주행");
        warningBuzzer = 1;
    }

    beforeDistance2 = distance;
}

const accel3 = () => {
    gpio.digitalWrite(accelTrig3, gpio.LOW);
    gpio.delayMicroseconds(2);
    gpio.digitalWrite(accelTrig3, gpio.HIGH);
    gpio.delayMicroseconds(20);
    gpio.digitalWrite(accelTrig3, gpio.LOW);

    while(gpio.digitalRead(accelEcho3) == gpio.LOW);
    startTime3 = gpio.micros();

    while(gpio.digitalRead(accelEcho3) == gpio.HIGH);
    travelTime3 = gpio.micros() - startTime3;

    distance = travelTime3 / 58;

    if(beforeDistance3 < distance) {
        accelCount3++;
    }
    else {
        accelCount3 = 0;
    }

    if(accelCount3 > 5) {
        accelCount3 = 0;
        warningBuzzer = 1;
    }

    beforeDistance3 = distance;
    console.log("3 : "+ distance);
}

const turnOffBuzzer = () => {
    gpio.digitalWrite(BUZZER, 0);
}

var elevCount = 0;
const elev = () => {
    if(elevCount == 0) {
        elev_up.read((err, reading) => {
            elev_up_lightdata = reading.rawValue;
        });
        elev_down.read((err, reading) => {
            elev_down_lightdata = reading.rawValue;
        });
    
        if(elev_up_lightdata > 2200) {
            elevCount = 1;
            logger.log("info", "203 : 엘리베이터 작동 elevup ");

            request.get(
                {
                    url:url + '/elevup',
                    headers: {'content-type':'application/json'}
                },
                function(err, res, body) {
                    let data = JSON.parse(body);

                    if(!err && res.statusCode == 200) {
                        console.log('send!');
                    }
                }
            );
            
            setTimeout(elevCountChange, 5000);
        }
        else if(elev_down_lightdata > 2200) {
            elevCount = 1;
            logger.log("info", "203 : 엘리베이터 작동 elevdown");

            request.get(
                {
                    url:url + '/elevdown',
                    headers: {'content-type':'application/json'}
                },
                function(err, res, body) {
                    let data = JSON.parse(body);

                    if(!err && res.statusCode == 200) {
                        console.log('send!');
                    }
                }
            );

            setTimeout(elevCountChange, 5000);
        }
    }
}

const elevCountChange = () => {
    elevCount = 0;
}

// Date 객체를 String 객체로 파싱
(function() {
    Date.prototype.toYMD = Date_toYMD;

    function Date_toYMD() {
        let year, month, day;

        year = String(this.getFullYear());

        month = String(this.getMonth() + 1);
        if(month.length == 1) {
            month = "0" + month;
        }

        day = String(this.getDate());
        if(day.length == 1) {
            day = "0" + day;
        }

        return year + "-" + month + "-" + day + " " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
    }
})();

(function() {
    Date.prototype.toYMDAPI = Date_toYMDAPI;

    function Date_toYMDAPI() {
        let year, month, day;

        year = String(this.getFullYear());

        month = String(this.getMonth() + 1);
        if(month.length == 1) {
            month = "0" + month;
        }

        day = String(this.getDate() - 1);               // day - 1
        if(day.length == 1) {
            day = "0" + day;
        }

        return year + "-" + month + "-" + day + " " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
    }
})();

// 주차 차량 감지
let n = 3000;                           // 현재 3초
let parking_time_0 = 0;
let parking_time_1 = 0;
let parking_time_2 = 0;

const carParking = () => {
    // 주차 자리 0번
    let myCheck = sql.query('SELECT * FROM parknow WHERE position = 0');
    let myCheckNum = null;
    myCheck.forEach((data, index) => {
        myCheckNum = data.car_num;
    });

    car_parking_0.read((error, reading) => {
        car_lightdata_0 = reading.rawValue;
    });

    if(car_lightdata_0 != -1) {
        if(car_lightdata_0 > 2200) {            // 0번에 차량이 주차된 경우
            if(myCheckNum == null) {            // DB에 차량이 없는 경우, 쿼리 한 번만 날리기 위함
                parking_time_0 += timeout;
                console.log("parking_time_0: %d", parking_time_0);

                let position = 0;
                let car_num = null;

                if(parking_time_0 >= n) {
                    car_num = nowInCar;
    
                    connection.query('UPDATE parknow SET car_num=? WHERE position=?', [car_num, position], (err) => {
                        if(err) {
                            console.log("DB: 주차 0번 parknow 테이블 수정 실패!");
                            console.log(err);
                            logger.log("error", "400 : 주차 0번 parknow 테이블 수정 실패");
                        }
                        else {
                            console.log("DB: 주차 0번 parknow 테이블 수정 성공!");
                            logger.log("info", "200 : 주차 0번 parknow 테이블 수정 성공");

                            // web socket
                            io.emit('parking-data');
                        }
                    });
                    
                    parking_time_0 = 0;
                }
            }
            gpio.digitalWrite(park0Blue, 0);
            gpio.digitalWrite(park0Red, 1);
        }
        else {
            let noPark0 = null;
            let noParkTime0 = null;

            parking_time_0 = 0;

            gpio.digitalWrite(park0Blue, 1);
            gpio.digitalWrite(park0Red, 0);

            let result = sql.query('SELECT * FROM parknow WHERE position = 0;'); 
            result.forEach((data, index) => {
                noPark0 = data.car_num;
            });

            if(noPark0 != null) {
                car_num = null;

                let result = sql.query('SELECT * FROM parkcar WHERE car_num = "' + noPark0 + '";');
                result.forEach((data, index) => {
                    noParkTime0 = data.start_time;
                });

                noParkTime0 = new Date(noParkTime0);
                let nowTime = new Date();

                let feeData = fs.readFileSync('./config/fee.json', 'utf8');
                feeData = JSON.parse(feeData);

                // 요금 계산
                let charge = feeData.charge * (parseInt((nowTime.getTime() - noParkTime0.getTime()) / 3600000) + 1);
            
                let insertLog = sql.query('INSERT INTO parklog VALUES(0, "' + noPark0 + '", "' + noParkTime0.toYMD() + '", "' + nowTime.toYMD() + '", ' + charge + ');');

                connection.query('UPDATE parknow SET car_num=? WHERE position=?', [car_num, 0], (err) => {
                    if(err) {
                        console.log("DB: 주차 0번 parknow 테이블 수정 실패!");
                        console.log(err);
                        logger.log("error", "400 : 주차 0번 parknow 테이블 수정 실패");
                    }
                    else {
                        console.log("DB: 주차 0번 parknow 테이블 수정 성공!");
                        logger.log("info", "200 : 주차 0번 parknow 테이블 수정 성공");

                        // web socket
                        io.emit('parking-data');
                    }
                });
            }
        }

        car_lightdata_0 = -1;
    }
    
    // 주차 자리 1번
    let myCheck1 = sql.query('SELECT * FROM parknow WHERE position = 1');
    let myCheckNum1 = null;
    myCheck1.forEach((data, index) => {
        myCheckNum1 = data.car_num;
    });

    car_parking_1.read((error, reading) => {
        car_lightdata_1 = reading.rawValue;
    });

    if(car_lightdata_1 != -1) {
        if(car_lightdata_1 > 2200) {            // 1번에 차량이 주차된 경우
            if(myCheckNum1 == null) {
                parking_time_1 += timeout;
                console.log("parking_time_1: %d", parking_time_1);

                let position = 1;
                let car_num = null;

                if(parking_time_1 >= n) {
                    car_num = nowInCar;
    
                    connection.query('UPDATE parknow SET car_num=? WHERE position=?', [car_num, position], (err) => {
                        if(err) {
                            console.log("DB: 주차 1번 parknow 테이블 저장 실패!");
                            console.log(err);
                            logger.log("error", "400 : 주차 1번 parknow 테이블 수정 실패");
                        }
                        else {
                            console.log("DB: 주차 1번 parknow 테이블 저장 성공!");
                            logger.log("info", "200 : 주차 1번 parknow 테이블 수정 성공");

                            // web socket
                            io.emit('parking-data');
                        }
                    });
    
                    parking_time_1 = 0;
                }
            }
            gpio.digitalWrite(park1Blue, 0);
            gpio.digitalWrite(park1Red, 1);
        }
        else {
            let noPark1 = null;
            let noParkTime1 = null;

            parking_time_1 = 0;

            gpio.digitalWrite(park1Blue, 1);
            gpio.digitalWrite(park1Red, 0);

            let result = sql.query('SELECT * FROM parknow WHERE position = 1;'); 
            result.forEach((data, index) => {
                noPark0 = data.car_num;
            });

            if(noPark1 != null) {
                car_num = null;

                let result = sql.query('SELECT * FROM parkcar WHERE car_num = "' + noPark1 + '";');
                result.forEach((data, index) => {
                    noParkTime1 = data.start_time;
                });

                noParkTime1 = new Date(noParkTime1);
                let nowTime = new Date();

                let feeData = fs.readFileSync('./config/fee.json', 'utf8');
                feeData = JSON.parse(feeData);

                // 요금 계산
                let charge = feeData.charge * (parseInt((nowTime.getTime() - noParkTime1.getTime()) / 3600000) + 1);
            
                let insertLog = sql.query('INSERT INTO parklog VALUES(1, "' + noPark1 + '", "' + noParkTime1.toYMD() + '", "' + nowTime.toYMD() + '", ' + charge + ');');
            
                connection.query('UPDATE parknow SET car_num=? WHERE position=?', [car_num, 1], (err) => {
                    if(err) {
                        console.log("DB: 주차 1번 parknow 테이블 수정 실패!");
                        console.log(err);
                        logger.log("error", "400 : 주차 1번 parknow 테이블 수정 실패");
                    }
                    else {
                        console.log("DB: 주차 1번 parknow 테이블 수정 성공!");
                        logger.log("info", "200 : 주차 1번 parknow 테이블 수정 성공");

                        // web socket
                        io.emit('parking-data');
                    }
                });
            }
        }

        car_lightdata_1 = -1;
    }

    // 주차 자리 2번
    let myCheck2 = sql.query('SELECT * FROM parknow WHERE position = 2');
    let myCheckNum2 = null;
    myCheck2.forEach((data, index) => {
        myCheckNum2 = data.car_num;
    });

    car_parking_2.read((error, reading) => {
        car_lightdata_2 = reading.rawValue;
    });

    if(car_lightdata_2 != -1) {
        if(car_lightdata_2 > 2200) {            // 2번에 차량이 주차된 경우
            if(myCheckNum2 == null) {
                parking_time_2 += timeout;
                console.log("parking_time_2: %d", parking_time_2);

                let position = 2;
                let car_num = null;

                if(parking_time_2 >= n) {
                    car_num = nowInCar;
    
                    connection.query('UPDATE parknow SET car_num=? WHERE position=?', [car_num, position], (err) => {
                        if(err) {
                            console.log("DB: 주차 2번 parknow 테이블 저장 실패!");
                            console.log(err);
                            logger.log("error", "400 : 주차 2번 parknow 테이블 수정 성공");
                        }
                        else {
                            console.log("DB: 주차 2번 parknow 테이블 저장 성공!");
                            logger.log("info", "200 : 주차 2번 parknow 테이블 수정 성공");

                            // web socket
                            io.emit('parking-data');
                        }
                    });
    
                    parking_time_2 = 0;
                }
            }
            gpio.digitalWrite(park2Blue, 0);
            gpio.digitalWrite(park2Red, 1);
        }
        else {
            let noPark2 = null;
            let noParkTime2 = null;

            parking_time_2 = 0;

            gpio.digitalWrite(park2Blue, 1);
            gpio.digitalWrite(park2Red, 0);

            let result = sql.query('SELECT * FROM parknow WHERE position = 2;'); 
            result.forEach((data, index) => {
                noPark2 = data.car_num;
            });

            if(noPark2 != null) {
                car_num = null;

                let result = sql.query('SELECT * FROM parkcar WHERE car_num = "' + noPark2 + '";');
                result.forEach((data, index) => {
                    noParkTime2 = data.start_time;
                });

                noParkTime2 = new Date(noParkTime2);
                let nowTime = new Date();

                let feeData = fs.readFileSync('./config/fee.json', 'utf8');
                feeData = JSON.parse(feeData);

                // 요금 계산
                let charge = feeData.charge * (parseInt((nowTime.getTime() - noParkTime2.getTime()) / 3600000) + 1);
            
                let insertLog = sql.query('INSERT INTO parklog VALUES(2, "' + noPark2 + '", "' + noParkTime2.toYMD() + '", "' + nowTime.toYMD() + '", ' + charge + ');');
            
                connection.query('UPDATE parknow SET car_num=? WHERE position=?', [car_num, 2], (err) => {
                    if(err) {
                        console.log("DB: 주차 2번 parknow 테이블 수정 실패!");
                        console.log(err);
                        logger.log("error", "400 : 주차 2번 parknow 테이블 수정 실패");
                    }
                    else {
                        console.log("DB: 주차 2번 parknow 테이블 수정 성공!");
                        logger.log("info", "200 : 주차 2번 parknow 테이블 수정 성공");

                        // web socket
                        io.emit('parking-data');
                    }
                });
            }
        }

        car_lightdata_2 = -1;
    }
}

let double_time_5 = 0;
let double_time_6 = 0;

// 두 자리 주차 차량 감지
const carDoubleParking = () => {
    // 두 자리 주차 자리 5번
    double_parking_5.read((error, reading) => {
        double_lightdata_5 = reading.rawValue;
    });

    if(double_lightdata_5 != -1) {
        if(double_lightdata_5 > 300) {
            double_time_5 += timeout;
            console.log("double_time_5: %d", double_time_5);

            if(double_time_5 >= n) {            
                logger.log("error", "401 : 두자리 주차 차량 감지, double_time_5 BUZZER ON");

                gpio.digitalWrite(BUZZER, 1);
                double_time_5 = 0;

                setTimeout(turnOffBuzzer, 1000);
            }
        }
        else {
            double_time_5 = 0;
        }

        double_lightdata_5 = -1;
    }

    // 두 자리 주차 자리 6번
    double_parking_6.read((error, reading) => {
        double_lightdata_6 = reading.rawValue;
    });

    if(double_lightdata_6 != -1) {
        if(double_lightdata_6 > 550) {
            double_time_6 += timeout;
            console.log("double_time_6: %d", double_time_6);

            if(double_time_6 >= n) {
                logger.log("error", "401 : 두자리 주차 차량 감지, double_time_6: BUZZER ON");

                gpio.digitalWrite(BUZZER, 1);
                double_time_6 = 0;

                setTimeout(turnOffBuzzer, 1000);
            }
        }
        else {
            double_time_6 = 0;
        }

        double_lightdata_6 = -1;
    }
}

const maxCar = () => {
    let car_count = 0;

    let result = sql.query('SELECT * FROM parknow');

    result.forEach((data, index) => {
        if(data.car_num != null)
        car_count++;
    });

    if(car_count == NUM_LEDS) {
        LEDon({r: 180, g:0, b:0}, NUM_LEDS);
    }
    else {
        LEDon({r:0, g:0, b:180}, car_count);
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// server.js 통합
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require("cookie-parser");

// post 분석을 위한 bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// 세션 설정
app.use(cookieParser("keyboard cat"));
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: "keyboard cat",
        cookie: {
            httpOnly: true,
            secure: false,
        }
    })
);

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
        let sessionData = {
            username: req.session.username,
            name: req.session.name
        };

        return res.status(200).json(sessionData);
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
                    delete result.password;

                    if(!err) { return res.status(200).send(result); }
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
        if(!err) {
            let feeData = {
                oldCharge: req.body.newCharge,
                newCharge: ""
            };
        
            return res.status(200).json(feeData);
        }
        else {
            return res.status(500).end();
        }
    });
});

// 측정 주기 변경
app.put("/api/setting/period", function(req, res) {
    let result = req.body.newPeriod;
    result = JSON.stringify({ period: result });

    fs.writeFile("./config/measure.json", result, "utf-8", (err) => {
        if(!err) {
            let periodData = {
                oldPeriod: req.body.newPeriod,
                newPeriod: ""
            };

            return res.status(200).json(periodData);
        }
        else {
            return res.status(500).end();
        }
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

            return res.status(200).json(controlData.control);
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
                    return res.status(200).send(controlData.control);
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

// 그래프 출력
// 매출
app.get("/api/graph/sales", function(req, res) {

    // 객체로 날아옴
    let fromDate = req.query.from;
    let toDate = req.query.to;

    // Date 객체로 변경
    // Date 객체를 String 객체로 파싱
    fromDate = new Date(fromDate).toYMDAPI();
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
    reqDate = new Date(reqDate).toYMDAPI().substring(0, 11);

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

        let usageVal = (usageList[i] / parkSpace) * 100;        // 비율 계산
        
        let timeIdx = String(i);
        if(timeIdx.length == 1) {
            timeIdx = "0" + timeIdx;
        }

        usageDict["date"] = timeIdx;
        usageDict["usage"] = usageVal;

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

// 출차 요금 정산
// 키오스크
io.on('connection', function(socket) {
    socket.on('payment', function() {
        // 출차기 작동
        // 결제 완료
        console.log("결제 완료, 출차기 open");

        request.get(
            {
                url:url + '/parkOut',
                headers: {'content-type':'application/json'}
            },
            function (err, res, body) {
                if(!err && res.statusCode == 200) {
                    console.log('send!');
                }
            }
        );
        setTimeout(setOutCount, 3000);
    });
});

app.get('/', function (req, res) {
    console.log("키오스크 접속");

    res.sendFile(__dirname + '/kiosk.html');
});

app.get('/msg', function (req, res) {
    res.sendFile(__dirname + '/kioskmsg.html');
});

server.listen(65002, function () {
    console.log('키오스크 서버 작동, port: 65002');
});

// 번호판 식별 AI
let park_in_count = 0;
let park_out_count = 0;
let park_in_value = 0;
let park_out_value = 0;
let inCount = 0;
let outCount = 0;

const setInCount = () => {
    inCount = 0;
}

const setOutCount = () => {
    outCount = 0;
}

const park_in_out = () => {
    park_in.read((err, reading) => {
        park_in_value = reading.rawValue;
    });
    park_out.read((err, reading) => {
        park_out_value = reading.rawValue;
    });

    if(park_in_value >= 2200) {
        if(park_in_count >= 4) {
            if(inCount == 0) {
                inCount = 1;

                rl.question('번호를 입력하세요(1~5)', (answer) => {
                    fs.readFile(`./img${answer}.jpg`, (error, data) => {
                        const formData = new FormData();
                        formData.append(`img${answer}.jpg`, data);

                        axios.post('https://5brwcevbu1.execute-api.ap-northeast-2.amazonaws.com/img2string', formData, {
                            headers:{
                                'content-type': 'multipart/form-data',
                                'accept': 'application/json'
                            }
                        }).then((res)=>{
                            console.log(res.data);
                            nowInCar = res.data;

                            let result1 = sql.query('INSERT INTO parkcar VALUES("' + res.data + '", sysdate());');
                            logger.log("info", "201 : 입차 차량 번호 : " + res.data + " 입차 완료 ");
                        }).then(() => {
                            request.get(
                                {
                                    url:url + '/parkIn',
                                    headers: {'content-type':'application/json'}
                                },
                                function (err, res, body) {
                                    if(!err && res.statusCode == 200) {
                                        //console.log('send!');
                                    }
                                }
                            );
                            setTimeout(setInCount, 3000);
                        });
                    });
                });
            }

            park_in_count = 0;
        }
        else {
            park_in_count += 1;
        }
    }
    else {
        park_in_count = 0;
    }

    if(park_out_value >= 2200) {
        if(park_out_count >= 4) {
            if(outCount == 0) {
                outCount = 1;

                rl.question('번호를 입력하세요(1~5)', (answer) => {
                    fs.readFile(`./img${answer}.jpg`, (error, data) => {
                        const formData = new FormData();
                        formData.append(`img${answer}.jpg`, data);

                        axios.post('https://5brwcevbu1.execute-api.ap-northeast-2.amazonaws.com/img2string', formData, {
                            headers:{
                                'content-type': 'multipart/form-data',
                                'accept': 'application/json'
                            }
                        }).then((res)=>{
                            let result5 = sql.query('DELETE FROM parkcar WHERE car_num="' + res.data + '";');
                            let kiosk_result = sql.query('SELECT car_num, pay FROM parklog WHERE car_num ="' + res.data + '" ORDER BY end_time;');

                            let kiosk_lent = kiosk_result.length;
                            console.log("pay",res.data, kiosk_result[kiosk_lent-1].pay);

                            io.emit("pay", res.data, kiosk_result[kiosk_lent-1].pay);
                            logger.log("info", "202 : 출차 요청 차량 번호 : " + res.data);
                        }).then(() => {
                        });
                    });
                });
            }

            park_out_count = 0;
        }
        else {
            park_out_count += 1;
        }
    }
    else {
        park_out_count = 0;
    }
}

// Ctrl + C
process.on('SIGINT', () => {
    gpio.digitalWrite(BUZZER, 0);
    gpio.digitalWrite(RAZER, 0);

    gpio.digitalWrite(park0Blue, 0);
    gpio.digitalWrite(park0Red, 0);
    gpio.digitalWrite(park1Blue, 0);
    gpio.digitalWrite(park1Red, 0);
    gpio.digitalWrite(park2Blue, 0);
    gpio.digitalWrite(park2Red, 0);

    ws281x.reset();

    process.exit();
});

// initialization (modules)
gpio.wiringPiSetup();

gpio.pinMode(accelTrig, gpio.OUTPUT);
gpio.pinMode(accelEcho, gpio.INPUT);
gpio.pinMode(accelTrig, gpio.OUTPUT);
gpio.pinMode(accelEcho, gpio.INPUT);
gpio.pinMode(accelTrig1, gpio.OUTPUT);
gpio.pinMode(accelEcho1, gpio.INPUT);
gpio.pinMode(accelTrig2, gpio.OUTPUT);
gpio.pinMode(accelEcho2, gpio.INPUT);
gpio.pinMode(accelTrig3, gpio.OUTPUT);
gpio.pinMode(accelEcho3, gpio.INPUT);

gpio.pinMode(park0Blue, gpio.OUTPUT);
gpio.pinMode(park0Red, gpio.OUTPUT);
gpio.pinMode(park1Blue, gpio.OUTPUT);
gpio.pinMode(park1Red, gpio.OUTPUT);
gpio.pinMode(park2Blue, gpio.OUTPUT);
gpio.pinMode(park2Red, gpio.OUTPUT);

gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.pinMode(RAZER, gpio.OUTPUT);

gpio.pinMode(CS_MCP3208_0, gpio.OUTPUT);
gpio.pinMode(CS_MCP3208_1, gpio.OUTPUT);

setTimeout(mainController, 500);

gpio.digitalWrite(park0Red, 1);

logger.log("info", "200 : 스마트 주차장 시스템 시작");
