import React from 'react';

const AdvancedDropdown = ({ children, isVisible }) => {
    return(
        <div className={`AdvancedDropdown ${ isVisible ? 'd-block' : 'd-none' }`}>
            { children }
        </div>
    );
};

export default AdvancedDropdown;