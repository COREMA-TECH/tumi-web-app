import gql from 'graphql-tag';

export const GET_REGION_QUERY = gql`
{
	getcatalogitem( IsActive: 1,Id_Catalog: 4) {
		Id
		Name
		DisplayLabel
		IsActive
	}
}
`;

export const GET_USERS = gql`
    query getUsers($Id:Int, $IdRegion:Int,$Id_Roles:[Int]) {
			user(IsActive: 1,Id: $Id, IdRegion:$IdRegion, Id_Roles: $Id_Roles) {
            Id
			Id_Contact
			Full_Name
        }
    }
	`;

export const GET_CONFIGREGIONS = gql`
	query configregions($regionId:Int){
		configregions(regionId:$regionId) {
		  id
		  regionId
		  regionalManagerId
		  regionalDirectorId
		} 
	  }
	`;


export const GET_EMPLOYEES = gql`
query employees($id:Int){
	employees (id:$id,isActive:true)
		{
		  id
		  firstName
		  lastName
		  electronicAddress
		  isActive
		  idEntity
		}
	  }
	`;

export const GET_MARK = gql`
	query markedEmployees($id:Int, $typeMarkedId:Int, $markedDate:Date){
		markedEmployees (id:$id,typeMarkedId:$typeMarkedId,markedDate:$markedDate) {
			id
		}
	}
`;

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
		dayWeek
		IdEntity
		contactId
		PositionRateId
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
	query hotels($Id: Int!) {
		companiesByUser(userId:$Id){
		Id
		Name
		Contract_Expiration_Date
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
		getposition(Id: null, IsActive: 1, Id_Entity: $id) {
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

export const GET_PREVIOUS_MARK = gql`
query previousMark($EmployeeId:Int!, $markedDate:String!, $entityId:Int){
	previousMark(EmployeeId:$EmployeeId, markedDate:$markedDate, entityId:$entityId){
	  id
	  entityId
	  markedDate
	  inboundMarkTypeId
	  inboundMarkTime
	  outboundMarkTypeId
	  outboundMarkTime
	  positionId
	  EmployeeId
	  notes    
	}
  }
`;




