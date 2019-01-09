import gql from 'graphql-tag';

export const GET_WORKORDERS_QUERY = gql`
	query workOrder($id: Int) {
		workOrder(id: $id, status: 1) {
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
			}
			BusinessCompany
			{
				Id
				Name
			}
		}
	}
`;

export const GET_SHIFTS = gql`
query ShiftWorkOrder ($WorkOrderId: Int)
{
	ShiftWorkOrder(WorkOrderId:$WorkOrderId){
			ShiftId
			WorkOrderId
		}
    }
`;

export const GET_DETAIL_SHIFT = gql`
query ShiftDetail ($ShiftId:Int)
{
ShiftDetail (ShiftId:$ShiftId) {
	id
	ShiftId
	start: startDate
	startTime
	end: endDate
	endTime
	detailEmployee {
		EmployeeId
		ShiftDetailId
		Employees
	  {
		id
		firstName
		lastName
	  }
	}
}
}
`

export const GET_INITIAL_DATA = gql`
query data {
    employees(isActive:true) {
      id
      firstName
      lastName
      electronicAddress
      mobileNumber
      
    } 
    getbusinesscompanies(Id: null, IsActive: 1, Contract_Status: null, Id_Parent: -1) {
          Id
          Code
          Name         
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
			Electronic_Address
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
