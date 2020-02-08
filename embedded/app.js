const express = require('express')
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const app = express()
const port = 3000
const sport = new SerialPort('/dev/ttyACM0', {baudRate:9600, parser: serialport.parsers.readline('\n')})

app.get('/', (req, res) => res.send("hello"))

app.get('/off', async (req, res) => {
	let str = "";
	sport.write('OFF');
	await parser.on('data', (line) => res.send(line))
	
	res.send(str)
})

app.get('/on', (req,res) => {
	let str = "";
	sport.write('ON');
 	parser.on('data', (line) => str = line)
	setTimeout(res.send(str),1000);
})

app.listen(port, () => console.log('Example app'))
