const fs = require('fs')
const request = require('request');
const gpio = require('node-wiring-pi');
const mysql = require('mysql');
const mcpadc = require('mcp-spi-adc');

const test = require('./modules/test.js');

const SPI_SPEED = 1000000;

const accelTrig = 24;
const accelEcho = 25;
const BUZZER = 7;
const LAZER = 29;
const CS_MCP3208_0 = 10;
const CS_MCP3208_1 = 11;

const ELEV_UP = 3;
const ELEV_DOWN = 4;

// 주차 차량 감지 (주차 자리 총 3개)
const CAR_PARKING_0 = 0;
const CAR_PARKING_1 = 1;
const CAR_PARKING_2 = 2;

let car_lightdata_0 = -1;
let car_lightdata_1 = -1;
let car_lightdata_2 = -1;

let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'gachon654321',
    database: 'parkdb'
});

var startTime;
var travelTime;

var accelCount = 0;
var beforeDistance = 0;
var warningBuzzer = 0;

var elev_up_lightdata = -1;
var elev_down_lightdata = -1;

var timeout = 500;

var count = 0;

var url = 'http://192.9.45.132:65001'

// initialization
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
    if(err) { console.log('fail!'); }
});
const car_parking_1 = mcpadc.openMcp3208(CAR_PARKING_1, {speedHz: SPI_SPEED}, (err) => {
    console.log('car_parking_1 init...');
    if(err) { console.log('fail!'); }
});
const car_parking_2 = mcpadc.openMcp3208(CAR_PARKING_2, {speedHz: SPI_SPEED}, (err) => {
    console.log('car_parking_2 init...');
    if(err) { console.log('fail!'); }
});


// Main Controller
const mainController = () => {
    var result = fs.readFileSync('./config.json', 'utf8');
    result = JSON.parse(result);

    result.forEach((data, index) => {
    if(data.test == true) {
        count = (count == 1)? 0: 1;
        test.test(count);
    }

    if(data.accel == true) {
        accel();
    }

    if(data.elev == true) {
        elev();
    }

    // if(data.lazer == true) {
    //     turnOnLazer();
    // }

    // 주차 차량 감지
    if(data.parking == true) {
        carParking();
    }
});

if(warningBuzzer == 1) {
    request.get(
        {
            url:url + '/test',
            headers: {'content-type':'application/json'}
        },
        function (err, res, body) {
            let data = JSON.parse(body);
            if(!err && res.statusCode == 200) {
                console.log('send!');
            }
        }
    );
        warningBuzzer = 0;

        gpio.digitalWrite(BUZZER, 1);
        setTimeout(turnOffBuzzer, 1000);
    }

    setTimeout(mainController, 500);
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
    //console.log(distance);
    //console.log(accelCount);
}

const turnOffBuzzer = () => {
    gpio.digitalWrite(BUZZER, 0);
}

const elev = () => {
    elev_up.read((err, reading) => {
        //console.log('elev_up : ' + reading.rawValue);
        elev_up_lightdata = reading.rawValue;
    });
    elev_down.read((err, reading) => {
        //console.log('elev_down : ' + reading.rawValue);
        elev_down_lightdata = reading.rawValue;
    });

    if(elev_up_lightdata > 2200) {
        request.get(
            {
                url:url + '/elevup',
                headers: {'content-type':'application/json'}
            },
            function (err, res, body) {
                let data = JSON.parse(body);
                if(!err && res.statusCode == 200) {
                    console.log('send!');
                }
            }
        );
    }
    else if(elev_down_lightdata > 2200) {
        request.get(
            {
                url:url + '/elevdown',
                headers: {'content-type':'application/json'}
            },
            function (err, res, body) {
                let data = JSON.parse(body);
                if(!err && res.statusCode == 200) {
                    console.log('send!');
                }
            }
        );
    }
}

// 주차 차량 감지
let n = 5000;                           // 현재 5초
let parking_time_0 = 0;
let parking_time_1 = 0;
let parking_time_2 = 0;

const carParking = () => {

    // 주차 자리 0번
    car_parking_0.read((error, reading) => {
        console.log("주차 자리 0번 조도값: %d", reading.rawValue);

        car_lightdata_0 = reading.rawValue;
    });

    if(car_lightdata_0 != -1) {
        if(car_lightdata_0 > 2200) {            // 0번에 차량이 주차된 경우
            parking_time_0 += timeout;
            console.log("parking_time_0: %d", parking_time_0);

            if(parking_time_0 >= n) {
                let position = 0;
                let car_num = '주차 0번';
                // let parking_time = new Date();

                connection.query('INSERT INTO parknow VALUES(?, ?)', [position, car_num], (err, result) => {
                    if(err) {
                        console.log("DB: 주차 0번 parknow 테이블 저장 실패!");
                        console.log(err);
                    }
                    else {
                        console.log("DB: 주차 0번 parknow 테이블 저장 성공!");
                    }
                });
                
                parking_time_0 = 0;
            }
        }
        else {
            parking_time_0 = 0;
        }

        car_lightdata_0 = -1;
    }
    
    // 주차 자리 1번
    car_parking_1.read((error, reading) => {
        console.log("주차 자리 1번 조도값: %d", reading.rawValue);

        car_lightdata_1 = reading.rawValue;
    });

    if(car_lightdata_1 != -1) {
        if(car_lightdata_1 > 2200) {            // 1번에 차량이 주차된 경우
            parking_time_1 += timeout;
            console.log("parking_time_1: %d", parking_time_1);

            if(parking_time_1 >= n) {
                let position = 1;
                let car_num = '주차 1번';
                // let parking_time = new Date();

                connection.query('INSERT INTO parknow VALUES(?, ?)', [position, car_num], (err, result) => {
                    if(err) {
                        console.log("DB: 주차 1번 parknow 테이블 저장 실패!");
                        console.log(err);
                    }
                    else {
                        console.log("DB: 주차 1번 parknow 테이블 저장 성공!");
                    }
                });

                parking_time_1 = 0;
            }
        }
        else {
            parking_time_1 = 0;
        }

        car_lightdata_1 = -1;
    }

    // 주차 자리 2번
    car_parking_2.read((error, reading) => {
        console.log("주차 자리 2번 조도값: %d", reading.rawValue);

        car_lightdata_2 = reading.rawValue;
    });

    if(car_lightdata_2 != -1) {
        if(car_lightdata_2 > 2200) {            // 2번에 차량이 주차된 경우
            parking_time_2 += timeout;
            console.log("parking_time_2: %d", parking_time_2);

            if(parking_time_2 >= n) {
                let position = 2;
                let car_num = '주차 2번';
                // let parking_time = new Date();

                connection.query('INSERT INTO parknow VALUES(?, ?)', [position, car_num], (err, result) => {
                    if(err) {
                        console.log("DB: 주차 2번 parknow 테이블 저장 실패!");
                        console.log(err);
                    }
                    else {
                        console.log("DB: 주차 2번 parknow 테이블 저장 성공!");
                    }
                });

                parking_time_2 = 0;
            }
        }
        else {
            parking_time_2 = 0;
        }

        car_lightdata_2 = -1;
    }
}


gpio.wiringPiSetup();
gpio.pinMode(accelTrig, gpio.OUTPUT);
gpio.pinMode(accelEcho, gpio.INPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.pinMode(LAZER, gpio.OUTPUT);

setTimeout(mainController, 500);

exports.mainController = mainController;