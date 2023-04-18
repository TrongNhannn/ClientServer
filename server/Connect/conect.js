var mysql = require('mysql');
require('dotenv').config();
// var conn = mysql.createConnection({
//     host: "127.0.0.1",
//     user: "moc",
//     password: "root",
//     database: "DIPE"

// });

var conn=mysql.createConnection({
    host:'localhost',
    user:'nhan',
    password:'root',
    database:'dipe1'
});


const { MongoClient } = require('mongodb');
const connectionString = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.1/";
const dbName=process.env.DB_NAME_MONGO;

module.exports = {
    mysql: (query, callback) => {
        conn.connect( () => {
            conn.query(query, (err, result, fields) => {
                callback(result)
            })
        })
    },
    mongo: (callback) => {
        MongoClient.connect(connectionString, function(err, db) {
            if (err) throw err;
            const dbo = db.db(dbName);
            callback(dbo);
        })
    },
    asyncMongo: async () => {
        return new Promise(function(resolve, reject) {
            MongoClient.connect(connectionString, function(err, db) {
                if (err) throw err;
                const dbo = db.db(dbName);
                resolve(dbo);
            })
        });
    }
}
