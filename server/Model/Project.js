const { mongo, asyncMongo } = require('../Connect/conect');
const { tables } = require('../mongo/tables');

class Project {
    constructor( project ) {
        const {
            project_id,
            project_code,
            project_name,
            project_master,
            description,
            create_on,
            project_status,
            active,
            partners,
            users,
        } = project;

        this.project_id     = project_id;       /* INT AUTO INCRE */
        this.project_code   = project_code;     /* STRING UNIQUE*/
        this.project_name   = project_name;     /* STRING */
        this.project_master = project_master;   /* ADMIN INSTANT */
        this.description    = description;      /* STRING */
        this.create_on      = create_on;        /* DATETIME INSTANT */
        this.project_status = project_status;   /* STATUS INSTANT */
        this.active         = active;           /* BOOLEAN */
        this.partners       = partners;         /* ARRAY OF ADMIN INSTANTS */
        this.users          = users;            /* ARRAY OF USER INSTANTS */
    }

    get = ( prop = undefined ) => {
        if( prop == undefined ){
            const {
                project_id,
                project_code,
                project_name,
                project_master,
                description,
                create_on,
                project_status,
                active,
                partners,
                users
            } = this;
            return {
                project_id, project_code,
                project_name, project_master,
                description, create_on,
                project_status, active,
                partners, users
            }
        }
        else{
            return this[prop];
        }
    }

    set = ( key, value ) => {
        this[key] = value
    }

    /* Has not been debugged yet */
    commit = async () => {
        const dbo = await asyncMongo()

        const updateResult = await new Promise(function(resolve, reject) {

            dbo.collection( tables.projects ).update(
                { project_id: this.get('project_id') },
                { $set: this.get() },
                (err, result) => {
                    resolve( result )
                }
            )
        });
        return updateResult;
    }
}


module.exports = Project
