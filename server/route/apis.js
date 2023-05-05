var express = require('express');
const { mongo, asyncMongo } = require('../Connect/conect');

const { v4 } = require('uuid');
const { id, intValidate } = require('../module/modulars');
const { getAndUpdateCurrentID, getCurrentID, makePattern } = require('../module/id-manipulation');
const tables  = require('../mongo/tables');

const { getRequest } = require('./api-resolving');

var router  = express.Router();
//@route GET /api/%unique_string%/apis/api/input/info/:id_str
//@desc Xóa api
//@access Admin & Su

router.get(`/api/input/info/:id_str`, async (req, res) => {
    const { id_str } = req.params;

    const dbo = await asyncMongo()
    const api = await new Promise( (resolve, reject) => {
        dbo.collection(tables.apis).findOne({ "url.id_str": id_str }, (err, result) => {
            resolve( result )
        })
    });

    if( api && api.status ){

        const { version_id } = api;
        const apiTables = api.tables;

        const rawRelTables = await new Promise( (resolve, reject) => {
            dbo.collection(tables.tables).find({ version_id }).toArray((err, result) => {
                resolve( result )
            })
        });

        const relatedTables = rawRelTables.filter( tb => {
            const { table_alias } = tb;
            const isRelated = apiTables.filter( apiTable => {
                const { fk } = apiTable
                const isTableExistInFK = fk.filter( key => key.table_alias == table_alias)[0]
                return isTableExistInFK ? true : false
            })[0]
            return isRelated ? true: false;
        }).filter( tb => {
            const isExistInSelectedTables = apiTables.filter( apiTable => apiTable.table_alias == tb.table_alias )[0];
            return !isExistInSelectedTables ? true: false
        });

    

        const fields = [];
        for( let i = 0; i < api.tables.length; i++ ){
            const { table_id } = api.tables[i];
            const _fields = await new Promise((resolve, reject) => {
                dbo.collection(tables.fields).find({ table_id }).toArray((err, result) => {
                    resolve(result)
                })
            })
            fields.push(..._fields)
        }

        res.status(200).send({ success: true, api, relatedTables, fields })
    }else{
        res.status(404).send({ success: false })
    }
})

router.get('/table/data/:table_alias', async (req, res) => {
    const { table_alias } = req.params;
    const dbo = await asyncMongo()

    const table = await new Promise( (resolve, reject) => {
        dbo.collection( tables.tables ).findOne({ table_alias }, (err, result) => {
            resolve( result )
        })
    });

    if( table ){
        const { table_id, pk } = table;

        const data = await new Promise( (resolve, reject) => {
            dbo.collection( table_alias ).find({}).toArray( (err, result) => {
                resolve( result )
            })
        });

        const fields = await new Promise( (resolve, reject) => {
            dbo.collection( tables.fields ).find({ table_id }).toArray( (err, result) => {
                resolve( result )
            })
        });

        res.status(200).send({ success: true, data, fields, pk })
    }else{
        res.status(404).send({ success: false })
    }
})


router.get('/api/get/auto_increment/:field_alias', async (req, res) => {
    const { field_alias } = req.params;
    const dbo = await asyncMongo()
    const field = await new Promise((resolve, reject) => {
        dbo.collection(tables.fields).findOne({ field_alias }, (err, result) => {
            resolve( result );
        })
    })
    if( field ){

        const currentId = await getCurrentID( field_alias )

        const PATTERN = field.props.PATTERN;
        if( PATTERN.length > 0 ){
            res.status(200).send({ success: true, id: makePattern( currentId, field.props.PATTERN ) })
        }else{
            res.status(200).send({ success: true, id: currentId })
        }
    }else{
        res.status(404).send({ success: false })
    }
})

router.get('/retrive/put/data/:id_str', async (req, res) => {
    const { id_str } = req.params;
    const dbo = await asyncMongo()
    const api = await new Promise((resolve, reject) => {
        dbo.collection( tables.apis ).findOne({ "url.id_str": id_str }, (err, result) => {
            resolve( result )
        })
    })
    if( api ){
        api.params = [];
        api.method = "get";

        const fields = [];
        for( let i = 0; i < api.tables.length; i++ ){
            const { table_id } = api.tables[i];
            const _fields = await new Promise((resolve, reject) => {
                dbo.collection(tables.fields).find({ table_id }).toArray((err, result) => {
                    resolve(result)
                })
            })
            fields.push(..._fields)
        }

        api.fields = fields;

        const data = await getRequest(req, api);
        res.status(200).send(data)
    }else{
        res.status(404).send({ success: false, data: [] })
    }
})

router.get('/id_str/:id_str', (req, res) => {
    const { id_str } = req.params;
    mongo( dbo => {
        dbo.collection('apis').findOne({ "url.id_str": id_str }, (err, result) => {
            const api = result;
            if( api ){                
                res.status(200).send({ success: true, api })
                
            }else{
                res.status(404).send({ success: false, content: "404 page not found" })
            }
        })
    })
})



module.exports = router;