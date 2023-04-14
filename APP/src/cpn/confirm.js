import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';

const oke = "Ô kê luôn"

export default () => {
    const { type, fired, label, message, func, defaultValue, collection } = useSelector( state => state.confirm );
    const dispatch = useDispatch()
    const [ data, setData ] = useState("")

    useEffect(() => {
        let value = ""
        if( defaultValue ){
            value = defaultValue
        }
        setData(value)
    }, [func])

    const rejectConfirm = () => {
        closeConfirm();
        func(false)
    }

    const acceptAndCloseConfirm = () => {
        closeConfirm()
        func(true)
    }

    const closeConfirm = () =>{
        dispatch({
            branch: "alert",
            type: "alertOut",
        })
    }

    const submitString = () => {
        closeConfirm()
        func(data)
    }

    const keyUpTrigger = (e) => {
        if( e.keyCode === 13 ){
            submitString()
        }
    }

    if( fired ){
        if( type == "ask_yes_no" ){
            return(
                <div className="fixed-default z-index-11 flex flex-middle fullscreen p-1">
                    <div className="rel z-index-2 alert bg-white pop-in column border-radius-12-px">
                        <span className="block text-32-px text-center p-0-5">{ label }</span>
                        <div className="icon-box rel">
                            <span className="warning-circle">
                                <span className="warning-i">i</span>
                            </span>

                        </div>
                        <span className="block w-100-pct text-20-px text-center p-1">{ message }</span>

                        <div className="flex flex-no-wrap">
                            <button className="pointer m-1 p-1 shadow-blur text-16-px block border-radius-12-px bg-white w-100-pct no-border"
                                onClick={ rejectConfirm }>
                                <span className="block hover-scaled hover-text-safe theme-color">Huỷ thao tác</span>
                            </button>
                            <button className="pointer m-1 p-1 shadow-blur text-16-px block border-radius-12-px bg-white w-100-pct no-border"
                                onClick={ acceptAndCloseConfirm }>
                                <span className="block hover-scaled hover-text-danger crimson">Tiếp tục</span>
                            </button>
                        </div>
                    </div>
                    <div onClick={ closeConfirm } className="abs-default z-index-1 fullscreen trans-dark-25"></div>
                </div>
            )
        }
        if( type=="ask_for_string" ){
            return(
                <div className="fixed-default z-index-11 flex flex-middle fullscreen p-1">
                    <div className="rel z-index-2 alert bg-white pop-in column border-radius-12-px">
                        <span className="block text-32-px text-center p-0-5">{ label }</span>
                        <div className="flex flex-wrap abs l-0 b-0 w-100-pct">
                            <div className="p-0-5 w-100-pct">
                                <input className="no-border border-1-bottom p-0-5 block w-100-pct text-18-px text-center border-radius-12-px"
                                    value={ data } spellCheck="false"
                                    onChange={ (e) => { setData(e.target.value) } }
                                    onKeyUp={ keyUpTrigger }
                                />
                            </div>
                            <button className="pointer m-t-1 p-1 text-16-px block border-radius-12-px bg-white w-100-pct no-border border-1-bottom"
                                onClick={ submitString }>
                                <span className="block hover-scaled hover-text-safe">{ message }</span>
                            </button>
                        </div>
                    </div>
                    <div onClick={ closeConfirm } className="abs-default z-index-1 fullscreen trans-dark-25"></div>
                </div>
            )
        }

        if( type == "ask_for_selection" ){
            return(
                <div className="fixed-default z-index-11 flex flex-middle fullscreen p-1">
                    <div className="rel z-index-2 alert bg-white pop-in column border-radius-12-px">
                        <span className="block text-32-px text-center p-0-5">{ label }</span>
                        <div className="flex flex-wrap w-100-pct">
                            <div className="w-100-pct" style={{ maxHeight: 415, overflow: "auto" }}>
                                { collection.map( row =>
                                    <div className="w-100-pct no-border border-1-bottom hover border-radius-12-px" onClick={ () => { closeConfirm() ; func( row ) } }>
                                        <span className="text-16-px text-center pointer block p-1">{ row.label }</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div onClick={ closeConfirm } className="abs-default z-index-1 fullscreen trans-dark-25"></div>
                </div>
            )
        }

    }else{
        return null
    }
}
