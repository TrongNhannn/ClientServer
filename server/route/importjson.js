var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const { mongo, asyncMongo } = require('../Connect/conect');
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const uri = process.env.DB_CONNECTSTRING
const dbName = process.env.DB_NAME_MONGO;


// const filePath = 'dipesconfig/data.json';
// const jsonString = fs.readFileSync(filePath, 'utf-8');
//const jsonString = `{"data":{"tables":[{"_id":"6434b39d89264444045b3c11","table_id":0,"version_id":0,"table_name":"Người dùng","table_alias":"id1681175453161","create_by":{"_id":"6434b36489264444045b3c09","account_string":"su","account_role":"su","fullname":"Tô Trọng Nhân","email":"nhan@gmail.com","phone":"03596955","address":"Trà vinh","credential_string":"hihi1681175396706","account_status":1,"avatar":"/assets/image/icon.png","_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVkZW50aWFsX3N0cmluZyI6ImhpaGkxNjgxMTc1Mzk2NzA2IiwiaWF0IjoxNjgxMTc1NDA5LCJleHAiOjE2ODExNzkwMDl9.Oif0fNnfIn_ukDNBkfADw6bGfD5Qd7m8m0IixcaAqyI","role":"su"},"create_on":"2023-04-11T01:10:53.161Z","status":1,"pk":["id1681175473223"],"fk":[],"unique":[],"check":[]},{"_id":"6434b3a389264444045b3c12","table_id":1,"version_id":0,"table_name":"Sản phẩm","table_alias":"id1681175459154","create_by":{"_id":"6434b36489264444045b3c09","account_string":"su","account_role":"su","fullname":"Tô Trọng Nhân","email":"nhan@gmail.com","phone":"03596955","address":"Trà vinh","credential_string":"hihi1681175396706","account_status":1,"avatar":"/assets/image/icon.png","_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVkZW50aWFsX3N0cmluZyI6ImhpaGkxNjgxMTc1Mzk2NzA2IiwiaWF0IjoxNjgxMTc1NDA5LCJleHAiOjE2ODExNzkwMDl9.Oif0fNnfIn_ukDNBkfADw6bGfD5Qd7m8m0IixcaAqyI","role":"su"},"create_on":"2023-04-11T01:10:59.154Z","status":1,"pk":["id1681175509145"],"fk":[],"unique":[],"check":[]},{"_id":"6434b3a989264444045b3c13","table_id":2,"version_id":0,"table_name":"Hóa đơn","table_alias":"id1681175465664","create_by":{"_id":"6434b36489264444045b3c09","account_string":"su","account_role":"su","fullname":"Tô Trọng Nhân","email":"nhan@gmail.com","phone":"03596955","address":"Trà vinh","credential_string":"hihi1681175396706","account_status":1,"avatar":"/assets/image/icon.png","_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVkZW50aWFsX3N0cmluZyI6ImhpaGkxNjgxMTc1Mzk2NzA2IiwiaWF0IjoxNjgxMTc1NDA5LCJleHAiOjE2ODExNzkwMDl9.Oif0fNnfIn_ukDNBkfADw6bGfD5Qd7m8m0IixcaAqyI","role":"su"},"create_on":"2023-04-11T01:11:05.664Z","status":1,"pk":["id1681175539687"],"fk":[{"table_alias":"id1681175453161","fks":[{"field_alias":"id1681175552141","ref_on":"id1681175473223"}]},{"table_alias":"id1681175459154","fks":[{"field_alias":"id1681175559632","ref_on":"id1681175509145"}]}],"unique":[],"check":[]}],"fields":[{"_id":"6434b3b189264444045b3c15","field_name":"Mã người dùng","table_id":0,"version_id":0,"field_alias":"id1681175473223","nullable":true,"data_type":"VARCHAR","props":{"LENGTH":255},"default_value":"","value_control":null,"field_id":0},{"_id":"6434b3b789264444045b3c16","field_name":"Tên người dùng","table_id":0,"version_id":0,"field_alias":"id1681175479486","nullable":true,"data_type":"VARCHAR","props":{"LENGTH":255},"default_value":"","value_control":null,"field_id":1},{"_id":"6434b3bf89264444045b3c17","field_name":"Địa chỉ","table_id":0,"version_id":0,"field_alias":"id1681175487230","nullable":true,"data_type":"VARCHAR","props":{"LENGTH":255},"default_value":"","value_control":null,"field_id":2},{"_id":"6434b3d589264444045b3c18","field_name":"Mã sản phẩm","table_id":1,"version_id":0,"field_alias":"id1681175509145","nullable":true,"data_type":"VARCHAR","props":{"LENGTH":255},"default_value":"","value_control":null,"field_id":3},{"_id":"6434b3e089264444045b3c19","field_name":"Tên sản phẩm","table_id":1,"version_id":0,"field_alias":"id1681175520791","nullable":true,"data_type":"VARCHAR","props":{"LENGTH":255},"default_value":"","value_control":null,"field_id":4},{"_id":"6434b3f389264444045b3c1a","field_name":"Mã hóa đơn","table_id":2,"version_id":0,"field_alias":"id1681175539687","nullable":true,"data_type":"VARCHAR","props":{"LENGTH":255},"default_value":"","value_control":null,"field_id":5},{"_id":"6434b40089264444045b3c1b","field_name":"Mã người dùng","table_id":2,"version_id":0,"field_alias":"id1681175552141","nullable":true,"data_type":"VARCHAR","props":{"LENGTH":255},"default_value":"","value_control":null,"field_id":6},{"_id":"6434b40789264444045b3c1c","field_name":"Mã sản phẩm","table_id":2,"version_id":0,"field_alias":"id1681175559632","nullable":true,"data_type":"VARCHAR","props":{"LENGTH":255},"default_value":"","value_control":null,"field_id":7}],"ids":[{"_id":"6434b37789264444045b3c0a","name":"project_id","id":1},{"_id":"6434b37789264444045b3c0c","name":"task_id","id":1},{"_id":"6434b37789264444045b3c0e","name":"version_id","id":1},{"_id":"6434b39d89264444045b3c10","name":"table_id","id":3},{"_id":"6434b3b189264444045b3c14","name":"field_id","id":8}]}}`;
async function importData(jsonString) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        const data = JSON.parse(jsonString).data;
        // Kiểm tra và xóa dữ liệu 
        
        if (await db.collection('tables').countDocuments() > 0) {
            await db.collection('tables').deleteMany({});
        }
        if (await db.collection('fields').countDocuments() > 0) {
            await db.collection('fields').deleteMany({});
        }
        if (await db.collection('ids').countDocuments() > 0) {
            await db.collection('ids').deleteMany({});
        }
     
        await db.collection('tables').insertMany(data.tables);
        await db.collection('fields').insertMany(data.fields);
        await db.collection('ids').insertMany(data.ids);

        console.log('Data imported successfully!');
    } catch (err) {
        console.error('Error importing data:', err);
    } finally {
        await client.close();
    }
}

async function importAPI(jsonString) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        const data = JSON.parse(jsonString).data;
        if (await db.collection('apis').countDocuments() > 0) {
            await db.collection('apis').deleteMany({});
        }
        await db.collection('apis').insertMany(data.apis);
        console.log('Data imported successfully!');
    } catch (err) {
        console.error('Error importing data:', err);
    } finally {
        await client.close();
    }
}
router.post('/import', async (req, res) => {
    try {
        const jsonString = JSON.stringify(req.body);
        await importData(jsonString);
        res.status(200).send('Data imported successfully');
    } catch (err) {
        console.error('Error importing data:', err);
        res.status(500).send('Error importing data');
    }

});

router.post('/import-api', async (req, res) => {

    try {
        const jsonString = JSON.stringify(req.body);
        await importAPI(jsonString);
        res.status(200).send('Data imported successfully');
    } catch (err) {
        console.error('Error importing data:', err);
        res.status(500).send('Error importing data');
    }

});
module.exports = router;
