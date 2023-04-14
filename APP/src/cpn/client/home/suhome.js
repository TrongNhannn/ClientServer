import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Navbar, Horizon } from '../../navbar';

export default () => {
    const [selectedFile, setSelectedFile] = useState(null);

  function handleChange(event) {
    setSelectedFile(event.target.files[0]);
    // Handle selected file
  }
    const dispatch = useDispatch();
    const { navState } = useSelector(state => state);
    const { urls, bottomUrls } = useSelector(state => state.navbarLinks.su)
    const [uploadedJson, setUploadedJson] = useState(null);
    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    console.log(json)
                    setUploadedJson(json);
                } catch (error) {
                    alert('Không thể đọc file JSON');
                }
            };

            reader.readAsText(file);
        }
    };

    const importData = async () => {
        if (!uploadedJson) {
            alert('Vui lòng tải lên một file JSON trước khi import');
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
                alert('Dữ liệu đã được import thành công');
            } else {
                alert('Đã xảy ra lỗi khi import dữ liệu');
            }
        } catch (error) {
            console.error(error);
            alert('Đã xảy ra lỗi khi import dữ liệu');
        }
    };
    const importAPI = async () => {
        if (!uploadedJson) {
            alert('Vui lòng tải lên một file JSON trước khi import');
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
                alert('Dữ liệu đã được import thành công');
            } else {
                alert('Đã xảy ra lỗi khi import dữ liệu');
            }
        } catch (error) {
            console.error(error);
            alert('Đã xảy ra lỗi khi import dữ liệu');
        }
    };
    useEffect(() => {
        dispatch({
            type: "setNavBarHighLight",
            payload: { url_id: 0 }
        })
    }, [])

    return (
        <div className="fixed-default fullscreen main-bg overflow flex flex-no-wrap">
            <Navbar urls={urls} bottomUrls={bottomUrls} />
            <div id="app-container" className={`app fixed-default overflow ${!navState ? "app-stretch" : "app-scaled"}`} style={{ height: "100vh" }}>
                <Horizon />
                <div className="p-1" id="app-scrollBox">
                    {/* VERSION INFO */}
                    <div className="w-50-pct mg-auto p-1 bg-white">
                      
                           
                               <div className="rel project-card p-0-5 bg-white m-0-5 shadow-blur pointer shadow-hover">
                                    <div className="flex flex-no-wrap">
                                        <div className="flex flex-aligned flex-wrap m-l-2">
                                            <span className="text-16-px block italic bold">Import Config Database</span>
                                            <span className="text-20-px block">
                                                <input type="file" accept=".json" onChange={handleFileUpload} />
                                            </span>

                                            <span className="text-16-px block gray p-l-1">
                                                <div className="m-t-1">
                                                    <button onClick={importData} className="w-max-content p-0-5 p-l-1 p-r-1 shadow-blur shadow-hover bg-theme-color no-border block text-16-px white pointer shadow-blur shadow-hover">Import Db</button>
                                                </div>
                                            </span>
                                            <span className="text-16-px block gray p-l-1">
                                                <div className="m-t-1">
                                                    <button onClick={importAPI} className="w-max-content p-0-5 p-l-1 p-r-1 shadow-blur shadow-hover bg-theme-color no-border block text-16-px white pointer shadow-blur shadow-hover">Import Api</button>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* <th><div className="rel project-card p-0-5 bg-white m-0-5 shadow-blur pointer shadow-hover">
                                    <div className="flex flex-no-wrap">
                                        <div className="flex flex-aligned flex-wrap m-l-2">
                                            <span className="text-16-px block italic bold">Import Config API</span>
                                            <span className="text-20-px block">
                                                <input type="file" accept=".json" onChange={handleFileUpload} />
                                            </span>

                                            <span className="text-16-px block gray">
                                                <div className="m-t-1">
                                                    <button onClick={importAPI} className="w-max-content p-0-5 p-l-1 p-r-1 shadow-blur shadow-hover bg-theme-color no-border block text-16-px white pointer shadow-blur shadow-hover">Import</button>
                                                </div>
                                            </span>
                                        </div>

                                    </div>
                                </div></th> */}

                            
                        
                    </div>
                </div>
            </div>
        </div>

    )
}
