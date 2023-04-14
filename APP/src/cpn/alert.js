import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

const oke = "Tiếp tục"

export default () => {
    const { Alert, alert } = useSelector(state => state);
    const { fired, type, label, message } = alert;
    const dispatch = useDispatch()

    useEffect(() => {
        if( fired == true ){            
            setTimeout(() => {
                closeAlert()
            }, 1500)
        }
    }, [ fired ])

    const closeAlert = () => {
        const al = new Alert(dispatch)
        al.closeAlert()
    }

    if (fired) {
        if (type == "success") {
            return (
                <div className="fixed-default z-index-11 flex flex-middle fullscreen p-1">
                    <div className="rel z-index-2 alert bg-white pop-in column border-radius-12-px">
                        <span className="block text-32-px text-center p-0-5">{label}</span>
                        <div className="icon-box rel">
                            <span className="success-circle" />
                            <span className="success-left" />
                            <span className="success-right" />
                        </div>
                        <span className="block w-100-pct text-20-px text-center p-1">{message}</span>
                    </div>
                    <div onClick={closeAlert} className="abs-default z-index-1 fullscreen trans-dark-25"></div>
                </div>
            )
        }
        if (type == "warning") {
            return (
                <div className="fixed-default z-index-11 flex flex-middle fullscreen p-1">
                    <div className="rel z-index-2 alert bg-white pop-in column border-radius-12-px">
                        <span className="block text-32-px text-center p-0-5">{label}</span>
                        <div className="icon-box rel">
                            <span className="warning-circle">
                                <span className="warning-i">i</span>
                            </span>

                        </div>
                        <span className="block w-100-pct text-20-px text-center p-1">{message}</span>
                    </div>
                    <div onClick={closeAlert} className="abs-default z-index-1 fullscreen trans-dark-25"></div>
                </div>
            )
        }
        if (type == "failure") {
            return (
                <div className="fixed-default z-index-11 flex flex-middle fullscreen p-1">
                    <div className="rel z-index-2 alert bg-white pop-in column border-radius-12-px">
                        <span className="block text-32-px text-center p-0-5">{label}</span>
                        <div className="icon-box rel">
                            <span className="failure-circle" />
                            <span className="failure-left" />
                            <span className="failure-right" />
                        </div>
                        <span className="block w-100-pct text-20-px text-center p-1">{message}</span>
                    </div>
                    <div onClick={closeAlert} className="abs-default z-index-1 fullscreen trans-dark-25"></div>
                </div>
            )
        }
    } else {
        return null
    }
}
