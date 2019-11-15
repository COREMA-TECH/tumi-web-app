import React, { Fragment, memo } from 'react';

export const OffsideModalTitle = memo(props => {
    console.log('memo title'); // TODO: (LF) QUITAR CONSOLE LOG
    const {classes, children} = props;
    return <div className={`OffsideModal-title${classes ? ` ${classes}` : ''}`}>
        {children}
    </div>
});

export const OffsideModalContent = memo(props => {
    console.log('memo content'); // TODO: (LF) QUITAR CONSOLE LOG
    const {classes, children} = props;
    return <div className={`OffsideModal-content${classes ? ` ${classes}` : ''}`}>
        {children}
    </div>
});

export const OffsideModalFooter = memo(props => {
    console.log('memo footer'); // TODO: (LF) QUITAR CONSOLE LOG
    const {classes, children} = props;
    return <div className={`OffsideModal-footer${classes ? ` ${classes}` : ''}`}>
        {children}
    </div>
});

export const OffsideModal = memo(props => {
    const {open, classes, children, handleClose} = props;
    console.log('offsidemodal .. ', children[0]); // TODO: (LF) QUITAR CONSOLE LOG
    const handlecloseBtn = e => {
        e.preventDefault();
        handleClose();
    };

    return <Fragment>
        <div className={`OffsideModal${classes ? ` ${classes}` : ''}`}>
            {open && <div className="OffsideModal-backdrop"></div>}
            <div className="OffsideModal-wrapper">
                <div className="OffsideModal-header">
                    <a href="#" className="OffsideModal-btnClose" onClick={handlecloseBtn}>X</a>
                </div>
                <div className="OffsideModal-container">
                    {children}
                </div>
            </div>
        </div>
    </Fragment>
}, (prevProps, nextProps) => {
    const res = prevProps.open === nextProps.open;
    console.log(res); // TODO: (LF) QUITAR CONSOLE LOG
    return res
});


