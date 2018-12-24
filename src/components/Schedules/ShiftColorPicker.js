'use strict'

import React from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'

class ShiftColorPicker extends React.Component {
    state = {
        displayColorPicker: false
    };

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };



    render() {
        const styles = reactCSS({
            'default': {
                color: {
                    width: '100%',
                    height: '14px',
                    borderRadius: '2px',
                    background: this.props.color,
                },
                swatch: {
                    padding: '5px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                    width: '100%'
                },
                popover: {
                    position: 'absolute',
                    zIndex: '2',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
            },
        });

        return (
            <div>
                <label htmlFor="">Color</label>
                <div style={styles.swatch} onClick={this.handleClick}>
                    <div style={styles.color} />
                </div>
                {this.state.displayColorPicker ? <div style={styles.popover}>
                    <div style={styles.cover} onClick={this.handleClose} />
                    <SketchPicker color={this.props.color} onChange={this.props.onChange} />
                </div> : null}

            </div>
        )
    }
}

export default ShiftColorPicker