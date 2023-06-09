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

    const currentUserCredentialString = localStorage.getItem("credential_string");


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
        if (user.credential_string === currentUserCredentialString) {
            al.failure("Thất bại", "Bạn không thể xóa tài khoản của chính mình");
        } else {
            cf.askYesNo("Xác nhân ?", "Người dùng này sẽ bị xóa vĩnh viễn", removeUser);
        }
    };


    const removeUser = (conf) => {
        if (conf) {
            if (alterFunc != undefined) {
                alterFunc(user)
            }
            else {
                fetch(`${proxy()}/api/${unique_string}/user/delete/${user.credential_string}`, {
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
                        al.success("Thành công", "Xóa thành công")
                        removeFromUI(user);
                    })
                    .catch(error => {
                        // Show an error message when adding the user fails
                        al.failure("Thất bại", "Xóa thất bại");
                    });
            }
        }

    }



    const redirectToInpuPutUser = (data) => {
        const { credential_string } = user;
        // /su/user/edit/:credential_string
        openTab(`/su/user/edit/${credential_string}`)
    }
    return (
        <tr>
            <td className='text-left'>{user.fullname}</td>
            <td className='text-left'>{user.account_string}</td>
            {/* <td><img className="w-64-px block border-radius-50-pct" src={user.avatar === defaultImage ? user.avatar : `${proxy}/${user.avatar}`} /></td> */}
            <td className='text-left'>{user.email}</td>
            <td className='text-left'>{user.phone}</td>
            <td className='text-left'>{user.address}</td>
            <td className='text-left'>{user.account_role}</td>
            <td className='text-center'>
                <img onClick={redirectToInpuPutUser} className="w-24-px mg-auto m-l-0-5" src={`/assets/icon/edit.png`} width="100%" />
                {user.credential_string !== currentUserCredentialString && (
                    <img onClick={askRemove} className="w-24-px mg-auto m-l-0-5" src={`/assets/icon/delete.png`} width="100%" />
                )}
            </td>


            {/* <td className='text-center'>
                <img onClick={ redirectToInpuPutUser } className="w-24-px mg-auto m-l-0-5" src={`/assets/icon/edit.png`} width="100%" />
                <img onClick={askRemove} className="w-24-px mg-auto m-l-0-5" src={`/assets/icon/delete.png`} width="100%" />
            </td> */}
        </tr>
    )
}
