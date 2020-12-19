const AWS = require('aws-sdk');
AWS.config.update({
    region: "us-east-2",
    endpoint: "http://dynamodb.us-east-2.amazonaws.com",
    accessKeyId: 'AKIA3AH4OYVFJTBAMMXS',
    secretAccessKey: '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'
});