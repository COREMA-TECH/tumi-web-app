import React, {Fragment} from 'react';

/**
 * 
 * @param {*} children
 * @param {String} bodyType 
 */
const SideBar = ({children, bodyType}) => {
    let bodyTypeClass = bodyType === "full" ? "Sidebar-expanded" : "Sidebar-reduced";
    return (
        <Fragment>
            <div className={`Sidebar ${bodyTypeClass}`}>
                { children }
            </div>
        </Fragment>
    )
}

export default SideBar;