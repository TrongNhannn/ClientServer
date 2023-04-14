export default (state, action) => {
    switch (action.type) {

        case "alertFire":
            return alertFire( state, action )
            break;
        case "confirmFire":
            return confirmFire( state, action );
            break;
        default:
            return alertOut( state, action )
            break;
    }
}


const alertFire = ( state, action ) => {
    const { type, message, label } = action.payload;
    const fired = true;
    return { ...state, alert: { fired, type, message, label } }
}

const confirmFire = ( state, action ) => {
    const { type, label, message, func, defaultValue, collection } = action.payload;
    const fired = true;
    return { ...state, confirm: { type, fired, label, message, func, defaultValue, collection } }
}

const alertOut = ( state, action ) => {
    const { alert, confirm } = state;
    return { ...state, alert: { ...alert, fired: false }, confirm: { ...confirm, fired: false } }
}
