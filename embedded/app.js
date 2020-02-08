const express = require('express')
const SerialPort = require('serialport')
const app = express()
const port = 3000
const sport = new SerialPort('/dev/ttyACM0', {baudRate:9600})

var awslot = require('aws-iot-device-skd');

var device = awsIot.device({keyPath: '.certs/})

app.get('/', (req, res) => res.send("hello"))

app.get('/off', async (req, res) => {
	sport.write('OFF')
	res.send("Turned off");
})

app.get('/on', (req,res) => {
	sport.write('ON');
 	res.send("Turned on");
})

app.listen(port, () => console.log('app for killing power'))
