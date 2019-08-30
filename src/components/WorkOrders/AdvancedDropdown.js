import React from 'react';

const AdvancedDropdown = ({ children, isVisible, closeAction }) => {
    return(
        <div className={`AdvancedDropdown ${ isVisible ? 'd-block' : 'd-none' }`}>
            <div className="AdvancedDropdown-wrapper tumi-col-centered">
                <span className="AdvancedDropdown-close" onClick={closeAction}>&times;</span>
                { children }            
            </div>
        </div>
    );
};

export default AdvancedDropdown;