const { mongo, asyncMongo } = require('../Connect/conect');
const { id, intValidate } = require('../module/modulars');

const {
    getAndUpdateCurrentID,
    getCurrentID,
    makePattern
} = require('../module/id-manipulation');

const Tables  = require('../mongo/tables');

/*========================== GLOBAL VARIABLES =================================*/
const INT_FAMILY = [ "INT" ,"BIG INT" ,"INT UNSIGNED" ,"BIG INT UNSIGNED" ]


/*============================== FUNCTIONS ====================================*/

const IS_INT_FAMILY = (type) => {
    return INT_FAMILY.indexOf(type) == -1 ? false : true
}

const removeDuplicate = ( data ) => {

    const uniqueArray = data.filter((value, index) => {
        const _value = JSON.stringify(value);
        return index === data.findIndex(obj => {
            return JSON.stringify(obj) === _value;
        });
    });
    return uniqueArray
}


const isForeignKey = ( tables, field ) => {
    const valid = false;

    const tbExisted = tables.filter( tb => {
        const { fk } = tb;
        const fksExisted = fk.filter( key => {
            const { table_alias, fks } = key;
            const kExists = fks.filter( k => k.field_alias == field.field_alias )[0];

            return kExists ? true : false
        })[0]
        return fksExisted ? true : false
    })[0]

    return tbExisted ? true : false
}



/*============================== GET ====================================*/
const getRequest  = async ( req, api ) => {
    const dbo = await asyncMongo()
    const { version_id, api_name, tables, params, custom } = api;
    let paramQueries = [];

    if( params.length > 0 ){
        const formatedUrl = req.url.replaceAll('//', '/')
        const splittedURL = formatedUrl.split('/')
        const paramValues = splittedURL.slice(5) /* Lấy dữ liệu đối số từ vị trí thứ 5 trở đi */

        let paramsValid = true;
        paramQueries = params.map( (par, index) => {
            const query = {}
            query[ par.field_alias ] = paramValues[index];
            if( paramValues[index] == '' ){
                paramsValid = false;
            }
            return { table_id: par.table_id, query }
        })
        if( paramValues.length < params.length || !paramsValid ){
            return { api_name, data: [] }
        }
    }

    const apiFields  = api.fields;

    const dbFields = await new Promise((resolve, reject) => {
        dbo.collection( Tables.fields ).find({ version_id }).toArray( (err, result) => {
            resolve( result )
        })
    })

    const rawData = []

    for( let i = 0; i < tables.length; i++ ){
        const table = tables[i];
        const queriesDataFromParams = paramQueries.filter( tb => tb.table_id == table.table_id );

        let query = {}
        for( let j = 0; j < queriesDataFromParams.length; j++ ){
            query = { ...query, ...queriesDataFromParams[j].query }
        }

        const { table_alias, table_name, pk, fk } = table;
        const data = await new Promise( (resolve, reject) => {
            dbo.collection( table_alias ).find(query).toArray( (err, result) => {
                resolve( result )
            })
        });
        rawData.push({ table_alias, table_name, pk, fk, data })
    }

    rawData.sort( (a, b) => a.data.length > b.data.length ? 1 : -1 )

    let mergedRawData = rawData[0].data;
    for( let i = 1; i < rawData.length; i++ ){ /* Loop over the whole raw data collection */
        const newMergedData = [];
        const currentData = rawData[i].data;
        for( let j = 0; j < mergedRawData.length; j++ ){
            for( let h = 0; h < currentData.length; h++ ){
                newMergedData.push( { ...mergedRawData[j], ...currentData[h] } )
            }
        }
        mergedRawData = newMergedData
    }

    let filteringData = removeDuplicate( mergedRawData );
    for( let i = 0; i < rawData.length; i++ ){
        const { table_alias, table_name, pk, fk } = rawData[i];
        if( fk.length ){
            fk.map( key => {
                const { table_alias, fks } = key;
                const isThisTableSelected = rawData.filter( tb => tb.table_alias == table_alias )[0];
                if( isThisTableSelected ){
                    fks.map( k => {
                        const { field_alias, ref_on } = k;
                        filteringData = filteringData.filter( row => row[field_alias] == row[ref_on] )
                    })
                }
            })
        }
    }

    const fomularFields = apiFields.filter(( field ) => field.fomular_alias != undefined );
    fomularFields.sort( (a, b) => a.fomular_alias.length > b.fomular_alias.length ? -1: 1 );

    for( let i = 0 ; i < custom.length ; i++ ){
        const { fomular, field_alias } = custom[i];
        const fieldAlias = custom[i].field_alias;
        filteringData.map( data => {
            let rawFomular = fomular;
            for( let j = 0; j < fomularFields.length; j++ ){
                const { fomular_alias, field_alias } = fomularFields[j];
                rawFomular = rawFomular.replaceAll(fomular_alias, data[field_alias])
            }
            data[fieldAlias] = eval( rawFomular );
        })
    }

    const finalData = []
    const visibleFields = [ ...apiFields, ...custom ]
    for( let i = 0 ; i < filteringData.length; i++ ){
        const row = filteringData[i]
        const filtedRow = {}
        for( let j = 0; j < visibleFields.length; j++ ){
            const { field_alias, data_type, props } = visibleFields[j]
            if( data_type == 'BOOL' ){
                const { IF_TRUE, IF_FALSE } = props;
                filtedRow[ field_alias ] = row[ field_alias ] ? IF_TRUE : IF_FALSE;
            }else{
                filtedRow[ field_alias ] = row[ field_alias ]
            }
        }
        finalData.push( filtedRow )
    }

    return { api_name, fields: [...apiFields, ...custom], data: finalData }
}


/*============================== POST ====================================*/
const postRequest  = async ( req, api ) => {
    const { data } = req.body;

    const { version_id, tables } = api;

    const apiFields  = api.fields;
    const tearedObjects = [];

    const dbo = await asyncMongo()
    const dbFields = await new Promise((resolve, reject) => {
        dbo.collection( Tables.fields ).find({ version_id }).toArray( (err, result) => {
            resolve( result )
        })
    })

    for( let i = 0; i < tables.length ; i++ ){
        const table = tables[i]
        const { fk, pk } = table;

        if( fk.length != 0 ){
            for( let j = 0 ; j < fk.length; j++){
                const { fks } = fk[j];
                for( let h = 0; h < fks.length; h++ ){
                    const { field_alias, ref_on } = fks[h];
                    const isPrimaryTableInCharge = tables.filter( tb => tb.pk.indexOf( ref_on ) != -1 )[0];
                    if( isPrimaryTableInCharge ){
                        data[ field_alias ] = data[ ref_on ]
                    }
                }
            }
        }
    }

    for( let i = 0 ; i < tables.length; i++ ){
        const table = tables[i]
        const { table_id, table_alias, table_name } = table;
        const fields = dbFields.filter( field => field.table_id == table_id );
        // console.log(`\n${ table_id } - ${ table_name }: `)
        // console.log(fields.map(f => `${f.field_name} - ${ f.field_alias }`))

        const piece = {}

        for( let j = 0 ; j < fields.length; j++){
            const { field_alias, default_value, props, data_type } = fields[j];
            if( IS_INT_FAMILY(data_type) && props.AUTO_INCREMENT && !isForeignKey( tables, fields[j] ) ){
                const currentId = await getAndUpdateCurrentID( field_alias );
                piece[ field_alias ] = makePattern( currentId, props.PATTERN );
            }else{
                piece[ field_alias ] = data[ field_alias ] ? data[ field_alias ] : default_value;
            }
        }
        tearedObjects.push({ table_alias, table_name, data: piece })
    }



    for( let i = 0; i < tearedObjects.length; i++ ){
        const piece = tearedObjects[i];
        const { table_alias, data } = piece;
        const table = tables.filter( tb => tb.table_alias == table_alias )[0];
        const { fk } = table;

        for( let j = 0; j < fk.length; j++ ){
            const foreignAlias = fk[j].table_alias;
            const keys = fk[j].fks;
            const foreignPiece = tearedObjects.filter( obj => obj.table_alias == foreignAlias )[0];
            if( foreignPiece ){
                const foreignData = foreignPiece.data;

                for( let h = 0; h < keys.length; h++ ){
                    const { field_alias, ref_on } = keys[h]
                    data[ field_alias ] = foreignData[ref_on]
                }
            }

        }
        tearedObjects[i] = { table_alias, data }
    }

    const primaryConstraints = tables.map( table => {
        const { table_alias, table_name, pk } = table;
        const piece = tearedObjects.filter( data => data.table_alias == table_alias )[0].data;
        const primaryKey = {};
        for( let i = 0; i < pk.length; i++ ){
            const alias = pk[i];
            primaryKey[ alias ] = piece[ alias ]
        }
        return { table_alias, table_name, query: primaryKey }
    })

    const foreignConstraints = tables.map( table => {
        const { table_name, fk } = table;
        const tableAlias = table.table_alias
        const piece = tearedObjects.filter( data => data.table_alias == tableAlias )[0].data;
        const foreignKey = [];

        for( let i = 0; i < fk.length; i++ ){
            const { table_alias, fks } = fk[i];
            const isThisTableSelected = tables.filter( tb => tb.table_alias == table_alias )[0];
            if( isThisTableSelected == undefined ){
                const key = { table_alias, query: {} }
                for( let j = 0; j < fks.length; j++ ){
                    const { ref_on, field_alias } = fks[j]
                    key.query[ref_on] = piece[ field_alias ]
                }
                foreignKey.push( key )
            }
        }

        return { table_alias: tableAlias, table_name, queries: foreignKey }
    })
    // console.log("\nTEARED OBJECTS")
    // console.log( tearedObjects )
    //
    // console.log("\nPRIMARIES")
    // console.log( primaryConstraints )


    let primaryConflict = false;
    const conflictPriTables = []
    for( let i = 0 ; i < primaryConstraints.length; i++ ){
        const { table_alias, table_name, query } = primaryConstraints[i]
        const isExisted = await new Promise((resolve, reject) => {
            dbo.collection( table_alias ).findOne({...query}, (err, result) => {
                resolve( result )
            })
        })
        if( isExisted ){
            conflictPriTables.push( table_name )
            primaryConflict = true;
        }
    }

    if( primaryConflict ){
        return { success: false, data: "Vi phạm khoá chính: " + conflictPriTables.join(', '), type: "fk-error" }
    }else{

        let foreignConflict = false;
        const conflictForeignTables = []
        for( let i = 0 ; i < foreignConstraints.length; i++ ){
            const { table_name, queries } = foreignConstraints[i]
            const currentTableAlias = foreignConstraints[i].table_alias;

            for( let j = 0 ; j < queries.length; j++ ){
                const { table_alias, query } = queries[j];

                const isExisted = await new Promise((resolve, reject) => {
                    dbo.collection( table_alias ).findOne({...query}, (err, result) => {
                        resolve( result )
                    })
                })
                if( !isExisted ){
                    conflictForeignTables.push( table_alias )
                    foreignConflict = true
                }
            }
        }
        if( foreignConflict ){
            return { success: false, data: "", type: "fk-error", fk: foreignConstraints, conflictForeignTables }
        }else{
            for( let i = 0; i < tearedObjects.length ; i++){
                const { table_alias, data } = tearedObjects[i];
                const insertResult = await new Promise((resolve, reject) => {
                    dbo.collection( table_alias ).insertOne( data , (err, result) => {
                        resolve( result )
                    })
                })
            }
            return { success: true, data: "" }
        }
    }
}


/*============================== PUT ====================================*/
const putRequest  = async ( req, api ) => {
    const dbo = await asyncMongo()
    const { version_id, api_name, tables, params, custom } = api;
    const newValue = req.body.data;
    let paramQueries = [];

    if( params.length > 0 && newValue ){ /* Nếu truyền vào newValue = {} có thể lỗi! */
        const formatedUrl = req.url.replaceAll('//', '/')
        const splittedURL = formatedUrl.split('/')
        const paramValues = splittedURL.slice(5) /* Lấy dữ liệu đối số từ vị trí thứ 5 trở đi */

        let paramsValid = true;
        paramQueries = params.map( (par, index) => {
            const query = {}
            query[ par.field_alias ] = paramValues[index];
            if( paramValues[index] == '' ){
                paramsValid = false;
            }
            return { table_id: par.table_id, query }
        })
        if( paramValues.length < params.length || !paramsValid ){
            return { api_name, data: [] }
        }

        const apiFields  = api.fields;

        const dbFields = await new Promise((resolve, reject) => {
            dbo.collection( Tables.fields ).find({ version_id }).toArray( (err, result) => {
                resolve( result )
            })
        })

        const rawData = []

        for( let i = 0; i < tables.length; i++ ){
            const table = tables[i];
            const queriesDataFromParams = paramQueries.filter( tb => tb.table_id == table.table_id );

            let query = {}
            for( let j = 0; j < queriesDataFromParams.length; j++ ){
                query = { ...query, ...queriesDataFromParams[j].query }
            }

            const { table_alias, table_name, pk, fk } = table;
            const data = await new Promise( (resolve, reject) => {
                dbo.collection( table_alias ).find(query).toArray( (err, result) => {
                    resolve( result )
                })
            });
            rawData.push({ table_alias, table_name, pk, fk, data })
        }

        rawData.sort( (a, b) => a.data.length > b.data.length ? 1 : -1 )

        let mergedRawData = rawData[0].data;
        for( let i = 1; i < rawData.length; i++ ){ /* Loop over the whole raw data collection */
            const newMergedData = [];
            const currentData = rawData[i].data;
            for( let j = 0; j < mergedRawData.length; j++ ){
                for( let h = 0; h < currentData.length; h++ ){
                    newMergedData.push( { ...mergedRawData[j], ...currentData[h] } )
                }
            }
            mergedRawData = newMergedData
        }

        let filteringData = removeDuplicate( mergedRawData );

        for( let i = 0; i < rawData.length; i++ ){
            const { table_alias, table_name, pk, fk } = rawData[i];
            if( fk.length ){
                fk.map( key => {
                    const { table_alias, fks } = key;
                    const isThisTableSelected = rawData.filter( tb => tb.table_alias == table_alias )[0];
                    if( isThisTableSelected ){
                        fks.map( k => {
                            const { field_alias, ref_on } = k;
                            filteringData = filteringData.filter( row => row[field_alias] == row[ref_on] )
                        })
                    }
                })
            }
        }

        let foreignKeyUpdateFailure = false;
        const foreignKeys = []
        tables.map( tb => { foreignKeys.push( ...tb.fk ) })

        for( let i = 0 ; i < apiFields.length; i++ ){
            const { field_alias } = apiFields[i];
            const thisFieldFKs = foreignKeys.filter(key => {
                const { fks } = key;
                const isThisFieldExisted = fks.filter( k => k.field_alias == field_alias )[0];
                return isThisFieldExisted ? true : false;
            });
            if( thisFieldFKs.length > 0 ){
                for( let j = 0; j < thisFieldFKs.length; j++ ){
                    const { fks, table_alias } = thisFieldFKs[j];
                    const testData = {}

                    fks.map( key => {
                        const { field_alias, ref_on } = key;
                        testData[ ref_on ] = newValue[field_alias]
                    })
                    const foreignDataExisted = await new Promise( (resolve, reject) => {
                        dbo.collection(table_alias).findOne({...testData}, (err, result) => {
                            resolve( result );
                        })
                    });
                    if( !foreignDataExisted ){
                        foreignKeyUpdateFailure = true
                    }
                }
            }
        }
        if( !foreignKeyUpdateFailure ){
            for( let i = 0; i < filteringData.length; i++){
                const row = filteringData[i];
                for( let j = 0; j < tables.length; j++ ){
                    const table = tables[j]
                    const { pk, table_alias } = table;
                    const query = {};
                    for( let h = 0 ; h < pk.length; h++){
                        const field_alias = pk[h]
                        query[field_alias] = row[field_alias]
                    }
                    const updateResult = await new Promise( (resolve, reject) => {
                        dbo.collection( table_alias ).updateOne({ ...query }, { $set: { ...newValue } },(err, result) => {
                            resolve( result )
                        })
                    });
                }
            }
            return { success: true }
        }else{
            return { success: false, content: "FK CONFLICT" }        }

    }else{
        return { success: false }
    }
}


/*============================== DELETE ====================================*/
const deleteRequest  = async ( req, api ) => {
    const dbo = await asyncMongo()
    const { version_id, api_name, tables, params, custom } = api;

    let paramQueries = [];

    if( params.length > 0 ){
        const formatedUrl = req.url.replaceAll('//', '/')
        const splittedURL = formatedUrl.split('/')
        const paramValues = splittedURL.slice(5) /* Lấy dữ liệu đối số từ vị trí thứ 5 trở đi */

        let paramsValid = true;
        paramQueries = params.map( (par, index) => {
            const query = {}
            query[ par.field_alias ] = paramValues[index];
            if( paramValues[index] == '' ){
                paramsValid = false;
            }
            return { table_id: par.table_id, query }
        })
        if( paramValues.length < params.length || !paramsValid ){
            return { api_name, data: [] }
        }
    }

    const apiFields  = api.fields;

    const dbFields = await new Promise((resolve, reject) => {
        dbo.collection( Tables.fields ).find({ version_id }).toArray( (err, result) => {
            resolve( result )
        })
    })

    const rawData = []

    for( let i = 0; i < tables.length; i++ ){
        const table = tables[i];
        const queriesDataFromParams = paramQueries.filter( tb => tb.table_id == table.table_id );

        let query = {}
        for( let j = 0; j < queriesDataFromParams.length; j++ ){
            query = { ...query, ...queriesDataFromParams[j].query }
        }

        const { table_alias, table_name, pk, fk } = table;
        const data = await new Promise( (resolve, reject) => {
            dbo.collection( table_alias ).find(query).toArray( (err, result) => {
                resolve( result )
            })
        });
        rawData.push({ table_alias, table_name, pk, fk, data })
    }

    rawData.sort( (a, b) => a.data.length > b.data.length ? 1 : -1 )

    let mergedRawData = rawData[0].data;
    for( let i = 1; i < rawData.length; i++ ){ /* Loop over the whole raw data collection */
        const newMergedData = [];
        const currentData = rawData[i].data;
        for( let j = 0; j < mergedRawData.length; j++ ){
            for( let h = 0; h < currentData.length; h++ ){
                newMergedData.push( { ...mergedRawData[j], ...currentData[h] } )
            }
        }
        mergedRawData = newMergedData
    }

    let filteringData = removeDuplicate( mergedRawData );

    for( let i = 0; i < rawData.length; i++ ){
        const { table_alias, table_name, pk, fk } = rawData[i];
        if( fk.length ){
            fk.map( key => {
                const { table_alias, fks } = key;
                const isThisTableSelected = rawData.filter( tb => tb.table_alias == table_alias )[0];
                if( isThisTableSelected ){
                    fks.map( k => {
                        const { field_alias, ref_on } = k;
                        filteringData = filteringData.filter( row => row[field_alias] == row[ref_on] )
                    })
                }
            })
        }
    }
    for( let i = 0; i < filteringData.length; i++){
        const row = filteringData[i];
        for( let j = 0; j < tables.length; j++ ){
            const table = tables[j]
            const { pk, table_alias } = table;
            const query = {};
            for( let h = 0 ; h < pk.length; h++){
                const field_alias = pk[h]
                query[field_alias] = row[field_alias]
            }
            const deleteResult = await new Promise( (resolve, reject) => {
                dbo.collection( table_alias ).deleteOne({ ...query }, (err, result) => {
                    resolve( result )
                })
            });
        }
    }
    return { success: true }
}


/*============================== ROUTES ====================================*/
const apiResolving = async (req, api, callback) => {
    const { method } = api;
    switch ( method ) {
        case "get":
            return getRequest(req, api );
            break
        case "post":
            return postRequest(req, api);
            break;
        case "put":
            return putRequest(req, api);
            break;

        case "delete":
            return deleteRequest(req, api);
            break;
        default:
            return { data: "None can hide" }
            break;
    }
}

module.exports = { apiResolving, getRequest }