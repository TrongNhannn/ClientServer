export default (state, action) => {
    switch (action.type) {

        case "initializeData":
            return initializeData( state, action );
        break;

        case "createTable":
            return createTable( state, action );
            break;

        case "setCurrentTable":
            return setCurrentTable( state, action );
            break;

        case "destroyCurrentTable":
            return destroyCurrentTable(state, action);
            break;

        case "setCurrentField":
            return setCurrentField( state, action );
            break;

        case "destroyCurrentField":
            return destroyCurrentField(state, action);
            break;

        case "tableChange":
            return tableChange( state, action );
            break;

        case "dropTable":
            return dropTable( state, action );
            break;

        case "createField":
            return createField( state, action );
            break;

        case "dropField":
            return dropField( state, action );
            break;

        case "fieldChange":
            return fieldChange( state, action );
            break;

        case "setSelectedConstraint":
            return setSelectedConstraint( state, action );
            break;

        case "cascadingUpdateFields":
            return cascadingUpdateFields( state, action );
            break;

        default:
            return state;
    }
}


const initializeData = ( state, action ) => {
    const { tables, fields, project, version } = action.payload;
    const database = { tables, fields }
    return { ...state, database, project, version }
}

const createTable = ( state, action ) => {
    const { table } = action.payload;
    const { database } = state;
    const { tables } = database;
    let newTables;
    if( tables ){
        newTables = [ table, ...tables ]
    }else{
        newTables = [ table ]
    }

    database.tables = newTables;
    return {...state, database };
}

const setCurrentTable = ( state, action ) => {
    const { table } = action.payload;
    const { database } = state;
    database.currentTable = table;
    return { ...state, database }
}

const setCurrentField = ( state, action ) => {
    const { field } = action.payload;
    const { database } = state;
    database.currentField = field;
    return { ...state, database }
}

const destroyCurrentTable = (state, action) => {
    const { database } = state;
    delete database.currentTable;
    delete database.currentField;
    return { ...state, database }
}

const destroyCurrentField = (state, action) => {
    const { database } = state;
    delete database.currentField;
    return { ...state, database }
}

const tableChange = ( state, action ) => {
    const { table } = action.payload;
    const { database } = state;
    const { tables } = database;
    const newTables = tables.map( tb => {
        if( tb.table_id === table.table_id){
            return table
        }else{
            return tb
        }
    })
    database.tables = newTables;
    database.currentTable = table;
    return { ...state, database }
}

const dropTable = ( state, action ) => {
    const { table } = action.payload;
    const { database } = state;
    const { tables, fields } = database;

    const newTables = tables.filter( tb => tb.table_id != table.table_id );
    const newFields = fields.filter( fd => fd.table_id != table.table_id );
    /* Xoá bảng xoá luôn trường của bảng */
    /* Gòi còn xoá ràng buộc khoá ngoại nữa mà để nữa làm sau */
    database.tables = newTables;
    database.fields = newFields;
    return { ...state, database }
}

const createField = ( state, action ) => {
    const { field } = action.payload;
    const { database } = state;
    const { fields } = database;
    let newFields;
    if( fields ){
        newFields = [ ...fields, field ]
    }else{
        newFields = [ field ]
    }

    database.fields = newFields;
    return {...state, database };
}

const dropField = ( state, action ) => {
    const { field } = action.payload;
    const { database } = state;
    const { fields } = database;

    const newFields = fields.filter( fd => fd.field_id != field.field_id );
    database.fields = newFields;
    return { ...state, database }
}

const fieldChange = ( state, action ) => {
    const { values } = action.payload;
    const { database } = state;
    const { fields } = database;
    const field = database.currentField
    for( let i = 0; i < values.length ; i++ ){
        const { prop, value } = values[i]
        field[prop] = value;
    }

    const newFields = fields.map( fd => {
        if( fd.field_id === field.field_id){
            return field
        }else{
            return fd
        }
    })
    database.fields = newFields;
    database.currentField = field;
    return { ...state, database: { ...database, currentField: { ...field } } }
}

const setSelectedConstraint = ( state, action ) => {
    const { constraint } = action.payload;

    return { ...state, selectedConstraint: { ...constraint, type: constraint.value } }
}

const cascadingUpdateFields = ( state, action ) => {
    const { newFields, fk } = action.payload;
    const { database } = state;
    const { fields, currentTable, tables } = database;

    const updatedFields = fields.map( field => {
        const { field_alias } = field;
        const filtedField = newFields.filter( f => f.field_alias == field_alias )[0];
        if( filtedField != undefined ){
            return { ...field, ...filtedField }
        }else{
            return field
        }
    })

    currentTable.fk = fk;
    const newTables = tables.map( tb => {
        if( tb.table_id == currentTable.table_id ){
            return currentTable;
        }else{
            return tb;
        }
    })
    database.currentTable = currentTable;
    database.fields = updatedFields;
    return { ...state, database };
}
