// 두 자리 주차 차량 감지

const gpio = require('node-wiring-pi');
const mcpadc = require('mcp-spi-adc');

const fs = require('fs');
const http = require('http');
const socketio = require('socket.io');

const BUZZER = 7;

const CS_MCP3208 = 10;
const SPI_SPEED = 1000000;

const LIGHT_RAZER1 = 3;             // 두 자리 감지 총 2개
// const LIGHT_RAZER2 = 4;

var lightdata_razer1 = -1;
// var lightdata_razer2 = -1;

var timerid, timeout = 500;

const Light_razer1 = mcpadc.openMcp3208(
    LIGHT_RAZER1,
    { speedHz : SPI_SPEED },
    (err) => {
        console.log("두 자리 감지 3번 초기화 완료!");

        if(err) {
            console.log("두 자리 감지 3번 초기화 실패! (HW 점검!)");
        }
    }
);

// const Light_razer2 = mcpadc.openMcp3208(
//     LIGHT_RAZER2,
//     {speedHz:SPI_SPEED},
//     (err) => {
//         console.log("두 자리 감지 4번 초기화 완료!");

//         if(err) {
//             console.log("두 자리 감지 4번 초기화 실패! (HW 점검!)");
//         }
//     }
// );

let n_sec = 5000;
let light_razer1_time = 0;

const LightRazer1 = () => {
    Light_razer1.read((error, reading) => {
        console.log("두 자리 감지 3번 조도값: %d", reading.rawValue);
        lightdata_razer1 = reading.rawValue;
    });

    if(lightdata_razer1 != -1) {
        if(lightdata_razer1 > 2200) {                   // 어두움
            light_razer1_time += parseInt(timeout);
            console.log(light_razer1_time);

            if(light_razer1_time >= n_sec) {            // n_sec초(현재는 5초) 이상 연속으로 어두우면 부저 울림
                console.log("부저 울림! %d", light_razer1_time);
                light_razer1_time = 0;
                gpio.digitalWrite(BUZZER, 1);
            }
        }
        else {
            light_razer1_time = 0;
            gpio.digitalWrite(BUZZER, 0);
        }
        lightdata_razer1 = -1;
    }
    timerid = setTimeout(LightRazer1, timeout);
}

// const LightRazer2 = () => {
//     Light_razer2.read((error, reading) => {
//         console.log("두 자리 감지 4번 조도값: %d", reading.rawValue);
//         lightdata_razer2 = reading.rawValue;
//     });

//     if(lightdata_razer2 != -1) {
//         if(lightdata_razer2 > 2200) {
//             // if(n초 이상 어두우면)
//             gpio.digitalWrite(BUZZER, 1);
//         }
//         else {
//             gpio.digitalWrite(BUZZER, 0);
//         }
//         lightdata_razer2 = -1;
//     }
//     timerid = setTimeout(LightRazer2, timeout);
// }

process.on('SIGINT', () => {
    Light_razer1.close(() => {
        console.log("MCP-ADC가 해제되었습니다. 두 자리 주차 차량 감지를 종료합니다.");
        gpio.digitalWrite(BUZZER, 0);
        process.exit();
    });
    // Light_razer2.close(() => {
    //     console.log("MCP-ADC가 해제되었습니다. 두 자리 주차 차량 감지를 종료합니다.");
    //     process.exit();
    // });
});

const serverbody = (request, response) => {
    fs.readFile('views/double_parking_car.html', 'utf8', (err, data) => {
        response.writeHead(200, {'Content-Type':'text/html'});
        response.end(data);
    });
};

const server = http.createServer(serverbody);
const io = socketio.listen(server);
io.sockets.on('connection', (socket) => {
    socket.on('startmsg', (data) => {
        console.log("가동 메시지 수신");
        timeout = data;
        LightRazer1();
    });

    socket.on('stopmsg', (data) => {
        clearTimeout(timerid);
    });
});

server.listen(65001, () => {
    gpio.wiringPiSetup();
    gpio.pinMode(BUZZER, gpio.OUTPUT);
    gpio.pinMode(CS_MCP3208, gpio.OUTPUT);
})