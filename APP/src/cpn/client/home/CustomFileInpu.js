import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Navbar, Horizon } from '../../navbar';

const CustomFileInput = ({ onChange, ...props }) => {
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        if (onChange) {
            onChange(event);
        }
    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                {...props}
            />
            <button onClick={handleButtonClick} className="w-max-content p-0-5 shadow-blur shadow-hover bg-theme-color no-border block text-16-px white pointer shadow-blur shadow-hover m-0-5">Select File</button>

        </div>


    );
};

export default CustomFileInput;
