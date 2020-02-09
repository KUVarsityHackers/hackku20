const { XpringClient } = require('xpring-js')

f()

async function f() {
    
    const remoteURL = "grpc.xpring.tech:80";
    const xpringClient = new XpringClient(remoteURL);

    const balDrops = await xpringClient.getBalance('XVfkVt54arhWBMyWGq7ogsdTkeREmLSj6b4G7tGukY8SmSk');

    const response = {
        statusCode: 200,
        body: JSON.stringify(balDrops),
    };
    
    console.log(balDrops)

    return response;
};
