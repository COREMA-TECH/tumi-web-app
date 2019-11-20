import React, {Fragment} from 'react';

/**
 * 
 * @param {*} children
 * @param {String} bodyType 
 */
const SideBar = ({children, bodyType}) => {
    let bodyTypeClass = bodyType === "full" ? "sideBar-expanded" : "sideBar-reduced";
    return (
        <Fragment>
            <div className={`Sidebar ${bodyTypeClass}`}>
                { children }
            </div>
        </Fragment>
    )
}

export default SideBar;