import React, { Fragment } from 'react';

export const OffsideModalTitle = props => {
    const {classes, children} = props;
    return <div className={`OffsideModal-title${classes ? ` ${classes}` : ''}`}>
        {children}
    </div>
};

export const OffsideModalContent = props => {
    const {classes, children} = props;
    return <div className={`OffsideModal-content${classes ? ` ${classes}` : ''}`}>
        {children}
    </div>
};

export const OffsideModalFooter = props => {
    const {classes, children} = props;
    return <div className={`OffsideModal-footer${classes ? ` ${classes}` : ''}`}>
        {children}
    </div>
};

/**
 * Offside modal
 * @property { boolean } open open/close modal
 * @property { string } classes modal class
 * @property { function } handleClose Close modal
 */
export const OffsideModal = props => {
    const {open, classes, children, handleClose} = props;
    const handlecloseBtn = e => {
        e.preventDefault();
        handleClose();
    };

    return <Fragment>
        <div className={`OffsideModal-wrapper ${open ? 'active' : ''}`}>
            <div className="OffsideModal-header">
                <a href="#" className="OffsideModal-btnClose" onClick={handlecloseBtn}>
                    <i className="fas fa-times"></i>
                </a>
            </div>
            <div className="OffsideModal-container">
                {children}
            </div>
        </div>
    </Fragment>
};


