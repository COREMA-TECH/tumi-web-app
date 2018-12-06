import gql from 'graphql-tag';

export const GET_HOLIDAYS = gql`
	query holidays($id: Int) {
		holidays(id: $id) {
			id
            title
            start:startDate
            end:endDate
		}
		
	}
`;