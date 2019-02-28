import gql from 'graphql-tag';

export const GET_WORKORDERS_QUERY = gql`
query workOrder($workOrder: inputQueryWorkOrder, $workOrderCompany: inputInsertWorkOrderCompany) {
	workOrder(workOrder: $workOrder, workOrderCompany: $workOrderCompany) {
			id
			quantity
			shift
			endShift
			needExperience
			needEnglish
			startDate
			endDate
			comment
			date
			IdEntity
			contactId
			PositionRateId
			status
			EspecialComment
			dayWeek
			position {
				Position
				Shift
			}
			BusinessCompany
			{
				Id
				Name
			}
		}
	}
`;

export const GET_HOTEL_QUERY = gql`
	query hotels($id: Int) {
		getbusinesscompanies(Id: $id, IsActive: 1, Contract_Status: "'C'", Id_Parent: -1) {
			Id
			Name
		}
	}
`;

export const PHASE_WORK_ORDER = gql`
	query phaseworkOrder($WorkOrderId:Int){
			phaseworkOrder(WorkOrderId:$WorkOrderId){
			userId
			phaseworkOrderId
			actions{
				Id
				Name
			  }
			  users{
				Code_User
			  }
			createdAt
			WorkOrderId
		}
   }
`;

export const GET_POSITION_BY_QUERY = gql`
	query getPosition($id: Int) {
		getposition(Id: null, IsActive: null, Id_Entity: $id) {
			Id
			Position
			Comment
		}
	}
`;

export const GET_CONTACT_BY_QUERY = gql`
	query getcontacts($id: Int) {
		getcontacts(Id: null, IsActive: 1, Id_Entity: $id) {
			Id
			First_Name
			Last_Name
		}
	}
`;

export const GET_RECRUITER = gql`
    query getUsers {
		getusers(Id: null,IsActive: 1 ,IsRecruiter:1) {
            Id
			Id_Contact
			Full_Name
        }
       
    }
    `;
