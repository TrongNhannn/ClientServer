export default (state, action) => {
    switch (action.type) {

        case "sessionInitialize":
            return sessionInitialize(state, action);
        break;

        case "setNavBarHighLight":
            return setNavBarHighLight(state, action)
            break;


        case "setNavState":
            // localStorage.setItem('navState', navState)
            return setNavState(state, action);
            break;
        case "initializedUserInfo":
            return initializedUserInfo( state, action );
            break;

        case "setAddConstraintBox":
            return {...state, addConstraintBox: !state.addConstraintBox }
            break;
        case "setAddApiBox":
            return {...state, addApi: !state.addApi, apiAddFilter: action.payload.filter }

        case "setDefaultField":
            return setDefaultField( state, action )
            break;
        case "setCurrentCollection":
            return {...state, collection: action.payload.collection, collections: action.payload.collections }
            break;
        case "addApiToCollectionFunc":
            return { ...state, functions: { ...state.functions, addApiToCollection: action.payload.addApiToCollection, collections: action.payload.collections } }
            break;

        case "setFloatingForm":
            return setFloatingForm( state, action );
            break;

        case "modifyPageParam":
            return modifyPageParam(state, action);
            break;
        case "setUIPages":
            return setUIPages(state, action);
            break;
            
        default:
            return state;
    }
}

const sessionInitialize = ( state, action ) => {
    const { auth } = action.payload;
    return { ...state, auth }
}


const setNavBarHighLight = ( state, action ) => {
    const { url_id } = action.payload;
    return { ...state, highlight: url_id }
}

const setNavState = ( state, action ) => {
    const { navState } = action.payload;
    return { ...state, navState }
}

const initializedUserInfo = ( state, action ) => {
    const { info } = action.payload;
    return { ...state, auth: { ...info, ...state.auth } }
}

const setDefaultField = ( state, action ) => {
    const { defaultField } = action.payload;
    return { ...state, defaultField }
}

const setFloatingForm = ( state, action ) => {
    const { form, status } = action.payload;
    const { floatingForms } = state;
    floatingForms[form] = status;

    return { ...state, floatingForms }
}


const modifyPageParam = ( state, action ) => {
    const { func } = action.payload;
    const { functions } = state;
    functions.modifyPageParam = func;
    return { ...state, functions }
}

const setUIPages = (state, action) => {
    const { pages } = action.payload;
    return { ...state, pages }
} 