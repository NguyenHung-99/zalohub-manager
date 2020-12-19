require('../config_database/database');
const AWS = require('aws-sdk');



let dynamodb = new AWS.DynamoDB();

let params = {
    TableName: "Users",
    KeySchema: [
        { AttributeName: "phone", KeyType: "HASH" },

    ],
    AttributeDefinitions: [
        { AttributeName: "phone", AttributeType: "S" },

    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, (err, data) => {
    if (err) {
        console.error(`Something went wrong ${JSON.stringify(err,null,2)}`);
    } else {
        console.log(`Created table ${JSON.stringify(data, null, 2)}`);
    }
});