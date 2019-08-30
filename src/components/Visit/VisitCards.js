import React from 'react';


const imgDefaultUser = '../../../images/tumi-user.png';

const visitsCards = ({ opManager, visit, handleCloseVisit, handleDisableVisit }) => {
    return (
        <div className="col-xs-1 col-md-3 col-lg-2 p-2 ">
            <div className="card h-100 visitsCard">
                <img src="https://media-cdn.tripadvisor.com/media/photo-s/0d/73/31/ef/foto-de-la-fachada-noche.jpg" className="card-img-top" alt="..." />
                <div className="card-body py-0">
                    <div className="row pt-0">
                        <div className="col-5 p-0 pl-2"  >
                            <img src={visit.url || imgDefaultUser} alt={opManager.Full_Name} className="rounded visitsCard-pic" />
                        </div>
                        <div className="col-7 p-0 pl-1">
                            <small>visitor</small>
                            <h6 className="font-weight-bold">{opManager.Full_Name}</h6>
                            <small>Operation Manager</small>
                        </div>
                    </div>
                    
                    <div className="card-text">
                        <table>
                            <thead>
                                <tr>
                                    <th colSpan="2">
                                        <span className="font-weight-bold">Time of the Visit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>In:</th>
                                    <td>{visit.startTime}</td>
                                </tr>
                                <tr>
                                    <th>Out:</th>
                                    <td>{visit.endTime}</td>
                                </tr>
                            </tbody>
                        </table>

                        <span className="font-weight-bold mt-2">Comment:</span>
                        <p>{visit.comment}</p>
                    </div>
                </div>
                <div className="card-footer bg-transparent visitsCard-footer">
                    <div className="float-right">
                        <button 
                            type="button"
                            onClick={() => handleDisableVisit(visit)}
                            className="btn btn-sm btn-danger"
                        >
                            <i className="fa fa-trash" aria-hidden="true"></i>
                        </button>
                        <button 
                            type="button"
                            onClick={() => handleCloseVisit(visit.id)}
                            className="btn btn-sm btn-primary ml-2"
                        >
                            View Detail
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default visitsCards;