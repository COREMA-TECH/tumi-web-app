import React, { Fragment } from 'react';

export const OffsideModalTitle = props => {
    //console.log('memo title'); // TODO: (LF) QUITAR CONSOLE LOG
    const {classes, children} = props;
    return <div className={`OffsideModal-title${classes ? ` ${classes}` : ''}`}>
        {children}
    </div>
};

export const OffsideModalContent = props => {
    //console.log('memo content'); // TODO: (LF) QUITAR CONSOLE LOG
    const {classes, children} = props;
    return <div className={`OffsideModal-content${classes ? ` ${classes}` : ''}`}>
        {children}
    </div>
};

export const OffsideModalFooter = props => {
    //console.log('memo footer'); // TODO: (LF) QUITAR CONSOLE LOG
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
    //console.log('offsidemodal .. ', children[0]); // TODO: (LF) QUITAR CONSOLE LOG
    const handlecloseBtn = e => {
        e.preventDefault();
        handleClose();
    };

    return <Fragment>
        <div className={`OffsideModal${classes ? ` ${classes}` : ''}`}>
            {open && <div className="OffsideModal-backdrop"></div>}
            <div className={`OffsideModal-wrapper${open ? ' active' : ''}`}>
                <div className="OffsideModal-header">
                    <a href="#" className="OffsideModal-btnClose" onClick={handlecloseBtn}><i className="fas fa-times"></i></a>
                </div>
                <div className="OffsideModal-container">
                    {children}
                </div>
            </div>
        </div>
    </Fragment>
};


