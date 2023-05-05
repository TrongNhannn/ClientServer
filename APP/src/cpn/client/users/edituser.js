import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import $ from 'jquery';

import { Navbar, Horizon } from '../../navbar';



import { Varchar } from '../version/inputs';



export default () => {
    const dispatch = useDispatch();
    const [error, setError] = useState({});

    const { credential_string } = useParams();
    const { Alert, Confirm, pages } = useSelector(state => state);
    const [user, setUser] = useState({})
    const [height, setHeight] = useState(0)
    const [projects, setProjects] = useState({
        own: { success: false },
        partner: { success: false },
        use: { success: false },
    })
    const al = new Alert(dispatch);
    const cf = new Confirm(dispatch)
    const [offset, setOffset] = useState({
        x: -500,
        y: -500,
    })

    const props = [
        { name: "fullname", label: "Họ tên" },
        { name: "email", label: "Email" },
        { name: "phone", label: "Di động" },
        { name: "address", label: "Địa chỉ" },
    ]


    const [input, setInput] = useState({})


    const validateField = (field, value, updateError = false) => {
        let errorMessage = "";
        switch (field) {
            case "account_string":
                if (!value || value.length < 3 || value.length > 20) {
                    errorMessage = "Tên đăng nhập từ 3-20 ký tự";
                }
                break;
            case "pwd_string":
                if (!value || value.length < 8) {
                    errorMessage = "Mật khẩu phải có ít nhất 8 ký tự";
                }
                break;
            case "account_role_label":
                if (!value) {
                    errorMessage = "Vui lòng chọn loại tài khoản";
                }
                break;
            case "fullname":
                if (!value || value.length < 1) {
                    errorMessage = "Vui lòng nhập tên người dùng";
                }
                break;
            case "email":
                const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
                if (!value || !emailRegex.test(value)) {
                    errorMessage = "Vui lòng nhập địa chỉ email hợp lệ";
                }
                break;
            case "phone":
                const phoneRegex = /^(\+\d{1,2})?\d{10}$/;
                if (!value || !phoneRegex.test(value)) {
                    errorMessage = "Vui lòng nhập số điện thoại hợp lệ";
                }
                break;
            case "address":
                if (!value || value.length < 1) {
                    errorMessage = "Vui lòng nhập địa chỉ";
                }
                break;
            default:
                break;
        }
        if (updateError) {
            setError((prevError) => ({ ...prevError, [field]: errorMessage }));
        }
        return errorMessage;

    };
    const { urls, bottomUrls } = useSelector(state => state.navbarLinks.su)
    const { navState, unique_string, proxy, defaultImage } = useSelector(state => state);
    const { titleCase } = useSelector(state => state.functions)

    useEffect(() => {
        dispatch({
            type: "setNavBarHighLight",
            payload: { url_id: 2 }
        })

        const height = $('#ava-container').width() * 75 / 100;
        setHeight(height)

        fetch(`${proxy()}/api/${unique_string}/user/getall/${credential_string}`).then(res => res.json())
            .then(resp => {
                const { data, success } = resp;
                if (data != undefined && data.length > 0) {
                    const nameSplited = data[0].fullname.split(" ");
                    const usr = { ...data[0], name: nameSplited[nameSplited.length - 1] }
                    // console.log(usr)
                    setUser(usr)
                }

                // fetch(`${proxy}/api/${unique_string}/projects/of/${credential_string}`).then(res => res.json())
                //     .then(resp => {
                //         const { success, projects } = resp;
                //         setProjects(projects)
                //     })

            })
    }, [])

    window.onresize = () => {
        const height = $('#ava-container').width() * 75 / 100;
        setHeight(height)
    }

    const inputBox = (e, key) => {
        const $target = $(e.target);
        const targetOffset = $target.offset()
        const { left, top } = targetOffset;
        setInput({ key, value: user[key] })
        setOffset({ x: left, y: top + 32 })
        $('#input-box').focus()
    }

    const enterTrigger = (e) => {
        if (e.keyCode === 13) {
            submitChange()
        }
    }
    // Hàm kiểm tra tính hợp lệ của từng trường và cập nhật lỗi nếu cần


    // Hàm kiểm tra tất cả các trường và cập nhật thông báo lỗi
    const validateAllFieldsAndUpdateErrors = () => {
        let allValid = true;

        props.forEach(prop => {
            const errorMessage = validateField(prop.name, user[prop.name], false);
            if (errorMessage) {
                setError(prevError => ({ ...prevError, [prop.name]: errorMessage }));
                allValid = false;
            }
        });

        return allValid;
    };

    // Hàm xử lý việc gửi yêu cầu cập nhật thông tin người dùng
    const submitChange = () => {
        if (!validateAllFieldsAndUpdateErrors()) {
            al.failure("Thất bại", "Vui lòng điền đầy đủ và chính xác thông tin");
            return;
        }

        const apiUrl = `${proxy()}/api/${unique_string}/user/update/${user.credential_string}`;
        // Gửi yêu cầu POST đến máy chủ với thông tin người dùng
        fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),

        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    // Xử lý thành công
                    al.success("Thành công", "Cập nhật thông tin người dùng thành công");
                } else {
                    // Xử lý lỗi
                    al.failure("Thất bại", "Cập nhật thông tin người dùng thất bại");
                }
            })
            .catch((error) => {
                console.error('Lỗi khi gửi yêu cầu:', error);
            });
    };


    function redirectTo(url) {
        window.location.href = "/su/users";
    }
    const discardChange = () => {
        setOffset({ x: -500, y: -500 })
    }

    const changeUserData = (e, prop) => {
        const newUser = user;
        newUser[prop] = e.target.value;
        setUser(newUser);
    }

    const askUserRole = () => {
        const changeRole = (role) => {
            const { label, value } = role;
            setUser({ ...user, account_role: value })
        }

        const roles = [
            { id: 0, label: "Người dùng", value: "user" },
            { id: 1, label: "Người quản trị", value: "admin" },
        ]

        cf.askForSelection("Chọn quyền", "", changeRole, roles)
    }

    return (

        <div className="fixed-default fullscreen main-bg overflow flex flex-no-wrap">
            <Navbar urls={urls}
            />
            <div id="app-container" className={`app fixed-default overflow ${!navState ? "app-stretch" : "app-scaled"}`} style={{ height: "100vh" }}>
                <Horizon />
                <div className="p-1" id="app-scrollBox">
                    <div className="p-1 min-height-full-screen column">
                        <div className="w-100-pct">
                            <div className="flex flex-no-wrap bg-white shadow-blur">
                                <div className="fill-available p-1">
                                    <span> Cập nhật người dùng </span>
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
                                        <div className="p-1">
                                            {/* <button onClick={redirectToInput} className="bold text-24-px no-border bg-green white border-radius-50-pct pointer" style={{ width: "32px", height: "32px" }}>+</button> */}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-100-pct m-t-1">
                                    <div className="w-50-pct mg-auto p-1 bg-white">
                                        <span className="block text-32-px text-center p-0-5">Cập nhật</span>
                                        {/* {
                                            props.map(prop =>
                                                <div className="w-100-pct p-1 m-t-1">
                                                    <div>
                                                        <div>
                                                            <span className="block text-16-px">{prop.label}</span>
                                                        </div>
                                                        <div className="m-t-0-5">
                                                            <input type="text"
                                                                className="p-t-0-5 p-b-0-5 p-l-1 text-16-px block w-100-pct border-1"
                                                                placeholder="" onChange={(e) => { changeUserData(e, prop.name) }} defaultValue={user[prop.name]}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                            )
                                        } */}

                                        {
                                            props.map(prop =>
                                                <div className="w-100-pct p-1 m-t-1" key={prop.name}>
                                                    <div>
                                                        <div>
                                                            <span className="block text-16-px">{prop.label}</span>
                                                        </div>
                                                        <div className="m-t-0-5">
                                                            <input type="text"
                                                                className="p-t-0-5 p-b-0-5 p-l-1 text-16-px block w-100-pct border-1"
                                                                placeholder=""
                                                                onChange={(e) => { changeUserData(e, prop.name) }}
                                                                onBlur={(e) => { validateField(prop.name, e.target.value, true) }}
                                                                onInput={(e) => { validateField(prop.name, e.target.value, true) }}
                                                                defaultValue={user[prop.name]}
                                                            />
                                                        </div>
                                                        <span className="text-red-500 block w-80-pct ">
                                                            <div className="rel p-b-0-5">
                                                                <div className="abs">

                                                                    <span className="block text-red text-12-px">
                                                                        {error[prop.name] && <div className="text-red text-14-px">{error[prop.name]}</div>}
                                                                    </span>
                                                                </div>

                                                            </div>
                                                        </span>

                                                    </div>
                                                </div>
                                            )
                                        }



                                        <div className="w-100-pct p-1 m-t-1">
                                            <div>
                                                <div>
                                                    <span className="block text-16-px">{"Quyền"}</span>
                                                </div>
                                                <div className="m-t-0-5">
                                                    <input type="text"
                                                        className="p-t-0-5 p-b-0-5 p-l-1 text-16-px block w-100-pct border-1"
                                                        placeholder="" onFocus={askUserRole} value={user.account_role == "user" ? "Người dùng" : "Người quản trị"}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-100-pct m-t-1 flex flex-no-wrap p-0-5">
                                            <button onClick={submitChange} className="w-max-content p-0-5 p-l-1 p-r-1 m-0-5 shadow-blur shadow-hover bg-theme-color no-border block text-16-px white pointer shadow-blur shadow-hover">Cập nhật</button>
                                            <button onClick={redirectTo} className="w-max-content p-0-5 p-l-1 p-r-1 m-0-5 shadow-blur shadow-hover bg-theme-color no-border block text-16-px white pointer shadow-blur shadow-hover">Quay về</button>
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
