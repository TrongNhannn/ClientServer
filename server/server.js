var express = require('express');
var app = express();
const cors = require("cors");
var bodyparser = require('body-parser');
const { unique_string } = require('./unique_string');
const { apiResolving } = require('./route/api-resolving');

const morgan = require('morgan');
require('dotenv').config();
const { asyncMongo } = require('./Connect/conect');

app.use(bodyparser.urlencoded({
    limit: "50mb",
    extended: false,
}));

const { MongoClient } = require('mongodb');

const uri = `${process.env.DB_CONNECTSTRING}/${process.env.DB_NAME_MONGO}`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect()
  .then(() => console.log(`Kết nối thành công tới cơ sở dữ liệu MongoDB: ${process.env.DB_NAME_MONGO}`))
  .catch((err) => console.error(`Lỗi kết nối tới cơ sở dữ liệu MongoDB: ${process.env.DB_NAME_MONGO}`, err));







app.use( express.static('public') );

app.use(bodyparser.json({ limit: "50mb" }));


var login = require('./route/rLogin');
var user = require('./route/rUser');


// var field = require('./route/table/rField');


var api = require('./route/apis');
var json = require('./route/importjson')

app.get('/api/get/the/god/damn/api/key/with/ridiculous/long/url/string', (req, res) => {
  res.send({ unique_string })
})

//Middleware
const Auth = require('./Middleware/Auth');
const { project_status } = require('./mongo/tables');
app.use(cors());
//Token
//Login
app.use(`/${unique_string}`, login);
//Middleware
//app.use(Auth.verifyToken);
//User
app.use(`/api/${unique_string}/user`, user);

app.use(`/api/${unique_string}/apis`, api);
app.use(`/api/${unique_string}/json`, json)

app.use( async (req, res, next) => {
    const { url } = req;

    const splitted = url.split('/')[4]
    const dbo = await asyncMongo()
    const api = await new Promise( (resolve, reject) => {
        dbo.collection('apis').findOne({ "url.id_str": splitted, "method": req.method.toLowerCase() }, (err, result) => {
            resolve( result )
        })
    });

    if( api && api.status ){
        const data = await apiResolving(req, api);
        console.log(`${req.method} 200 - http://127.0.0.1:${process.env.PORT}${url}`)
        res.status(200).send(data)
    }else{
        console.log(`${req.method} 404 - http://127.0.0.1:${process.env.PORT}${url}`)
        res.status(404).send({ success: false, content: "404 page not found" })
    }
})

var server = app.listen(process.env.PORT, function () {
  console.log('Server listening on port ' + server.address().port);
});




