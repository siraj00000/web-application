import React from 'react';
import './helper.css';

const Inputbox = ({ label, val, onChangeVal, req, type }) => {
    return (
        <div className='helper-inputbox'>
            <label>{label}</label>
            <input
                type={type || 'text'}
                placeholder={`type here...`}
                value={val}
                onChange={e => onChangeVal(e.target.value)}
                required={req || false}
            />
        </div>
    );
};

export default Inputbox;