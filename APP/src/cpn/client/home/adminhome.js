import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Navbar, Horizon } from '../../navbar';

export default () => {
    const dispatch = useDispatch();
    const { navState } = useSelector(state => state);

    const { urls, bottomUrls } = useSelector(state => state.navbarLinks.admin)
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
      
        if (file) {
          const reader = new FileReader();
      
          reader.onload = (e) => {
            try {
              const json = JSON.parse(e.target.result);
              saveJsonToFile(json);
            } catch (error) {
              alert('Không thể đọc file JSON');
            }
          };
      
          reader.readAsText(file);
        }
      };
      
      const saveJsonToFile = (json) => {
        const fileName = 'new_file.json';
        const data = JSON.stringify(json, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
      
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
      
        URL.revokeObjectURL(url);
      };
      const importData = async () => {
        if (!uploadedJson) {
          alert('Vui lòng tải lên một file JSON trước khi import');
          return;
        }
    
        // Gửi dữ liệu JSON đến API của bạn ở đây
        try {
          const response = await fetch('YOUR_API_ENDPOINT', {
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
            <div className={`app fixed-default overflow ${!navState ? "app-stretch" : "app-scaled"}`} style={{ height: "100vh" }}>
                <Horizon />
               
                <span className="text-24-px p-1">Admin home
                ư
                </span>
                <div style={{ height: "200vh" }}>
<input type="file" accept=".json" onChange={handleFileUpload} />
                <button onClick={importData}>Import</button>
                </div>




            </div>
        </div>
    )
}
