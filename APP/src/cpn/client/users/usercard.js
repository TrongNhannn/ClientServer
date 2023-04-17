import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
export default (props) => {  
    const { page_param } = useParams()
    const { user, removeFromUI, readOnly, alterFunc, clickTrigger } = props;
    const { proxy, defaultImage, unique_string, Confirm, Alert, pages } = useSelector(state => state);
    const { openTab } = useSelector(state => state.functions)
    const [hiddenMenu, setHiddenMenu] = useState(false);
    
    const dispatch = useDispatch()
    const cf = new Confirm(dispatch)
    const al = new Alert(dispatch)

   
    console.log(page_param)
    const handleClick = () => {
        alert('Chưa có tính năng này');
    };

    const redirect = () => {
        if (!hiddenMenu) {
            openTab(`/su/user/${user.credential_string}`)
        }
    }

    const ctxMenu = (e) => {
        e.preventDefault();
        if (!readOnly) {
            setHiddenMenu(!hiddenMenu);
        }
    }

    const askRemove = () => {
        cf.askYesNo("Xóa người dùng ?", "Người dùng này sẽ bị xóa vĩnh viễn", removeUser)
    }

    const removeUser = ( conf ) => {
        if( conf ){
            if (alterFunc != undefined) {
                alterFunc(user)
            }
            else {
                fetch(`${proxy}/api/${unique_string}/user/delete/${user.credential_string}`, {
                    method: 'DELETE',
                    headers: {
                        "content-type": "application/json",
                    },
                })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Xóa người dùng thất bại');
                    }
                    return res.json();
                })
                .then((data) => {
                    al.success("Thành công","Xóa thành công")
                    removeFromUI(user);
                })
                .catch(error => {
                    // Show an error message when adding the user fails
                    al.failure("Thất bại", "Xóa thất bại");
                });
            }
        }   
        
    }


    const redirectToInput = () => {
        openTab(`/su/api/put/input/${id_str_post}/`)
    }
    const redirectToInpuPutUser = (data) => {
        const id_str_put = page.apis.put.split(`/`)[4];

        let rawParams = page.apis.put.split(`/${id_str_put}/`)[1];

        const keys = Object.keys(data);
        keys.map(key => {
            const value = data[key];
            rawParams = rawParams.replaceAll(key, value);
        })
        // /su/user/edit/:credential_string
        openTab(`/su/api/put/input/${id_str_put}/${rawParams}`)
    }
    return (
        <tr>
            <td className='text-left'>{user.fullname}</td>
            <td className='text-left'>{user.account_string}</td>
            <td><img className="w-64-px block border-radius-50-pct" src={user.avatar === defaultImage ? user.avatar : `${proxy}/${user.avatar}`} /></td>
            <td className='text-left'>{user.email}</td>
            <td className='text-left'>{user.phone}</td>
            <td className='text-left'>{user.address}</td>
            <td className='text-left'>{user.account_role_label}</td>
            <td className='text-center'>
                <img onClick={ redirectToInpuPutUser } className="w-24-px mg-auto m-l-0-5" src={`/assets/icon/edit.png`} width="100%" />
                <img onClick={askRemove} className="w-24-px mg-auto m-l-0-5" src={`/assets/icon/delete.png`} width="100%" />
            </td>
        </tr>
    )
}
