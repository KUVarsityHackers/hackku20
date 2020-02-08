const express = require('express')
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const app = express()
const port = 3000
const linuxport = '/dev/ttyACM0';
const sport = new SerialPort('/dev/tty.usbmodem14301', {baudRate:9600})

app.get('/', (req, res) => res.send("hello"))

app.get('/off', async (req, res) => {
	let str = "";
	sport.write('OFF');	
	res.send("Turned off")
})

app.get('/on', (req,res) => {
	let str = "";
	sport.write('ON');
	res.send("Turned on")
})

app.listen(port, () => console.log('Endpoint to kill power'))
