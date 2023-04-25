import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './cpn/App';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux';
import store from './redux/store';

// Hàm để khởi chạy ứng dụng sau khi cấu hình được tải
function startApp() {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
        <Provider store={ store }>
            <App />
        </Provider>
    </React.StrictMode>
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
}

fetch("/dipesconfig/server_url.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load configuration");
    }
    return response.json();
  })
  .then((config) => {
    window.REACT_APP_API_URL = config.API_URL;
    // console.log(config.API_URL)
    startApp();
  })
  .catch((error) => {
    console.error("Failed to load configuration:", error);
  });


