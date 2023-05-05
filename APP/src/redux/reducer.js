import proxy from '../APP_API';
import navbarLinks from '../cpn/navbar/navbar-links';
import functions from './functions';
import defaultBranch from './router/defaultBranch';
import branchAlert from './router/alert';
import Alert from './alert';
import Confirm from './confirm';
import database from './router/database';
import api from './router/api';

import datatypes from './field-props';

// import pages from '../dipe-configs/ui.json';

const initState = {
    highlight: 0,
    navState: true,
    unique_string: "dipev1",
    defaultImage: "/assets/image/icon.png",
    proxy,
    navbarLinks,
    functions,
    Alert,
    Confirm,
    datatypes,
    // pages: pages.pages,
    pages: [],
    database: {
        tables: [],
        fields: [],
        currentTable: {},
        currentField: {},
    },

    api: {
        apis: [],
        currentApi: {},
        currentSelectedTables: [],
        currentParams: [],
        currentFields: [],
        currentCustomFields: [],
    },

    floatingForms: {

    },

    auth: {
        credential_string: localStorage.getItem('credential_string'),
        _token: localStorage.getItem('_token'),
        role: localStorage.getItem('role'),        
    },

    alert: {
        fired: false,
        type: "success",
        label: "Thành công",
        message: "Cập nhật thành công nhe quí dị!",
    },
    confirm: {
        fired: false,
        label: "Chờ đã",
        message: "Thay đổi này có thể dẫn đến lỗi hoặc một điều gì đó không thể đoán trước!",
        func: () => {},
        defaultValue: "",
    },

    selectedConstraint: {

    }
}

export default ( state = initState, action ) => {
    switch (action.branch) {
        case "db":
            return database( state, action );
            break;

        case "api":
            return api( state, action );
            break;

        case "alert":
            return branchAlert( state, action );
            break;

        default:
            return defaultBranch(state, action);
            break;
    }
}
