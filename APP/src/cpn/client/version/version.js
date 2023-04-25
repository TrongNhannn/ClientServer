import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Navbar, Horizon } from '../../navbar';
import Field  from './table-field';
import $ from 'jquery';

import AddConstraint from './add-constraint';
import AddApi from './add-api';
import ApiDesign from './api';

const cardMinHeight = 400;

export default () => {
    const dispatch = useDispatch();

    const{ project_id, version_id } = useParams()

    const { urls, bottomUrls } = useSelector( state => state.navbarLinks.su )
    const { dateGenerator, autoLabel, openTab } = useSelector( state => state.functions )
    const { navState, unique_string, proxy, addConstraintBox, addApi, apiAddFilter } = useSelector( state => state );

    const [ project, setProject ] = useState({})
    const [ version, setVersion ] = useState({})
    const [ tables, setTables ] = useState([]);
    const [ table, setTable ] = useState({});
    const [ _table, _setTable ] = useState({});


    const [ tableState, setTableState ] = useState(true);

    useEffect( () => {
        dispatch({
            type: "setNavBarHighLight",
            payload: { url_id: 1 }
        })

        fetch(`${ proxy() }/api/${ unique_string }/projects/project/${project_id}/ver/${version_id}`)
        .then( res => res.json() ).then( res => {
            const { project, version } = res.data;
            const { tablesDetail } = res;

            const tables = tablesDetail.map( table => {
                const { constraint, fields } = table;
                if( table.fields != undefined ){
                    table.fields = fields.map( field => {
                        if( constraint!= undefined ){
                            field.constraints = constraint.filter( constr => constr.field_id === field.field_id )
                        }
                        const props = JSON.parse( field.field_props )

                        return { ...field, ...props }
                    })
                }
                return table;
            });

            setTables( tables );
            setProject( project[0] )
            setVersion( version[0] )
            setTable( tablesDetail[0] )
            _setTable( tablesDetail[0] )
        })

    }, [])

    const reInitialization = () => {
        fetch(`${ proxy() }/api/${ unique_string }/projects/project/${project_id}/ver/${version_id}`)
        .then( res => res.json() ).then( res => {
            const { project, version } = res.data;
            const { tablesDetail } = res;

            const tables = tablesDetail.map( table => {
                const { constraint, fields } = table;
                if( table.fields != undefined ){
                    table.fields = fields.map( field => {
                        if( constraint!= undefined ){
                            field.constraints = constraint.filter( constr => constr.field_id === field.field_id )
                        }
                        const props = JSON.parse( field.field_props )

                        return { ...field, ...props }
                    })
                }
                return table;
            });

            setTables( tables );
            setProject( project[0] )
            setVersion( version[0] )
            setTable( tablesDetail[0] )
            _setTable( tablesDetail[0] )
        })
    }

    const scrollTo = (e) =>{
        $(e.target).find('a')[0].click()
    }

    const changeTable = (table) => {
        setTable(table)
        _setTable( table )
    }

    const tableStateSwitch = () => {
        if( !tableState ){
            setTableState( !tableState )
            const { table_name, table_id } = table;
            fetch(`${proxy()}/api/${ unique_string }/tables/modify`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ table_name, table_id })
            }).then(res => res.json()).then( res => {

            })
        }else{
            setTableState( !tableState )
        }
    }

    const tableNameEnterTrigger = (e) => {
        if( e.keyCode === 13 ){
            tableStateSwitch()
        }
    }

    useEffect(() => {

        $('#table-name').focus();

    }, [ tableState ])

    const createTable = () => {

        const newTable = {
            table_name: "Bảng mới",
            version_id
        }
        fetch(`${proxy()}/api/${ unique_string }/tables/create`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(newTable)
        }).then( res => res.json() ).then( res => {
            const { success, content, data } = res;
            const date = new Date()
            const _table = { ...data, field: [], create_on: date.toString() }
            setTables( [...tables, _table] );
            setTable( _table );
        })
    }

    const createField = () => {

        const { table_id } = table;

        const newField = {
            table_id,
            field_name: "Trường mới",
            nullable: true,
            field_data_type: "VARCHAR",
            field_props: { "LENGTH": 255},
            default_value: "",
        }

        fetch( `${proxy()}/api/${ unique_string }/table/create/field`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(newField)
        }).then( res => res.json() ).then( res => {
            const { success, content, data } = res;
            const _field = { ...data, props: JSON.parse( data.field_props ) }

            updateFields("add", _field)
        })
    }

    const _updateFields = (type, field) => {
        const newFields = table.fields.map( f => {
            if( f.field_id === field.field_id ){
                return field
            }
            return f;
        })
        const newTable = { ...table, fields: newFields }
        setTable( newTable )

        const newTables = tables.map(tb => {
            if( tb.table_id === newTable.table_id ){
                return newTable
            }else{
                return tb
            }
        })

        setTables( newTables )
    }

    const _addFields = ( type, field ) => {
        const newFields = table.fields ? [...table.fields, field] : [ field ];

        const newTable = { ...table, fields: newFields }
        setTable( newTable )

        const newTables = tables.map(tb => {
            if( tb.table_id === newTable.table_id ){
                return newTable
            }else{
                return tb
            }
        })

        setTables( newTables )
    }

    const _removeField = ( type, field ) => {
        const newFields = table.fields.filter( f => f.field_id != field.field_id );
        const newTable = { ...table, fields: newFields }

        setTable( newTable )
        const newTables = tables.map(tb => {
            if( tb.table_id === newTable.table_id ){
                return newTable
            }else{
                return tb
            }
        })
        setTables( newTables )
    }

    const updateFields = ( type, field ) => {
        switch (type) {
            case "update":
                _updateFields( type, field )
                break;
            case "add":
                _addFields( type, field )
                break;
            case "remove":
                _removeField( type, field )
                break;
            default:
                break;
        }
    }

    const removeTable = ( table ) => {
        const { table_id } = table;

        fetch(`${ proxy() }/api/${ unique_string }/tables/drop/${ table_id }`, {
            method: "DELETE",
        }).then( res => res.json() ).then( res => {
            const newTables = tables.filter( tb => tb.table_id !== table_id );

            setTables( newTables );
            setTable( newTables[ newTables.length - 1 ] )
        })
    }

    return(
        <div className="fixed-default fullscreen main-bg overflow flex flex-no-wrap">
            <Navbar urls={ urls } bottomUrls={ bottomUrls } />
            <div id="app-container" className={`app fixed-default overflow ${ !navState ? "app-stretch": "app-scaled" }`} style={{ height: "100vh" }}>
                <Horizon />

                <div className="p-1" id="app-scrollBox">
                    {/* VERSION INFO */}
                    { /* DATABASE DESIGN */ }
                

                    {/* API DESIGN */}

                    <ApiDesign version={ version } />



                </div>

            </div>
            { addConstraintBox ?
                <AddConstraint tables={ tables } currentTable={ table } updateFields={updateFields}/>
                : null
             }

             { addApi ?
                 <AddApi version={ version } project_id={ project_id } tables={ tables } addApiFilter={ apiAddFilter }/>
                 : null
              }
        </div>
    )
}
