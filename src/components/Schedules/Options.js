import React, { Component } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class Options extends Component {
    constructor(props){
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

        const input = document.querySelector('.scheduler-view');

        if(input !== null) {
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
        return (
            <div className="MasterShift-options">
                <div className="row">
                    <div className="col-md-7">
                        <div class="can-toggle">
                            <input id="my-full" type="checkbox" />
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
            </div>
        );
    }

}

export default Options;