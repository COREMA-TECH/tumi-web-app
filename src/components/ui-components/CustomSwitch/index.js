import React, { Fragment } from 'react';

/**
 * Custom Switch
 * @param {string} id
 * @param {string} className
 * @param {function} onChange
 * @param {boolean} checked
 * @param {boolean} value
 * @param {string} name
 * @param {boolean} disabled
 */
const CustomSwitch = props => {
    const {id, className, onChange, checked, value, name, disabled} = props;
    const onChangeFunction = onChange || (() => {});
    return <Fragment>
        <div className="onoffswitch">
            <input
                id={id}
                className={`onoffswitch-checkbox ${className}`}
                onChange={ev => onChangeFunction(ev)}
                checked={checked}
                value={value}
                name={name}
                type="checkbox"
                disabled={!!disabled}
                min="0"
                maxLength="50"
                minLength="10"
            />
            <label className="onoffswitch-label" htmlFor={id}>
                <span className="onoffswitch-inner" />
                <span className="onoffswitch-switch" />
            </label>
        </div>
    </Fragment>
};

export default CustomSwitch;