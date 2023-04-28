import { useState, useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import app_api from "../../APP_API";


export default () => {
    const [ auth, setAuth ] = useState({})
    const {  Confirm, Alert, pages, proxy } = useSelector(state => state);
    const { unique_string } = useSelector( state => state )
    const dispatch = useDispatch()
    const cf = new Confirm(dispatch)
    const al = new Alert(dispatch)
    const enterTriggered = (e) => {
        if( e.keyCode === 13 ){
            submit()
        }
    }

    const submit = () => {
        // console.log(proxy())
       
         fetch(`${proxy()}/${ unique_string }/login`, {
            // fetch(`dipes/test/login`, {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(auth)
        }).then( res => res.json() ).then( ( resp ) => {
            const { success, role, credential_string, _token, redirectToImport  } = resp;
             console.log( resp )
            if( success ){
                localStorage.setItem( 'role', role )
                localStorage.setItem( 'credential_string', credential_string )
                localStorage.setItem( '_token', _token )
                console.log(redirectToImport)
                if (redirectToImport) {
                    window.location = "/"; 
                    
                    setTimeout(() => {
                        al.warning("Warning!","Chưa có dữ liệu")
                    }, 2000);
                   
                  } else {
                    window.location = "/su/users";
                  }
            }else{
               al.failure("Thất bại","Đăng nhập thất bại")
            }
        })
    }

    return(
        <div className="fixed-default flex flex-aligned fullscreen login-bg overflow">
            <div className="flex flex-middle mg-auto login-form">
                <div className="w-60-pct mg-auto" style={{ paddingLeft: "3em" }}>
                    <span className="block text-center upper text-20-px">Đăng nhập</span>
                    <div className="flex flex-wrap">
                        <div className="w-90-pct mg-auto m-t-5 flex flex-no-wrap flex-middle">
                            <input placeholder="Tài khoản" onKeyUp={ enterTriggered } onChange={ (e) => { setAuth( { ...auth, account_string: e.target.value } ) } } type="text" className="block w-100-pct ml-auto border-radius-12-px border-1 p-0-5"/>
                        </div>
                        <div className="w-90-pct mg-auto m-t-1 flex flex-no-wrap flex-middle">
                            <input  placeholder="Mật khẩu" onKeyUp={ enterTriggered } onChange={ (e) => { setAuth( { ...auth, pwd_string: e.target.value } ) } } type="password" className="block w-100-pct ml-auto border-radius-12-px border-1 p-0-5"/>
                        </div>
                        <div className="w-90-pct mg-auto m-t-1 flex flex-no-wrap">
                            <button className="sign-btn w-100-pct pointer" onClick={ submit }>Tiếp tục ➤</button>
                         </div>
                        {/*<div className="w-90-pct mg-auto m-t-5 flex flex-no-wrap flex-middle">
                            <span className="block text-12-px text-right">Khum có tài khoản ? <a href="/signup" className="no-underline mylan-color pointer bold">Đăng ký</a> ngay</span>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
