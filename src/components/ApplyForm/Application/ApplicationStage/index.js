import React, { Component, Fragment } from 'react';
import withApollo from 'react-apollo/withApollo';
import gql from 'graphql-tag';

const GET_APPLICATION_STAGE = gql`
	query getApplicationStage($applicationId: Int) {
		getApplicationStage(applicationId: $applicationId) {
			id
		}
	}
`;

class ApplicationStage extends Component {

    state = {
        isLead: false,
        isApplicant: false,
        isCandidate: false,
        isEmployee: false
    }

    getApplicationStage = () => {
        this.props.client.query({
            query: GET_APPLICATION_STAGE,
            variables: { applicationId: 1 },
            fetchPolicy: 'no-cache'
        }).then(({ data }) => {
            
        }).catch();
    }

    render() {
        return <Fragment>
        </Fragment>
    }
}

export default withApollo(ApplicationStage);