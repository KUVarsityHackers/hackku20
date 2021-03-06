const serverless = require('serverless-http');

const express = require('express')

const app = express()

let debts = [];
let on = "ON";
let missedPayCt = 0;

app.get('/', function (req, res) {

  res.send('Hello World!')

})

app.get('/onoroff', function (req, res) {
    res.send(on);
});

app.get('/on', function (req, res) {
    on = "ON";
    res.send("Turned on");
});

app.get('/off', function (req,res) {
    on = "OFF";
    res.send("Turned off");
});

app.get('/pay/:amt', function (req, res) {
    if(missedPayCt > 5) {
        on = "OFF";
    }
    else {
        on = "ON"
        missedPayCt++;
    }
    amt = req.params['amt'];
    console.log(amt);
    debts.push(amt);
    res.send("Charged user");
});

app.get('/settle', function (req, res) {
    missedPayCt = 0;
    if(debts.length == 0) {
        res.send("No debts to settle");
    }

    debt = debts.shift();
    res.send(debt.toString());
});


module.exports.handler = serverless(app);