import gql from 'graphql-tag';

/*export const GET_WORKORDERS_QUERY = gql`
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
`;*/

export const GET_WORKORDERS_QUERY = gql`
query ShiftBoard($shift: inputShiftQuery,$shiftEntity: inputShiftBoardCompany,$workOrder: inputQueryWorkOrder,) {
	ShiftBoard(shift: $shift, shiftEntity: $shiftEntity,workOrder:$workOrder)  {
		id,
		title,
		quantity,
		workOrderId,
		CompanyName,
		needExperience,
		needEnglish,
		zipCode,
		Id_positionApplying,
		positionName
		status
		isOpening
		shift
		endShift
		startDate
		endDate
		count
		date
		comment
		EspecialComment
		dayWeeks: dayWeek
		IdEntity
		contactId
		PositionRateId
		departmentId
	}
	getusers(Id: null,IsActive: 1) {
		Id
		Id_Contact
	}
	getcontacts(Id: null,IsActive: 1) {
		Id
		First_Name
		Last_Name
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
	ShiftDetailbyShift (ShiftId:$ShiftId) {
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
			Contract_Expiration_Date
			Start_Week
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
	query getPosition($Id_Department: Int) {
		getposition(Id: null, IsActive: null, Id_Entity: null, Id_Department: $Id_Department) {
			Id
			Position
			Shift
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
			Id_Deparment
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

export const GET_STATE_QUERY = gql`
    query {
					catalogitem(Id_Catalog: 3) {
					Id
					Name
					DisplayLabel
					Value
			}
		} 
`;

export const GET_DEPARTMENTS_QUERY = gql`
	query getcatalogitem ($Id_Entity:Int){
			getcatalogitem(IsActive: 1, Id_Catalog: 8,  Id_Entity:$Id_Entity) {
				Id
				Code: Name
				Description
				IsActive
			}
		}
	`;
