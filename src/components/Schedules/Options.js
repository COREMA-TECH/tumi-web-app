import React, { Component } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class Options extends Component {

    /**
     * Function to create a canvas element based
     * on the capture of a specific html element
     * and then pass it to .pgn to establish it
     * within a pdf document.
     */
    printSchedule() {
        const input = document.getElementById('divToPrint');
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'in',
                    format: [13, 10]
                });

                pdf.addImage(imgData, 'JPEG', 0, 0);
                pdf.save("download.pdf");
            });
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
                            onClick={this.printSchedule}
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