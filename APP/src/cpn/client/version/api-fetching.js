import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';



import { Navbar, Horizon } from '../../navbar';


export default (props) => {
    const { page_param } = useParams()
    const { navState, unique_string, proxy, addConstraintBox, addApi, apiAddFilter, pages, Alert, Confirm } = useSelector(state => state);

    const dispatch = useDispatch()
    const cf = new Confirm(dispatch);
    const al = new Alert(dispatch);
    const page = pages.filter(pag => pag.param == page_param)[0];
    if (!page) {
        alert("Page not found")
    }



    const { urls, bottomUrls } = useSelector(state => state.navbarLinks.su)
    const { _api, collection, setCollections } = props;
    const [api, setApi] = useState(_api ? _api : {});
    const { openTab } = useSelector(state => state.functions);
    const [height, setHeight] = useState(0);
    const [apiData, setApiData] = useState([])

    // useEffect(() => {
    //     dispatch({
    //         type: "setNavBarHighLight",
    //         payload: { page: 0 }
    //     })
    // }, [])
    // useEffect(() => {
    //     callApi()
    // }, [])
    useEffect(() => {
        const id_str = page.apis.get.split('/')[4];
        dispatch({
            type: "setNavBarHighLight",
            payload: { page: 1001 }
        })


        fetch(`${proxy}/api/${unique_string}/apis/id_str/${id_str}`)
            .then(res => res.json())
            .then(res => {
                const { api } = res;
                setApi(api);

                callApi(api)
            })
    }, [])

    const cardDrop = () => {
        setHeight(height == 0 ? 200 : 0)
    }
    const switchState = () => {
        const status = !api.status;
        const newApi = { ...api, status }
        const newCollection = collection
        const newApiSet = newCollection[api.type.value]
        newCollection[api.type.value] = newApiSet.map(_api => {
            if (_api.url.id_str === newApi.url.id_str) {
                return newApi
            } else {
                return _api
            }
        })
        const body = {
            url: api.url.id_str,
            status,
            collection: newCollection
        }
        setCollections(newCollection)
        fetch(`${proxy}/api/${unique_string}/apis/api/status`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(body)
        }).then(res => res.json()).then(res => {
            setApi({ ...api, status })
        })
    }
    const callApi = (api) => {
        /* this must be fixed */

        fetch(`${proxy}${page.apis.get}`).then(res => res.json()).then(res => {
            const { success, content, data } = res;
            
                // al.failure("Lỗi", "Đọc dữ liệu thất bại ")
           
                setApiData(data)
            
        })
    }
    const generateUrl = (url) => {
        const { params } = api.url;
        if (params != undefined && params.length > 0) {
            params.map(field => {
                url = url.replace(`${field.field_alias}`, `${field.field_name.replaceAll(' ', '_')}`)
            })
        }
        return url
    }
    const removeApi = () => {
        const newCollection = collection
        const newApiSet = newCollection[api.type.value]
        newCollection[api.type.value] = newApiSet.filter(_api => _api.url.id_str != api.url.id_str)
        setCollections(newCollection)
        fetch(`${proxy}/api/${unique_string}/apis/api`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ collection: newCollection, api })
        }).then(res => res.json()).then(res => {

        })
    }

    const redirectToInput = () => {
        const id_str_post = page.apis.post.split('/')[4];
        openTab(`/su/api/post/input/${id_str_post}`)
    }
    const redirectToInputPut = (data) => {
        const id_str_put = page.apis.put.split(`/`)[4];

        let rawParams = page.apis.put.split(`/${id_str_put}/`)[1];
console.log(rawParams)
        const keys = Object.keys(data);
        keys.map(key => {
            const value = data[key];
            rawParams = rawParams.replaceAll(key, value);
        })

        openTab(`/su/api/put/input/${id_str_put}/${rawParams}`)
    }
    const noParamsFilter = () => {
        const { fields } = api;
        const { params } = api.url;
        const filtedFields = fields.filter(field => {
            const fieldExisted = params.filter(f => f.field_id == field.field_id);
            if (fieldExisted.length > 0) {
                return false
            } else {
                return true
            }
        });
        return filtedFields;
    }
    const clipboardApiStructure = () => {
        const params = noParamsFilter().map(field => {
            return `"${field.field_alias}": "",`
        })
        navigator.clipboard.writeText(`
        {
            "data" : {
                ${params.join('\n\t\t')}
            }
        }
        `)
        alert("Đã sao chép JSON")
    }

    const deleteData = (data) => {
        let rawParams = page.apis.delete;
        const keys = Object.keys(data);
        keys.map(key => {
            const value = data[key];
            rawParams = rawParams.replaceAll(key, value);
        })
        fetch(`${proxy}${rawParams}`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json"
            }
        }).then(res => res.json()).then(res => {
            const { success, content } = res;
            if (success) {
                al.success("Thành công", "Xóa dữ liệu thành công")
                setTimeout(() => {
                    window.location.reload();
                }, 1600);
            } else {
                al.failure("Thất bại", "Xóa thất bại")
            }
        })
    }
    const askRemove = (data) => {
        cf.askYesNo("Xóa bản ghi ?", "Bản ghi này sẽ bị xóa vĩnh viễn", (conf) => { deleteData(data) })
    }
    return (
        <div className="fixed-default fullscreen main-bg overflow flex flex-no-wrap">
            <Navbar urls={urls} param={page_param} />
            <div id="app-container" className={`app fixed-default overflow ${!navState ? "app-stretch" : "app-scaled"}`} style={{ height: "100vh" }}>
                <Horizon />
                <div className="p-1" id="app-scrollBox">
                    <div className="p-1 min-height-full-screen column">
                        <div className="w-100-pct">
                            <div className="flex flex-no-wrap bg-white shadow-blur">
                                <div className="fill-available p-1">
                                    <span> Bảng {page.title}</span>
                                </div>
                                <div className="w-48-px flex flex-middle">
                                    <div className="w-72-px pointer order-0">
                                        <div className="block p-1" onClick={() => { navTrigger() }}>
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
                                    <input className="p-0-5 text-16-px block fill-available no-border"
                                        placeholder="Search"
                                        spellCheck="false"
                                    />
                                    <div className="flex flex-no-wrap flex-aligned">
                                        <div className="border-1-right w-48-px">
                                            <img className="w-28-px block mg-auto" src="/assets/icon/viewmode/grid.png" />
                                        </div>
                                        <div className="p-0-5">
                                            <button onClick={redirectToInput} className="bold text-24-px no-border bg-green white border-radius-50-pct pointer" style={{ width: "32px", height: "32px" }}>+</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-100-pct m-t-1">
                                    {/* <div class="flex flex-no-wrap">
                                <div class="ml-auto1">
                                    <div className="m-t">
                                        <button onClick={redirectToInput} className="upper pointer block w-max-content white text-center p-t-0-5 p-b-0-5 p-l-1 p-r-1 m-l-1 no-border bg-green">Thêm mới</button>
                                    </div>
                                </div>
                            </div> */}
                                    <div className="m-t-1">
                                        {apiData != undefined && apiData.length > 0 ?
                                            <table className="w-100-pct">
                                                <thead>
                                                    <tr>
                                                        {api.fields && api.fields.map(field =>
                                                            <th className="text-left">
                                                                <span>{field.field_name}</span>
                                                            </th>
                                                        )}
                                                        <th>
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {apiData && apiData.map(data =>
                                                        <tr>
                                                            {api.fields && api.fields.map(field =>
                                                                <td>{data[field.field_alias]}</td>
                                                            )}
                                                            <td className='text-center'>
                                                                <img onClick={() => { redirectToInputPut(data) }} className="w-24-px mg-auto m-l-0-5" src={`/assets/icon/edit.png`} width="100%" />
                                                                <img onClick={() => { askRemove(data) }} className="w-24-px mg-auto m-l-0-5" src={`/assets/icon/delete.png`} width="100%" />
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                            :
                                            (
                                                <span>Không có dữ liệu.</span>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

