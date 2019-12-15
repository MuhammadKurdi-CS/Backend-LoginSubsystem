'use strict';

var mysql = require('promise-mysql');
var bcrypt = require('bcryptjs');

var info = require('../config');

exports.postValid = async (user) => { 
    try {
        //server validations for username and password
        if(user.username === undefined){throw {message:'username is not passing', status:400};}

        if(user.password === undefined){throw {message:'password is not passing', status:400};}

        let sql = `SELECT ID, password, passwordSalt, deleted from user WHERE
                    username = \'${user.username}'`;
        const connection = await mysql.createConnection(info.config);
        var data = await connection.query(sql);

        let salt = ""
        try{
            salt = data[0].passwordSalt 
        } catch {
            throw {message:'user not found', status:400}
        }

        if(data[0].deleted == 1) {
            throw {message:'account has been deleted', status:400}
        }

        let password = bcrypt.hashSync(user.password, salt);

        await connection.end();
        console.log('pw', password);
        console.log('data', data)

        if (bcrypt.compareSync(user.password, data[0].passwordSalt)) {
            console.log("Correct login details");
            return true;
        }else{
            throw {message:'password does not match', status:400}
        }

    } catch (error) {

        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}

exports.saving = async (username, ip, browser, deviceDetails, succeeded) => {
    try {

        let success = 1
        if(succeeded == false){
            success = 0
        }
        var d = new Date();

        const attemptDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() 
        const timeOfLogin = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() 
        let sql = `INSERT INTO loginhistory(username, attemptDate, succeeded, IP, browser, timeOfLogin, deviceDetails) VALUES("${username}", "${attemptDate}", "${success}", "${ip}", "${browser}", "${timeOfLogin}", "${deviceDetails}")`;
        const connection = await mysql.createConnection(info.config);
        var data = await connection.query(sql);
    } catch(err){
        if(err.status === undefined)
            err.status = 500;
        throw err;
    }
}