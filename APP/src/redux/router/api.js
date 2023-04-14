export default (state, action) => {
    switch (action.type) {
        case "initializeData":
            return initializeData( state, action )
            break;

        case "setCurrentMethod":
            return setCurrentMethod( state, action )
            break;

        case "addApi":
            return addApi( state, action );
            break;

        case "setCurrentApi":
            return setCurrentApi( state, action );
            break;
        case "destroyCurrentApi":
            return destroyCurrentApi( state, action );
            break;

        case "editCurrentApi":
            return editCurrentApi( state, action );
            break;

        case "setCurrentSelectedTables":
            return setCurrentSelectedTables(state, action);
            break;

        case "setSelectedParams":
            return setSelectedParams(state, action);
            break;

        case "setSelectedFields":
            return setSelectedFields(state, action);
            break;

        case "setCurrentCustomFields":
            return setCurrentCustomFields(state, action);
            break;

        case "setSelectedFieldAlias":
            return setSelectedFieldAlias( state, action );
            break;

        case "removeFromSelectedFields":
            return removeFromSelectedFields( state, action );
            break;

        case "dropApi":
            return dropApi( state, action );
            break;

        default:
            return state;
    }
}

const initializeData = (state, action) => {
    const { apis } = action.payload;
    const { api } = state;
    api.apis = apis;
    return { ...state, api }
}

const setCurrentMethod = ( state, action ) => {
    const { method } = action.payload;
    const { api } = state;
    api.currentMethod = method;

    return {...state, api }
}

const addApi = ( state, action ) => {
    const { newApi } = action.payload;
    const { api } = state;
    api.apis = [ ...api.apis, newApi ];

    return { ...state, api };
}

const setCurrentApi = ( state, action ) => {
    const { selectedApi } = action.payload;
    const { api } = state;
    console.log(selectedApi)
    api.currentApi = selectedApi;
    api.currentSelectedTables = selectedApi.tables;
    api.currentFields = selectedApi.fields;
    api.currentParams = selectedApi.params;
    api.currentCustomFields = selectedApi.custom;
    console.log(api)
    return { ...state, api: { ...api } };
}

const destroyCurrentApi = ( state, action ) => {
    const { api } = state;
    api.currentApi = {};
    return { ...state, api };
}

const editCurrentApi = ( state, action ) => {
    const { newApi } = action.payload;
    const { api } = state;
    const { apis } = api;

    const newApis = apis.map( a => {
        if( a.url.id_str == newApi.url.id_str ){
            return newApi
        } else{
            return a
        }
    })
    api.currentApi = newApi;
    api.apis = newApis;

    return { ...state, api };
}

const setCurrentSelectedTables = (state, action) => {
    const { sTables } = action.payload;
    const { api } = state;
    api.currentSelectedTables = sTables;
    return { ...state, api }
}

const setSelectedParams = ( state, action ) => {
    const { params } = action.payload;
    const { api } = state;
    api.currentParams = params;
    return { ...state, api }
}

const setSelectedFields = ( state, action ) => {
    const { fields } = action.payload;
    const { api } = state;
    api.currentFields = fields;
    return { ...state, api }
}

const setSelectedFieldAlias = ( state, action ) => {
    const { field, alias } = action.payload;
    const { api } = state;
    const { currentFields } = api;

    const newCurrentFields = currentFields.map( f => {
        if( f.field_alias == field.field_alias ){
            f.fomular_alias = alias;
        }
        return f;
    })
    api.currentFields = newCurrentFields;
    return { ...state, api }
}


const setCurrentCustomFields = (state, action) => {
    const { fields } = action.payload;
    const { api } = state;
    api.currentCustomFields = fields;
    return { ...state, api }
}

const removeFromSelectedFields = (state, action) => {
    const { field } = action.payload;
    const { api } = state;
    const { currentFields } = api;
    const newCurrentFields = currentFields.filter( f => f.field_alias != field.field_alias );
    api.currentFields = newCurrentFields;
    return { ...state, api }
}

const dropApi = (state, action) => {
    const { dropApi } = action.payload;

    const { api }   = state;
    const { apis }  = api;
    const newApis   = apis.filter( a => a.url.id_str != dropApi.url.id_str );
    api.apis = newApis;

    return { ...state, api }
}
