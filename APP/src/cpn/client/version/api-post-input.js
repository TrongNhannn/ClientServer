import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Navbar, Horizon } from '../../navbar';

import {
    Varchar, Char, Text, Int,
    DateInput, TimeInput, DateTimeInput,
    Decimal, Bool, DataEmail, DataPhone

} from './inputs';

export default () => {
    const dispatch = useDispatch();
    const { id_str } = useParams()
    const { urls, bottomUrls } = useSelector(state => state.navbarLinks.su)
    const { dateGenerator, autoLabel, openTab, modifyPageParam } = useSelector(state => state.functions)
    const { navState, unique_string, proxy, Alert, Confirm, pages } = useSelector(state => state);
    const [api, setApi] = useState({})
    const [tables, setTables] = useState([])
    const [fields, setFields] = useState([]);
    const [errors, setErrors] = useState({});
    const [data, setData] = useState({});
    const [relatedTables, setRelatedTables] = useState([])
    const al = new Alert(dispatch);
    const cf = new Confirm(dispatch)
    const [phoneError, setPhoneError] = useState(false);
    const handlePhoneError = (error) => {
        setPhoneError(error);
    };
    const [emailError, setEmailError] = useState(false);
    const handleEmailError = (error) => {
        setEmailError(error);
    };
    useEffect(() => {

        fetch(`${proxy()}/api/${unique_string}/apis/api/input/info/${id_str}`).then(res => res.json())
            .then(res => {
                const { success, api, relatedTables } = res;
                if (success) {
                    const { fields, tables } = api;
                    delete api.fields;
                    delete api.tables;
                    setApi(api)
                    setFields(fields)
                    setTables(tables)
                    setRelatedTables(relatedTables)
                } else {
                    al.failure("Lỗi", "Không thực hiện được chức năng này")
                    setTimeout(() => {
                        history.back();
                    }, 1600);
                }
                // const { url } = api.url;
                const page = pages.filter(p => p.apis.post == api.url.url)[0]
                if (page) {
                    const { param } = page;
                    modifyPageParam(param)
                }
            })
    }, [pages])

    const changeTrigger = (field, value) => {
        const newData = data;
        newData[field.field_alias] = value;
        setData(newData)
    }
    const nullCheck = () => {
        let valid = true;
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            const { nullable, field_alias } = field;
            if (!nullable) {
                if (data[field_alias] == null || data[field_alias] == undefined || data[field_alias] == "") {
                    valid = false
                }
            }
        }
        return valid;
    }
    const handleClick = () => {
        history.back();
    };

    const submit = () => {

        if (!emailError && !phoneError && nullCheck(data)) {
            fetch(`${proxy()}${api.url.url}`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },

                body: JSON.stringify({ data })

            }).then(res => res.json()).then(res => {
                const { success, data, fk } = res;
                // console.log(res)
                if (success) {
                    al.success("Thành công", "Thành công thêm dữ liệu!")
                    setTimeout(() => {
                        window.location.reload();
                    }, 1600);
                } else {
                    al.failure("Oops!", data)
                }
            })
        } else {
            if (emailError) {
                al.failure("Lỗi", "Địa chỉ email không hợp lệ");
            } else if (phoneError) {
                al.failure("Lỗi", "Số điện thoại không hợp lệ");
            } else {
                al.failure("Lỗi", "Một số trường vi phạm ràng buộc NOT NULL");
            }
        }
    };
    return (
        <div className="fixed-default fullscreen main-bg overflow flex flex-no-wrap">
            <Navbar urls={urls} bottomUrls={bottomUrls} />
            <div id="app-container" className={`app fixed-default overflow ${!navState ? "app-stretch" : "app-scaled"}`} style={{ height: "100vh" }}>
                <Horizon />
                <div className="p-1" id="app-scrollBox">
                    <div className="p-1 min-height-full-screen column">
                        <div className="w-100-pct">
                            <div className="flex flex-no-wrap bg-white shadow-blur">
                                <div className="fill-available p-1">
                                    {/* <span> Bảng {pages.title}</span> */}
                                </div>
                                <div className="w-48-px flex flex-middle">
                                    <div className="w-72-px pointer order-0">
                                        {/* <div className="block p-1" onClick={() => { navTrigger() }}> */}
                                        <div className="block p-1">
                                            <span className="block w-24-px border-3-top" style={{ marginTop: "4px" }} />
                                            <span className="block w-24-px border-3-top" style={{ marginTop: "4px" }} />
                                            <span className="block w-24-px border-3-top" style={{ marginTop: "4px" }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="m-t-0-5 fill-available bg-white shadow-blur">
                            <div className="w-100-pct h-fit column p-1">
                                <div className="flex flex-no-wrap border-1-bottom">
                                    <span className="p-0-5 text-16-px block fill-available no-border"></span>
                                    <div className="flex flex-no-wrap flex-aligned">
                                        <div className="w-48-px">
                                            <img className="w-28-px block mg-auto" src="/assets/icon/viewmode/grid.png" />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-100-pct m-t-1">

                                    {/* VERSION INFO */}
                                    {tables.length > 0 ?
                                        <div className="w-50-pct mg-auto p-1 bg-white">
                                            <span className="block text-32-px text-center p-0-5">{api.api_name}</span>
                                            {fields.map(field =>
                                                <React.StrictMode key={field.field_id}>

                                                    {field.data_type == "PHONE" ?
                                                        <DataPhone
                                                            table={tables.filter(tb => tb.table_id == field.table_id)[0]}
                                                            related={relatedTables} field={field}
                                                            changeTrigger={changeTrigger}
                                                            onPhoneError={handlePhoneError}
                                                        /> : null
                                                    }
                                                    {field.data_type == "VARCHAR" ?
                                                        <Varchar
                                                            table={tables.filter(tb => tb.table_id == field.table_id)[0]}
                                                            related={relatedTables} field={field}
                                                            changeTrigger={changeTrigger} /> : null
                                                    }
                                                    {field.data_type == "CHAR" ?
                                                        <Char
                                                            table={tables.filter(tb => tb.table_id == field.table_id)[0]}
                                                            related={relatedTables} field={field}
                                                            changeTrigger={changeTrigger} /> : null
                                                    }
                                                    {field.data_type == "TEXT" ?
                                                        <Text
                                                            table={tables.filter(tb => tb.table_id == field.table_id)[0]}
                                                            related={relatedTables} field={field}
                                                            changeTrigger={changeTrigger} /> : null
                                                    }
                                                    {field.data_type == "INT" || field.data_type == "BIG INT" ?
                                                        <Int
                                                            table={tables.filter(tb => tb.table_id == field.table_id)[0]}
                                                            related={relatedTables} field={field}
                                                            changeTrigger={changeTrigger} /> : null
                                                    }
                                                    {field.data_type == "INT UNSIGNED" || field.data_type == "BIG INT UNSIGNED" ?
                                                        <Int
                                                            table={tables.filter(tb => tb.table_id == field.table_id)[0]}
                                                            related={relatedTables} unsigned={true} field={field}
                                                            changeTrigger={changeTrigger} /> : null
                                                    }
                                                    {field.data_type == "DATE" ?
                                                        <DateInput
                                                            table={tables.filter(tb => tb.table_id == field.table_id)[0]}
                                                            related={relatedTables} field={field}
                                                            changeTrigger={changeTrigger} /> : null
                                                    }
                                                    {field.data_type == "EMAIL" ?
                                                        <DataEmail
                                                            table={tables.filter(tb => tb.table_id == field.table_id)[0]}
                                                            related={relatedTables} field={field}
                                                            changeTrigger={changeTrigger}
                                                            onEmailError={handleEmailError}
                                                        /> : null
                                                    }
                                                    {field.data_type == "TIME" ?
                                                        <TimeInput
                                                            table={tables.filter(tb => tb.table_id == field.table_id)[0]}
                                                            related={relatedTables} field={field}
                                                            changeTrigger={changeTrigger} /> : null
                                                    }
                                                    {field.data_type == "DATETIME" ?
                                                        <DateTimeInput
                                                            table={tables.filter(tb => tb.table_id == field.table_id)[0]}
                                                            related={relatedTables} field={field}
                                                            changeTrigger={changeTrigger} /> : null
                                                    }
                                                    {field.data_type == "DECIMAL" ?
                                                        <Decimal
                                                            table={tables.filter(tb => tb.table_id == field.table_id)[0]}
                                                            related={relatedTables} field={field}
                                                            changeTrigger={changeTrigger} /> : null
                                                    }
                                                    {field.data_type == "DECIMAL UNSIGNED" ?
                                                        <Decimal
                                                            table={tables.filter(tb => tb.table_id == field.table_id)[0]}
                                                            related={relatedTables} unsigned={true} field={field}
                                                            changeTrigger={changeTrigger} /> : null
                                                    }
                                                    {field.data_type == "BOOL" ?
                                                        <Bool
                                                            table={tables.filter(tb => tb.table_id == field.table_id)[0]}
                                                            related={relatedTables} field={field}
                                                            changeTrigger={changeTrigger} /> : null
                                                    }
                                                </React.StrictMode>
                                            )}
                                            <div className="m-t-1">
                                                <div className="p-1">
                                                    <div className="button-wrapper">
                                                        <button onClick={submit} className="w-max-content p-0-5 p-l-1 p-r-1 shadow-blur shadow-hover bg-theme-color no-border block text-16-px white pointer shadow-blur shadow-hover">Lưu lại</button>
                                                    </div>
                                                    <div className="button-wrapper">
                                                        <button onClick={handleClick} className="w-max-content p-0-5 p-l-1 p-r-1 shadow-blur shadow-hover bg-theme-color no-border block text-16-px white pointer shadow-blur shadow-hover">Quay về</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <span>Không có dữ liệu</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}