require('../config_database/database');
const AWS = require('aws-sdk');
var uuid = require('uuid');

require('dotenv').config()
const BUCKET_NAME = 'the-hung';

var docClient = new AWS.DynamoDB.DocumentClient();
const table = 'Users'
const getAll = async() => {
    var params = {
        TableName: table
    };
    return await (await docClient.scan(params).promise()).Items
}

const getSingleById = async(phone) => {
    const options = {
        TableName: table,
        Key: {
            'phone': phone,

        }
    }
    return await (await docClient.get(options).promise()).Item
}

const add = async(user) => {
    const options = {
        TableName: table,
        Item: user
    }
    return await docClient.put(options).promise().catch((err) => {
        console.log(err);
        return null
    })
}
const update = async(user) => {
    const options = {
        TableName: table,
        Key: {
            phone: user.phone,

        },
        UpdateExpression: "set #r=:rl, password=:password, user_name=:user_name, id=:id, gioiTinh=:gioiTinh, ngaySinh=:ngaySinh, ngayTao=:ngayTao, #s=:stt, avata=:avata",
        ExpressionAttributeNames: {
            '#r': 'role',
            '#s': 'status',
        },
        ExpressionAttributeValues: {
            ":id": user.id,
            ":user_name": user.user_name,
            ":gioiTinh": user.gioiTinh,
            ":ngaySinh": user.ngaySinh,
            ":ngayTao": user.ngayTao,
            ":rl": user.role,
            ":stt": user.status,
            ":avata": user.avata,
            ":password": user.password
        },

        ReturnValues: "UPDATED_NEW"
    }
    return await docClient.update(options).promise().catch((err) => {
        console.log(err);
        return null;
    })
}
const deleteById = async(phone) => {
    const options = {
        TableName: table,
        Key: {
            'phone': phone,

        },
    }
    return await docClient.delete(options).promise().catch((err) => {
        console.log(err);
        return null;
    })
}
const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});
const uploadAvatar = async(avatar) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: avatar.name, // File name you want to save as in S3
        Body: avatar.data,
        ACL: 'public-read',
    };
    return await (await (s3.upload(params).promise())).Location
}
module.exports = {
    getAll: getAll,
    getSingleById: getSingleById,
    add: add,
    update: update,
    delete: deleteById,
    uploadAvatar: uploadAvatar
}