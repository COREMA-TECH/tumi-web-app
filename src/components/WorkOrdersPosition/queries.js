import gql from 'graphql-tag';

export const GET_WORKORDERS_QUERY = gql`
	query workOrder($id: Int) {
		workOrder(id: $id, status: 2) {
			id
			quantity
			shift
			needExperience
			needEnglish
			startDate
			endDate
			comment
			date
			IdEntity
			PositionRateId
			status
			position {
				Position
			}
		}
	}
`;

export const GET_HOTEL_QUERY = gql`
	query hotels($id: Int) {
		getbusinesscompanies(Id: $id, IsActive: null, Contract_Status: null, Id_Parent: null) {
			Id
			Name
		}
	}
`;

export const GET_POSITION_BY_QUERY = gql`
	query getPosition($id: Int) {
		getposition(Id: null, IsActive: null, Id_Entity: $id) {
			Id
			Position
		}
	}
`;
