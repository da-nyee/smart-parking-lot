// 주차 차량 감지

const gpio = require('node-wiring-pi');
const mcpadc = require('mcp-spi-adc');

const fs = require('fs');
const http = require('http');
const socketio = require('socket.io');

const CS_MCP3208_0 = 10;                    // CE0
const SPI_SPEED = 1000000;

const PARKING_0 = 0;                        // 주차 자리 총 3개
// const PARKING_1 = 1;
// const PARKING_2 = 2;

var lightdata_0 = -1;
// var lightdata_1 = -1;
// var lightdata_2 = -1;

var timerid, timeout = 500;


// database 연동
var mysql = require('mysql');

// var connection = new mysql({
//     host: 'localhost',
//     port: '3306',
//     user: 'root',
//     password: 'gachon654321',
//     database: 'parkdb'
// });

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'gachon654321',
    database: 'parkdb'
});

// const result = connection.query('select * from parknow');

// console.log(result);


const Parking_0 = mcpadc.openMcp3208(       // 주차 자리 초기화
    PARKING_0,
    { speedHz : SPI_SPEED },
    (err) => {
        console.log("주차 자리 0번 초기화 완료!");

        if(err) {
            console.log("주차 자리 0번 초기화 실패! (HW 점검!)");
        }
    });

// const Parking_1 = mcpadc.openMcp3208(
//     PARKING_1,
//     {speedHz:SPI_SPEED},
//     (err) => {
//         console.log("주차 자리 1번 초기화 완료!");

//         if(err) {
//             console.log("주차 자리 1번 초기화 실패! (HW 점검!)");
//         }
//     });
    
// const Parking_2 = mcpadc.openMcp3208(
//     PARKING_2,
//     {speedHz:SPI_SPEED},
//     (err) => {
//         console.log("주차 자리 2번 초기화 완료!");

//         if(err) {
//             console.log("주차 자리 2번 초기화 실패! (HW 점검!)");
//         }
//     });


// DB에서 가장 최근에 주차장에 들어온 차를 읽어와
// 방금 주차 상태가 n초 이상 1로 바뀐 곳에
// 해당 차가 주차되었다고
// DB에 해당 자리와 언제부터 주차 되었는지 저장

// let parking_check = [0, 0, 0];                          // 배열의 값이 0이면 주차 차량 없음, 1이면 주차 차량 있음

let n_sec = 5000;
let parking_0_time = 0;

const Parking_0_light = () => {
    Parking_0.read((error, reading) => {
        console.log("주차 자리 0번 조도값: %d", reading.rawValue);
        lightdata_0 = reading.rawValue;
    });

    if(lightdata_0 != -1) {
        if(lightdata_0 > 2200) {                        // 어두움, 주차 자리 0번에 차량이 주차된 경우
            parking_0_time += parseInt(timeout);
            console.log(parking_0_time);

            if(parking_0_time >= n_sec) {
                // parking_check[0] = 1;

                let position = 0;                       // 주차 위치
                let car_num = '가1234';                 // 주차 차량 번호
                let parking_time = new Date();          // 주차 시간
                
                connection.query('INSERT INTO parknow VALUES(?, ?, ?)', [position, car_num, parking_time], (err, result) => {
                    if(err) {
                        console.log("DB 저장 실패!");
                        console.log(err);
                    }
                    else {
                        console.log("DB 저장 완료!");
                    }
                });

                parking_0_time = 0;
            }
        }
        else {
            parking_0_time = 0;

            // parking_check[0] = 0;
        }
        lightdata_0 = -1;
    }
    timerid = setTimeout(Parking_0_light, timeout);
}


// const Parking_1_light = () => {
//     Parking_1.read((error, reading) => {
//         console.log("주차 자리 1번 조도값: %d", reading.rawValue);
//         lightdata_1 = reading.rawValue;
//     });

//     if(lightdata_1 != -1) {
//         if(lightdata_1 > 2200) {                        // 어두움, 주차 자리 1번에 차량이 주차된 경우
//             parking_check[1] = 1;
//         }
//         else {
//             parking_check[1] = 0;
//         }
//         lightdata_1 = -1;
//     }
//     timerid = setTimeout(Parking_1_light, timeout);
// }

// const Parking_2_light = () => {
//     Parking_2.read((error, reading) => {
//         console.log("주차 자리 2번 조도값: %d", reading.rawValue);
//         lightdata_2 = reading.rawValue;
//     });

//     if(lightdata_2 != -1) {                             // 어두움, 주차 자리 2번에 차량이 주차된 경우
//         if(lightdata_2 > 2200) {
//             parking_check[2] = 1;
//         }
//         else {
//             parking_check[2] = 0;
//         }
//         lightdata_2 = -1;
//     }
//     timerid = setTimeout(Parking_2_light, timeout);
// }

process.on('SIGINT', () => {
    Parking_0.close(() => {
        console.log("MCP-ADC가 해제되었습니다. 주차 차량 감지를 종료합니다.");
        process.exit();
    });
    // Parking_1.close();
    // Parking_2.close(() => {
    //     console.log("MCP-ADC가 해제되었습니다. 프로그램을 종료합니다.");
    //     process.exit();
    // });
});

const serverbody = (request, response) => {
    fs.readFile('./views/parking_car.html', 'utf8', (err, data) => {
        response.writeHead(200, { 'Content-Type':'text/html' });
        response.end(data);
    });
};

const server = http.createServer(serverbody);
const io = socketio.listen(server);
io.sockets.on('connection', (socket) => {
    socket.on('startmsg', (data) => {
        console.log("가동 메세지 수신!");
        timeout = data;
        Parking_0_light();
    });

    socket.on('stopmsg', (data) => {
        console.log("중지 메세지 수신!");
        clearTimeout(timerid);
    });
});

server.listen(65001, () => {
    gpio.wiringPiSetup();
    gpio.pinMode(CS_MCP3208_0, gpio.OUTPUT);
})