import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Navbar, Horizon } from '../../navbar';
import CustomFileInput from './CustomFileInpu';
export default () => {
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [file, setFile] = useState({});
    const dispatch = useDispatch();
  
    const { navState,Alert } = useSelector(state => state);
      const al = new Alert(dispatch)
    const { urls, bottomUrls } = useSelector(state => state.navbarLinks.su)
    const [uploadedJson, setUploadedJson] = useState(null);
    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    // console.log(json)
                    // console.log(file)
                    setFile(file)
                    setUploadedJson(json);
                } catch (error) {
                    al.failure("Thất bại","Định dạng tệp không hợp lệ")
                }
            };

            reader.readAsText(file);
        }
    };
    const askRemove = () => {
        cf.askYesNo("Xóa người dùng ?", "Người dùng này sẽ bị xóa vĩnh viễn", removeUser)
    }
    const importData = async () => {
        if (!uploadedJson) {
            al.failure("Thất bại", "Vui lòng tải lên một file JSON trước khi import");
            
            return;
        }

        try {
            const response = await fetch('http://192.168.15.205:5000/api/dipev1/json/import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(uploadedJson),
            });

            if (response.ok) {
                al.success("Thành công","Import dữ liệu thành công")
            } else {
                al.failure("Thất bại","Import dữ liệu thất bại")
            }
        } catch (error) {
            console.error(error);
            al.failure("Thất bại","Import dữ liệu thất bại")
        }
    };
    const importAPI = async () => {
        if (!uploadedJson) {
            al.failure("Thất bại", "Vui lòng tải lên một file JSON trước khi import");
            return;
        }

        try {
            const response = await fetch('http://192.168.15.205:5000/api/dipev1/json/import-api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(uploadedJson),
            });

            if (response.ok) {
                al.success("Thành công","Import dữ liệu thành công")
            } else {
                al.failure("Thất bại","Import dữ liệu thất bại")
            }
        } catch (error) {
            console.error(error);
            al.failure("Thất bại","Import dữ liệu thất bại")
        }
    };
    useEffect(() => {
        dispatch({
            type: "setNavBarHighLight",
            payload: { url_id: 0 }
        })
    }, [])
    
    const getFileType = () => {
        const { data } = uploadedJson
        const keys = Object.keys( data );

        const isApi = keys.filter( key => key == "apis" )[0];
        if( isApi ){
            return "API"
        }else{
            const isDatabase = keys.filter( key => key == "tables" )[0];
            if( isDatabase ){
                return "Database"
            }else{
                return "Invalid File"
            }
        }
    }




    return (
        <div className="fixed-default fullscreen main-bg overflow flex flex-no-wrap">
            <Navbar urls={urls} bottomUrls={bottomUrls} />
            <div id="app-container" className={`app fixed-default overflow ${!navState ? "app-stretch" : "app-scaled"}`} style={{ height: "100vh" }}>
                <Horizon />
                <div className="p-1" id="">
                    {/* VERSION INFO */}
<div className="p-1 min-height-full-screen column">
                    <div className="block bg-white scroll-y p-1 shadow-blur p-l-5 p-r-5 flex flex-middle" style={{ height: "100vh" }}>

                        <div className="p-l-2 p-r-1 bg-white shadow-blur rel" style={{ width: 768, height: 400 }}>

                            <div className="m-t-1 m-b-1">
                                <div className="flex flex-no-wrap">
                                    <div className="main-pic w-30-pct">
                                        Tên tệp:
                                    </div>
                                    <div className="w-70-pct">
                                   { file.name }
                                    </div>
                                </div>
                            </div>

                            <hr className="block border-1-top" />
                            <div className="m-t-1 m-b-1">
                                <div className="flex flex-no-wrap">
                                    <div className="main-pic w-30-pct">
                                        Dạng tệp:
                                    </div>
                                    <div className="w-70-pct">
                                        { uploadedJson ? getFileType() : null }
                                    </div>
                                </div>
                            </div>
                            
                            {/* <div className="m-t-1 m-b-1">
                                <div className="flex flex-no-wrap">
                                    <div className="main-pic w-30-pct">
                                        Dự án:
                                    </div>
                                    <div className="w-70-pct">

                                    </div>
                                </div>
                            </div>
                            <div className="m-t-1 m-b-1">
                                <div className="flex flex-no-wrap">
                                    <div className="main-pic w-30-pct">
                                        Phiên bản:
                                    </div>
                                    <div className="w-70-pct">

                                    </div>
                                </div>
                            </div> */}
                            <div className="flex flex-no-wrap abs b-0 r-0 p-1">  
                                <CustomFileInput onChange={handleFileUpload} />
                                {
                                    uploadedJson && getFileType() == "API" ?
                                    
                                    <button onClick={importAPI} className="w-max-content p-0-5 m-0-5 shadow-blur shadow-hover bg-theme-color no-border block text-16-px white pointer shadow-blur shadow-hover">Import API</button>
                                    
                                    :
                                    <button onClick={importData} className="w-max-content p-0-5 m-0-5 shadow-blur shadow-hover bg-theme-color no-border block text-16-px white pointer shadow-blur shadow-hover">Import Database</button>

                                 }
                                
                                
                            </div>

                            {/* <div className="flex flex-aligned flex-wrap m-l-2 text-center" >

                                    <span className="text-16-px block italic bold">Import Config</span>

                                    <span className="text-16-px ">
                                       

                                        <CustomFileInput onChange={handleFileUpload} />

                                    </span>

                                    <span className="text-16-px block gray p-r-1">
                                        <div className="m-t-1">
                                            <button onClick={importData} className="w-max-content p-0-5 p-l-1 p-r-1 shadow-blur shadow-hover bg-theme-color no-border block text-16-px white pointer shadow-blur shadow-hover">Import Db</button>
                                        </div>
                                    </span>
                                    <span className="text-16-px block gray p-l-1">
                                        <div className="m-t-1">
                                            <button onClick={importAPI} className="w-max-content p-0-5 p-l-1 p-r-1 shadow-blur shadow-hover bg-theme-color no-border block text-16-px white pointer shadow-blur shadow-hover">Import Api</button>
                                        </div>
                                    </span>
                                </div> */}


                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
