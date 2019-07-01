import gql from 'graphql-tag';

export const CREATE_VISIT_QUERY = gql`
	mutation addVisit($visits: [inputInsertVisit]) {
		addVisit(visits: $visits) {
            id,
            startTime,
            endTime,
            url,
            comment,
            startLatitude,
            startLongitude,
            endLatitude,
            endLongitude,
            OpManagerId,
            BusinessCompanyId
		}
	}
`;

export const UPDATE_VISIT_QUERY = gql`
    mutation updateVisit($visit: inputUpdateVisit){
        updateVisit(visit: $visit){
            id
        }
    }
`;