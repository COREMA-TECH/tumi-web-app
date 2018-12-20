import React, {Component} from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import PropTypes from 'prop-types';
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import {withStyles} from "@material-ui/core";
import green from "@material-ui/core/colors/green";
import './index.css';

const styles = (theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '30px',
        width: '100%'
    },
    root: {
        display: 'flex',
        alignItems: 'center'
    },
    formControl: {
        margin: theme.spacing.unit
        //width: '100px'
    },
    button: {
        margin: theme.spacing.unit
    },
    input: {
        display: 'none'
    },
    wrapper: {
        position: 'relative'
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700]
        }
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12
    }
});

class Options extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openModal: false
        }
    }

    handleClose = () => {
        this.setState({
            openModal: false
        })
    };

    /**
     * Function to create a canvas element based
     * on the capture of a specific html element
     * and then pass it to .pgn to establish it
     * within a pdf document.
     */
    printSchedule() {
        let title = "Banquet Server";

        const input = document.getElementById('printPreview');

        if (input !== null) {
            html2canvas(input)
                .then((canvas) => {
                    const imgData = canvas.toDataURL('image/png');
                    let pdf = new jsPDF({
                        orientation: 'landscape',
                        unit: 'in',
                        format: [13, 10]
                    });

                    let textWidth = pdf.getStringUnitWidth("Banquet Server | Schedule") * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
                    let textOffset = (pdf.internal.pageSize.width - textWidth) / 2;

                    pdf.addImage(imgData, 'JPEG', .0, .8);

                    pdf.setTextColor(72, 174, 225);
                    pdf.setFontSize(13);
                    pdf.text(title, .2, .3);

                    // pdf.setLineDash(3,3);
                    // pdf.setLineWidth(.01);
                    // pdf.line(3, 0, 120, 3);
                    // pdf.circle(140, 120, 15, 'FD');


                    alert("alert");
                    pdf.save("download.pdf");
                });
        }

    }

    render() {
        const {classes} = this.props;
        const {fullScreen} = this.props;

        let renderPrintPreview = () => (
            <Dialog
                fullScreen={fullScreen}
                open={this.state.openModal}
                onClose={this.handleClose}
                aria-labelledby="responsive-dialog-title"
                maxWidth="lg"
            >
                <form id="employee-form">
                    <DialogTitle style={{padding: '0px'}}>
                        <div className="modal-header">
                            <h5 className="modal-title text-success">Print Schedule</h5>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        {/**
                         * TODO: Schedule structure
                         **/}
                        <div id="printPreview">
                            <table>
                                <thead>
                                <tr>
                                    <th></th>
                                    <th>
                                        <span className="day">1</span>
                                        <span className="long">Monday</span>
                                        <span className="short">Mon</span>
                                    </th>
                                    <th>
                                        <span className="day">2</span>
                                        <span className="long">Tuesday</span>
                                        <span className="short">Tue</span>
                                    </th>
                                    <th>
                                        <span className="day">3</span>
                                        <span className="long">Wendsday</span>
                                        <span className="short">We</span>
                                    </th>
                                    <th>
                                        <span className="day">4</span>
                                        <span className="long">Thursday</span>
                                        <span className="short">Thur</span>
                                    </th>
                                    <th>
                                        <span className="day ">5</span>
                                        <span className="long">Friday</span>
                                        <span className="short">Fri</span>
                                    </th>
                                    <th>
                                        <span className="day">6</span>
                                        <span className="long">Saturday</span>
                                        <span className="short">Sat</span>
                                    </th>
                                    <th>
                                        <span className="day">7</span>
                                        <span className="long">Sunday</span>
                                        <span className="short">Sun</span>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="hour" rowSpan="4"><span>1:00</span></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="hour" rowSpan="4"><span>2:00</span></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>

                                <tr>
                                    <td className="hour" rowSpan="4"><span>3:00</span></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="hour" rowSpan="4"><span>4:00</span></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="hour" rowSpan="4"><span>5:00</span></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="hour" rowSpan="4"><span>6:00</span></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="hour" rowSpan="4"><span>7:00</span></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="hour" rowSpan="4"><span>8:00</span></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </DialogContent>
                    <DialogActions
                        style={{
                            background: '#FFF',
                            position: 'sticky',
                            bottom: 0,
                            right: 0,
                            boxShadow: '1px -1px 10px #ddd',
                            margin: 0,
                            padding: '.5em'
                        }}>
                        <div className={[classes.root]}>
                            <div className={classes.wrapper}>
                                <button
                                    type="submit"
                                    variant="fab"
                                    className="btn btn-success"
                                    onClick={this.printSchedule}
                                >
                                    Print {!this.state.saving && <i className="fas fa-print"></i>}
                                    {this.state.saving && <i class="fas fa-spinner fa-spin"/>}
                                </button>
                            </div>
                        </div>
                        <div className={classes.root}>
                            <div className={classes.wrapper}>
                                <button
                                    variant="fab"
                                    className="btn btn-danger"
                                    onClick={this.handleClose}
                                >
                                    Cancel <i class="fas fa-ban"/>
                                </button>
                            </div>
                        </div>
                    </DialogActions>
                </form>
            </Dialog>
        );

        return (
            <div className="MasterShift-options">
                <div className="row">
                    <div className="col-md-7">
                        <div class="can-toggle">
                            <input id="my-full" type="checkbox"/>
                            <label for="my-full">
                                <div class="can-toggle__switch" data-checked="MY" data-unchecked="FULL"></div>
                            </label>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <button
                            type="button"
                            className="btn btn-link MasterShift-btn"
                            onClick={() => {
                                this.setState({
                                    openModal: true
                                })
                            }}
                        >
                            <i class="fas fa-print"></i>
                        </button>
                    </div>
                </div>

                {
                    renderPrintPreview()
                }
            </div>
        );
    }

}

Options.propTypes = {
    classes: PropTypes.object.isRequired,
    fullScreen: PropTypes.bool.isRequired
};

export default withStyles(styles)(Options);