const fs = require('fs')
const request = require('request');
const gpio = require('node-wiring-pi');
const mysql = require('mysql');
const mcpadc = require('mcp-spi-adc');

const test = require('./modules/test.js');

const SPI_SPEED = 1000000;

const accelTrig = 25;
const accelEcho = 24;
const BUZZER = 7;
const LAZER = 29;
const CS_MCP3208_0 = 10;
const CS_MCP3208_1 = 11;

const ELEV_UP = 3;
const ELEV_DOWN = 4;
const PARKING_01 = 5;
const PARKING_12 = 6;

var startTime;
var travelTime;

var accelCount = 0;
var beforeDistance = 0;
var warningBuzzer = 0;

var elev_up_lightdata = -1;
var elev_down_lightdata = -1;

var timeout= 500;

var count = 0;

var url = 'http://192.9.44.254:65001'



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
const parking_01 = mcpadc.openMcp3208(PARKING_01, {speedHz: SPI_SPEED}, (err) => {
  console.log('parking_01 init...');
  if(err)
    console.log('fail!');
});
const parking_12 = mcpadc.openMcp3208(PARKING_12, {speedHz: SPI_SPEED}, (err) => {
  console.log('parking_12 init...');
  if(err)
    console.log('fail!');
});


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

    if(data.lazer == true) {
      turnOnLazer();
    }
  });
  //console.log(count);
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

const turnOnLazer = () => {
  gpio.digitalWrite(LAZER, 1);

  parking_01.read((err, reading) => {
    console.log('parking_01 : ' + reading.rawValue);
    //parking_01_lightdata = reading.rawValue;
  });


  gpio.digitalWrite(LAZER, 0);
}


gpio.wiringPiSetup();
gpio.pinMode(accelTrig, gpio.OUTPUT);
gpio.pinMode(accelEcho, gpio.INPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.pinMode(LAZER, gpio.OUTPUT);


setTimeout(mainController, 500);

exports.mainController = mainController;