var uuid = require('uuid');
require('../config_database/database');
const AWS = require('aws-sdk');


const docClient = new AWS.DynamoDB.DocumentClient();

const id = uuid.v1();
const phone = '0334551135';
const user_name = 'Hungrau99';
const gioiTinh = 'Nam';
const ngaySinh = '24-07-1999';
const ngayTao = '16-11-2020';
const role = 'Admin';
const status = 'Active';
const avata = 'https://picsum.photos/id/237/200/300';
const password = 'hungrau123';


const params = {
    TableName: 'Users',
    Item: {
        id,
        phone,
        user_name,
        gioiTinh,
        ngaySinh,
        ngayTao,
        role,
        status,
        avata,
        password
    },
};

docClient.put(params, (err, data) => {
    if (err) {
        console.error('Unable to add instance. Error JSON:', JSON.stringify(err, null, 2));
        return false;
    } else {
        console.log('Added An Instance', JSON.stringify(params));
        return true;
    }
});