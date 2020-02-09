const { XpringClient } = require('xpring-js')

exports.handler = async (event) => {
    
    const remoteURL = "grpc.xpring.tech:80";
    const xpringClient = XpringClient.xpringClientWithEndpoint(remoteURL);

    const balDrops = await xpringClient.getBalance(address);

    const response = {
        statusCode: 200,
        body: JSON.stringify(balDrops),
    };
    
    return response;
};
