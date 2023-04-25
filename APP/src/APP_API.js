
// // const app_api = `http://192.168.19.180:5000`




// const app_api = "http://127.0.0.1:5000"

// export default app_api;


const app_api = () => {
    return window.REACT_APP_API_URL; 
  };
  
  export default app_api;
  