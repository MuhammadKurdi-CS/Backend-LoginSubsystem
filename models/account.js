'use strict';

var mysql = require('promise-mysql');
var bcrypt = require('bcryptjs');

var info = require('../config');

exports.postAccount = async (user) => {
	try {
        //server validation rules      
        if(user.username === undefined){ throw {message:'username is required', status:200};}
        //paswword is required
        if(user.password === undefined){throw {message:'password is required', status:400};}
        // etc ...
        if(user.firstname === undefined){
            throw {message:'first name is required', status:400};
        }

        if(user.lastname === undefined){
            throw {message:'last name is required', status:400};
        }

        if(user.email === undefined){
            throw {message:'email is required', status:400};
        }

        if(user.about === undefined){
            throw {message:'about is required', status:400};
        }
        if(user.countryID === undefined){
            throw {message:'country is required', status:400};
        }
        if(user.birthDate === undefined){
            throw {message:'birth date is required', status:400};
        }

        //validation for the password
        if(user.password<8){
            throw{message:'Password must be at least 8 characters', status:400};
        }
        //email should be a valid email address
        //we will use a regular expression to validate the email format
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(String(user.email).toLowerCase()))
            throw {message:'invalid email address format', status:400};

        //final check is to make sure that email should be unique and never been used in the system
        //note that we needed to escape the ' character in roder to make the sql statement works
        let sql = `SELECT email from User WHERE
                    email = \'${user.email}\'`;
        
        const connection = await mysql.createConnection(info.config);
        let data = await connection.query(sql);

        //if the query return a record then this email has been used before
        if(data.length){
            //first close the connection as we are leaving this function
            await connection.end();
            //then throw an error to leave the function
            throw {message:'email address already in use', status:400};
        }

        //hash the password using bcryptjs package
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(user.password, salt);

        //create a new object to hold users final data
        let userData = {
            username: user.username, 
            password: user.password,
            passwordSalt: hash,
            firstname: user.firstname,
            lastname: user.lastname,
            profileImageURL: user.profileImageURL,
            email: user.email,
            about: user.about,
            countryID: user.countryID,
            birthDate: user.birthDate,
            dateRegistered: user.dateRegistered,
            active: user.active,
            deleted: user.deleted    
        }

        //this is the sql statement to execute
		sql = `INSERT INTO user
					SET ?
                `;
                
        data = await connection.query(sql, userData);
		
		await connection.end();

        return data;

    } catch (error) {
        //in case we caught an error that has no status defined then this is an error from our database
        //therefore we should set the status code to server error
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}

// get one account holder in login history database via user id
exports.getOne = async (id) => { 
    try {
        let sql = `SELECT * from loginhistory WHERE
                    id = \'${id}'`;
        const connection = await mysql.createConnection(info.config);
        var data = await connection.query(sql);

        if(data.length == 0){
            throw {message:'not record found in database', status: 400};
        } 
        await connection.end();
        return data
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}

//gets login information process in database for a user
exports.getLoginInfo = async (username) => { 
    try {
        let sql = `SELECT username, firstName, lastName, email, about, dateRegistered, countryID, profileImageURL from user WHERE
                    username = \'${username}'`;
        const connection = await mysql.createConnection(info.config);
        var data = await connection.query(sql);
        if(data.count==0) throw {message:'no user found', status: 400};
        await connection.end();

        let date = String(data[0].dateRegistered)
        date = date.slice(0, -40) 
        data[0].dateRegistered = date

        return data
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}

//deletes a user's account by their id in the database
exports.delete = async (id) => { 
    try {
        let sql = `SELECT deleted from user WHERE
                    id = \'${id}'`;
        const connection = await mysql.createConnection(info.config);

        var data = await connection.query(sql);

        if(data.length == 0){
            throw {message:'user not found in the database', status: 400};
        } else if (data[0].deleted == 1) {
            throw {message:'account already deleted in the database', status: 400}
        } else if (data[0].deleted == 0){
        sql = `UPDATE user 
                   SET deleted = true
                   WHERE id = \'${id}'`;
        connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Record is deleted!");
          });
        } 
        await connection.end();
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}
