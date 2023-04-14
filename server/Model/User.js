// var db = require('../Connect/Dbconnection');
const { mongo } = require('../Connect/conect');
const tables = require('../mongo/tables');

var Login ={

    // user_login:function({account_string,pwd_string},callback){
    //     const isPasswordValid = bcrypt.compare(pwd_string, existingUser[0].pwd_string);
    //     return db.query(`
    //         CALL user_login('${ account_string }', '${ isPasswordValid }')
    //     `,callback);
    // },

    getAllUser:function(callback){
        mongo( dbo => {
            dbo.collection( tables.accounts ).find({}).toArray( (err, result) => {
                callback(err, result);
            })
        })
	},

    getUserById:function(credential_string, callback){
        mongo( dbo => {
            dbo.collection( tables.accounts ).find({ credential_string }).toArray( (err, result) => {
                callback(err, result);
            })
        })
	},
    getUser_detail:function(credential_string, callback){
        mongo( dbo => {
            dbo.collection( tables.accounts ).find({ credential_string }).toArray( (err, result) => {
                if( result.length > 0 ){
                    delete result[0].hashedPassword;
                    delete result[0].pwd_string;
                }
                callback(err, result);
            })
        })
	},
    // addUser:function({account_string, pwd_string},callback){
    //  const role = "admin";

    //  const passwordHash = bcrypt.hashSync(pwd_string, 10);
	// 	return db.query(`
    //         CALL account_add('${ account_string }', '${ passwordHash }', '${ role }')
    //     `,callback);
	// },

    // activeUser:function({credential_string, account_status}, callback){
    //     return db.query(`
    //         CALL user_activation('${ credential_string }', '${ account_status }')
    //     `,callback);
    // },
    //
    // user_change_password:function({credential_string, pwd_string},callback){
    //     return db.query (`
    //     CALL user_change_password('${ credential_string }', '${pwd_string }');
    //     `,callback);
    // },
    //
    // user_change_info:function({credential_string,fullname,email,phone,address},callback){
    //     return db.query (`
    //     CALL user_change_info('${ credential_string}' ,'${fullname}','${email}','${phone}','${address }');
    //     `,callback);
    // },
    // delete_user:function({credential_string},callback){
    //     return db.query(`
    //     call is_account_existed('${credential_string}')
    //     `,callback);
    // },
};

 module.exports=Login;
