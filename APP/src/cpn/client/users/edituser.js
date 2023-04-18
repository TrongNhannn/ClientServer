import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import $ from 'jquery';

import { Navbar, Horizon } from '../../navbar';
import ProjectCard from '../projects/suprojects/projectCard'






export default () => {
    const dispatch = useDispatch();
    const { credential_string } = useParams();
    const [user, setUser] = useState({})
    const [height, setHeight] = useState(0)
    const [projects, setProjects] = useState({
        own: { success: false },
        partner: { success: false },
        use: { success: false },
    })

    const [offset, setOffset] = useState({
        x: -500,
        y: -500,
    })

    const [input, setInput] = useState({})

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

        fetch(`${proxy}/api/${unique_string}/user/getall/${credential_string}`).then(res => res.json())
            .then(resp => {
                const { data, success } = resp;
                if (data != undefined && data.length > 0) {
                    const nameSplited = data[0].fullname.split(" ");
                    const usr = { ...data[0], name: nameSplited[nameSplited.length - 1] }
                    setUser(usr)
                }

                fetch(`${proxy}/api/${unique_string}/projects/of/${credential_string}`).then(res => res.json())
                    .then(resp => {
                        const { success, projects } = resp;
                        setProjects(projects)
                    })

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

    const submitChange = () => {
        const { key, value } = input;
        fetch(`${proxy}/api/${unique_string}/user/prop/${user.credential_string}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ key, value }),
        }).then(res => res.json()).then(data => {
            console.log(data);
            const newUser = user;
            newUser[key] = value;
            setUser({ ...newUser });
            setOffset({ x: -500, y: -500 })
        })
    }
    function redirectTo(url) {
        window.location.href = "/su/users";
    }
    const discardChange = () => {
        setOffset({ x: -500, y: -500 })
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
                                    {/* <span> Bảng {page.param}</span> */}
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
                                    {/* <div class="flex flex-no-wrap">
                            <div class="ml-auto1">
                                <div className="m-t">
                                    <button onClick={redirectToInput} className="upper pointer block w-max-content white text-center p-t-0-5 p-b-0-5 p-l-1 p-r-1 m-l-1 no-border bg-green">Thêm mới</button>
                                </div>
                            </div>
                        </div> */}

                                    <div className="m-t-1 p-t-1">
                                        {/* <input  type="text"value={user.fullname} onClick={(e) => updateUserInfo("fullname", e.target.value)} className="text-24-px"/> */}
                                        
                                        <span onClick={(e) => { inputBox(e, "fullname") }} className="block text-20-px">@{user.fullname}</span>
                                        
                                            <span onClick={(e) => { inputBox(e, "email") }} className="block w-50-pct text-20-px m-t-1">{user.email}</span>
                                            <span onClick={(e) => { inputBox(e, "phone") }} className="block w-50-pct text-20-px m-t-1 ">{user.phone}</span>
                                      
                                        <span onClick={(e) => { inputBox(e, "address") }} className="block text-16-px m-t-1">{user.address}</span>

                                        <span className="block text-24-px">{user.account_role && titleCase(user.account_role)}</span>
                                    </div>

                                    <div className="fixed bg-white shadow" style={{ top: `${offset.y}px`, left: `${offset.x}px`, width: "325px" }}>
                                        <div className="flex flex-no-wrap w-100-pct p-0-5">
                                            <input spellCheck="false" id={"input-box"} onBlur={discardChange} onChange={(e) => { setInput({ ...input, value: e.target.value }) }} onKeyUp={enterTrigger} className="no-border border-1-bottom block w-100-pct p-0-5" value={input.value} />
                                            <div className="flex flex-middle w-48-px">
                                                <img onClick={submitChange} className="block w-50-pct pointer" src="/assets/icon/check-color.png" />
                                            </div>
                                            <div className="flex flex-middle w-48-px">
                                                <img onClick={discardChange} className="block w-50-pct pointer" src="/assets/icon/cross-color.png" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-100-pct m-t-1">
                                    <button onClick={redirectTo} className="w-max-content p-0-5 p-l-1 p-r-1 shadow-blur shadow-hover bg-theme-color no-border block text-16-px white pointer shadow-blur shadow-hover">Quay lại</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
