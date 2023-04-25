import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import UserCard from './usercard';
import { Navbar, Horizon } from '../../navbar';
import UsersMapper from './usersMapper';
import AddUserBox from './adduser';
export default (props) => {
    const dispatch = useDispatch();
    const { navState, proxy, defaultImage, unique_string } = useSelector(state => state);
    const { openTab } = useSelector(state => state.functions)
    const { label, users, removeFromUI } = props;

    const [sus, setSus] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [userlist, setUsers] = useState([]);
    const [userAdd, setUserAdd] = useState(false);
    useEffect(() => {
        dispatch({
            type: "setNavBarHighLight",
            payload: { url_id: 2 }
        })

        fetch(`${proxy()}/api/${unique_string}/user/getall`).then(res => res.json())
            .then(resp => {
                const { data, success } = resp;

                if (data != undefined && data.length > 0) {
                    const _sus = data.filter(user => user.account_role === "su");
                    const _admins = data.filter(user => user.account_role === "admin");
                    const _users = data.filter(user => user.account_role === "user");

                    setSus(_sus); setAdmins(_admins); setUsers(_users)
                }
            })
    }, [])

    const userSplitter = (user) => {
        const { account_role } = user;
        switch (account_role) {
            case "su":
                setSus([...sus, user])
                break;

            case "admin":
                setAdmins([...admins, user])
                break;
            default:
                setUsers([...userlist, user])
        }
    }
    return (
        <div>
            <div className="fixed-default fullscreen main-bg overflow flex flex-no-wrap">

                <div id="app-container" className={`app fixed-default overflow ${!navState ? "app-stretch" : "app-scaled"}`} style={{ height: "100vh" }}>
                    <Horizon />
                    <AddUserBox userAdd={userAdd} setUserAdd={setUserAdd} setUsers={userSplitter} />
                    <div className="p-1" id="app-scrollBox">
                        <div className="p-1 min-height-full-screen column">
                            <div className="w-100-pct">
                                <div className="flex flex-no-wrap bg-white shadow-blur">
                                    <div className="fill-available p-1">
                                        <span> Người dùng</span>
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
                                                <button onClick={() => { setUserAdd(true) }} className="bold text-24-px no-border bg-green white border-radius-50-pct pointer" style={{ width: "32px", height: "32px" }}>+</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-100-pct m-t-1">
                                        <div class="flex flex-no-wrap">
                                            {/* <div class="ml-auto1">
                                <div className="m-t">
                                    <button onClick={redirectToInput} className="upper pointer block w-max-content white text-center p-t-0-5 p-b-0-5 p-l-1 p-r-1 m-l-1 no-border bg-green">Thêm mới</button>
                                </div>
                            </div> */}
                                        </div>
                                        <div className="m-t-1">
                                            <div className="flex flex-wrap w-100-pct">
                                                <table className="w-100-pct">
                                                    <thead>
                                                        <tr>
                                                            <th className="text-left">Họ tên</th>
                                                            <th className="text-left">Tài khoản</th>
                                                            {/* <th className="text-left">Ảnh</th> */}
                                                            <th className="text-left">Email</th>
                                                            <th className="text-left">SĐT</th>
                                                            <th className="text-left">Địa chỉ</th>
                                                            <th className="text-left">Quyền</th>
                                                            <th className="text-center">Công cụ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {users && users.length > 0 ? (
                                                            users.map((user) => (
                                                                <UserCard user={user} key={user.credential_string} removeFromUI={removeFromUI} />))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="7" className="text-center">
                                                                    Không có dữ liệu người dùng.
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

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
