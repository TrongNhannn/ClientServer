import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Horizon } from '../../navbar';


export default () => {
    const dispatch = useDispatch();
    const { navState } = useSelector(state => state);
    const { urls, bottomUrls } = useSelector(state => state.navbarLinks.user)
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
                <div className="p-1" id="app-scrollBox">
                    <div className="p-1 min-height-full-screen column">
                        
                        <div className="m-t-0-5 fill-available bg-white shadow-blur">
                            <div className="w-100-pct h-fit column p-1">
                                <div className="flex flex-no-wrap b">
                                    
                                    
                                </div>
                                <div className="w-100-pct m-t-1">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
               
            </div>
        </div>
    )
}
