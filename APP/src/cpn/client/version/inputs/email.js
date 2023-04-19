import { useState, useEffect } from 'react';

export default (props) => {
    const { field, changeTrigger, defaultValue } = props;
    const [current, setCurrent] = useState('');
    const [emailError, setEmailError] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(email);
    };

    const fieldChangeData = (e) => {
        const { value } = e.target;
        setCurrent(value);
        if (validateEmail(value) || value === '') {
            setEmailError(false);
            changeTrigger(field, value);
        } else {
            setEmailError(true);
        }
    };

    useEffect(() => {
        setCurrent(defaultValue);
    }, [defaultValue]);

    return (
        <div className="w-100-pct p-1 m-t-1">
            <div>
                <span className="block text-16-px">{field.field_name}</span>
            </div>
            <div className="m-t-0-5">
                <input
                    type="email"
                    className={`p-t-0-5 p-b-0-5 p-l-1 text-16-px block w-100-pct border-1 ${emailError ? 'border-red' : ''}`}
                    value={current}
                    placeholder=""
                    onChange={fieldChangeData}
                />
                {emailError && (
                    <span className="block text-red-500 text-14-px">
                        Địa chỉ email không hợp lệ
                    </span>
                )}
            </div>
        </div>
    );
};
