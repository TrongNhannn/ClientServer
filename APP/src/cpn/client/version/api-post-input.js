import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Navbar, Horizon } from '../../navbar';

import {
    Varchar, Char, Text, Int,
    DateInput, TimeInput, DateTimeInput,
    Decimal, Bool,
} from './inputs';

export default () => {
    const dispatch = useDispatch();

    const{ id_str } = useParams()

    const { urls, bottomUrls } = useSelector( state => state.navbarLinks.su )
    const { dateGenerator, autoLabel, openTab } = useSelector( state => state.functions )
    const { navState, unique_string, proxy, Alert, Confirm } = useSelector( state => state );

    const [ api, setApi ] = useState({})
    const [ tables, setTables ] = useState([])
    const [ fields, setFields ] = useState([]);
    const [ data, setData ] = useState({});
    const [ relatedTables, setRelatedTables ] = useState([])

    const al = new Alert( dispatch );
    const cf = new Confirm( dispatch )

    useEffect( () => {
        fetch(`${ proxy }/api/${ unique_string }/apis/api/input/info/${ id_str }`).then( res => res.json() )
        .then( res => {
            const { success, api, relatedTables } = res;
            console.log(relatedTables)
            if( success ){
                const { fields, tables } = api;
                delete api.fields;
                delete api.tables;
                setApi( api )
                setFields(fields)
                setTables(tables)
                setRelatedTables( relatedTables )
            }else{
                al.failure("Lỗi", "API này không tồn tại hoặc đã bị vô hiệu")
            }
        })
    }, [])

    const changeTrigger = ( field, value ) => {
        const newData = data;
        newData[field.field_alias] = value;
        setData( newData )
    }

    const nullCheck = () => {
        let valid = true;
        for( let i = 0; i < fields.length; i++ ){
            const field = fields[i];
            const { nullable, field_alias } = field;
            if( !nullable ){
                if( data[field_alias] == null || data[field_alias] == undefined || data[field_alias] == "" ){
                    valid = false
                }
            }
        }
        return valid;
    }

    const submit = () => {
        if( nullCheck(data) ){
            fetch(`${ api.url.proxy }${ api.url.url }`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ data })
            }).then( res => res.json() ).then( res => {
                const { success, data, fk } = res;
                console.log( res )
                if( success ){
                    al.success("", "Thành công thêm dữ liệu!")
                }else{
                    al.failure( "Oops!", data )
                }
            })
        }else{
            al.failure("Lỗi", "Một số trường vi phạm ràng buộc NOT NULL");
        }
    }

    return(
        <div className="fixed-default fullscreen main-bg overflow flex flex-no-wrap">
            <Navbar urls={ urls } bottomUrls={ bottomUrls } />
            <div id="app-container" className={`app fixed-default overflow ${ !navState ? "app-stretch": "app-scaled" }`} style={{ height: "100vh" }}>
                <Horizon />

                <div className="p-1" id="app-scrollBox">
                    {/* VERSION INFO */}
                    { tables.length > 0 ?
                    <div className="w-50-pct mg-auto p-1 bg-white">
                        <span className="block text-32-px text-center p-0-5">{ api.api_name }</span>
                        { fields.map( field =>
                            <React.StrictMode key={field.field_id}>
                                { field.data_type == "VARCHAR" ?
                                    <Varchar
                                        table={ tables.filter(tb => tb.table_id == field.table_id)[0] }
                                        related={ relatedTables } field={ field }
                                        changeTrigger={ changeTrigger }/> : null
                                }
                                { field.data_type == "CHAR" ?
                                    <Char
                                        table={ tables.filter(tb => tb.table_id == field.table_id)[0] }
                                        related={ relatedTables } field={ field }
                                        changeTrigger={ changeTrigger }/> : null
                                }
                                { field.data_type == "TEXT" ?
                                    <Text
                                        table={ tables.filter(tb => tb.table_id == field.table_id)[0] }
                                        related={ relatedTables } field={ field }
                                        changeTrigger={ changeTrigger }/> : null
                                }
                                { field.data_type == "INT" || field.data_type == "BIG INT" ?
                                    <Int
                                        table={ tables.filter(tb => tb.table_id == field.table_id)[0] }
                                        related={ relatedTables } field={ field }
                                        changeTrigger={ changeTrigger }/> : null
                                }
                                { field.data_type == "INT UNSIGNED" || field.data_type == "BIG INT UNSIGNED" ?
                                    <Int
                                        table={ tables.filter(tb => tb.table_id == field.table_id)[0] }
                                        related={ relatedTables } unsigned={ true } field={ field }
                                        changeTrigger={ changeTrigger }/> : null
                                }
                                { field.data_type == "DATE" ?
                                    <DateInput
                                        table={ tables.filter(tb => tb.table_id == field.table_id)[0] }
                                        related={ relatedTables } field={ field }
                                        changeTrigger={ changeTrigger }/> : null
                                }
                                { field.data_type == "TIME" ?
                                    <TimeInput
                                        table={ tables.filter(tb => tb.table_id == field.table_id)[0] }
                                        related={ relatedTables } field={ field }
                                        changeTrigger={ changeTrigger }/> : null
                                }
                                { field.data_type == "DATETIME" ?
                                    <DateTimeInput
                                        table={ tables.filter(tb => tb.table_id == field.table_id)[0] }
                                        related={ relatedTables } field={ field }
                                        changeTrigger={ changeTrigger }/> : null
                                }
                                { field.data_type == "DECIMAL" ?
                                    <Decimal
                                        table={ tables.filter(tb => tb.table_id == field.table_id)[0] }
                                        related={ relatedTables } field={ field }
                                        changeTrigger={ changeTrigger }/> : null
                                }
                                { field.data_type == "DECIMAL UNSIGNED" ?
                                    <Decimal
                                        table={ tables.filter(tb => tb.table_id == field.table_id)[0] }
                                        related={ relatedTables } unsigned={ true } field={ field }
                                        changeTrigger={ changeTrigger }/> : null
                                }
                                { field.data_type == "BOOL" ?
                                    <Bool
                                        table={ tables.filter(tb => tb.table_id == field.table_id)[0] }
                                        related={ relatedTables } field={ field }
                                        changeTrigger={ changeTrigger }/> : null
                                }
                            </React.StrictMode>
                        )}
                        <div className="m-t-1">
                            <div className="p-1">
                                <button onClick={ submit } className="w-max-content p-0-5 p-l-1 p-r-1 shadow-blur shadow-hover bg-theme-color no-border block text-16-px white pointer shadow-blur shadow-hover">Lưu bảng ghi</button>
                            </div>
                        </div>
                    </div>
                    : null }



                </div>
            </div>
        </div>
    )
}