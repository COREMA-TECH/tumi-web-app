import React, { Component, Fragment } from 'react';

import Accordion from '../ui-components/Accordion';

import withApollo from 'react-apollo/withApollo';
import { GET_OP_MANAGER } from './queries';

class Visit extends Component{

    state = {
        opManagers: []
    }

    getOpManagers = () => {
		this.setState(() => ({ loadingOpManagers: true }), () => {
			this.props.client
				.query({
					query: GET_OP_MANAGER,
					fetchPolicy: 'no-cache'
				})
				.then(({ data }) => {
                    //Set values to state
					this.setState(() => ({
						opManagers: data.user,
						loadingOpManagers: false
					}));

				})
				.catch(error => {
					this.setState(() => ({ loadingOpManagers: false }));
				});
		})
    }

    componentWillMount() {
		this.getOpManagers();
	}

    render() {
        return (
            <Fragment>
                <div className="card">
                    <div className="card-header">
                        Operation managers
                    </div>
                    <div className="card-body">
                        {
                            this.state.opManagers.map(item => {
                                return (
                                    <Accordion key={item.Id} title={item.Full_Name}>
                                        {item.Full_Name}
                                    </Accordion>
                                )
                            })
                        }
                        
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default withApollo(Visit);