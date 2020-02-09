const { XpringClient } = require('xpring-js')
var AWS = require('aws-sdk');
const https = require('https');

const deviceUrl = "https://zczrtn5elj.execute-api.us-east-1.amazonaws.com/dev/"
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const electricityRate = .0188888888;

exports.handler = async (event) => {
    console.log(JSON.stringify(event, null, 2));
    if(event.Records && event.Records[0].eventName == "INSERT") {
        const remoteURL = "grpc.xpring.tech:80";
        const xpringClient = new XpringClient(remoteURL);
        const address = event.Records[0].dynamodb.NewImage.publicKey.S;
        const reading = event.Records[0].dynamodb.NewImage.reading.S;
        const date = event.Records[0].dynamodb.NewImage.date.N;
        const price = reading * electricityRate
        const balDrops = await xpringClient.getBalance(address);
        if(balDrops * 10000 < price) {
            await https.get(deviceUrl + "/off");
        } else {
            await https.get(deviceUrl + "/pay/" + price);
        }
        var params = {
            TableName: 'balance',
            Item: {
                'publicKey' : {S: address},
                'walletBalance' : {S: balDrops.toString()},
                'date': {N: date.toString()}
            }
        };
        await ddb.putItem(params, function(err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data);
            }
        });

    }

    const response = {
        statusCode: 200,
        body: JSON.stringify("Ok"),
    };
    return response;
};