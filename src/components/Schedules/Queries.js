import gql from 'graphql-tag';

export const GET_INITIAL_DATA = gql`
query data($idEntity: Int, $idUsers: Int, $Id: Int) {
    employees(isActive:true, idEntity:  $idEntity, idUsers: $idUsers) {
      id
      firstName
      lastName
      electronicAddress
      mobileNumber
      
    } 
    getbusinesscompanies(Id: $Id, IsActive: 1, Contract_Status: null, Id_Parent: -1) {
          Id
          Code
          Name  
          Start_Week       
    } 
  }
`;

export const GET_POSITION = gql`
  query positions($Id_Entity: Int,$Id_Department: Int, $Id: Int){
    getposition(Id_Entity: $Id_Entity, Id: $Id,Id_Department: $Id_Department){
      Id
      Position      
      Comment
    }
  }
`;

export const GET_DEPARTMENTS = gql`
    query getDepartments($Id_Entity: Int){
        catalogitem(IsActive: 1, Id_Catalog: 8,  Id_Entity:  $Id_Entity) {
            Id
            Code: Name
            Description
            IsActive
        }
    }
`;

export const GET_STATES_QUERY = gql`
    query Cities($id: Int) {
        getcatalogitem(Id: $id, IsActive: 1,  Id_Catalog: 3) {
            Id
            Name
            IsActive
        }
    }
`;

export const GET_CITIES_QUERY = gql`
    query Cities($id: Int, $parentId: Int) {
        getcatalogitem(Id: $id, IsActive: 1,  Id_Catalog: 5, Id_Parent: $parentId) {
            Id
            Name
            IsActive
        }
    }
`;

export const GET_SHIFTS = gql`
  query getShifts($shiftDetail: inputShiftDetailQuery, $shift: inputShiftQuery, $shiftDetailEmployee: inputShiftDetailEmployeeQuery)  {
        shift(shift: $shift) {
            id
            title
            bgColor : color
            status
            idPosition
            position {
              Position
            }
            company {
                City
            }
            entityId
        }

        ShiftDetail(shiftDetail: $shiftDetail, shift: $shift , shiftDetailEmployee: $shiftDetailEmployee) {
            id
            ShiftId
            start: startDate
            startTime
            end: endDate
            endTime
            bgColor : color
            status
            detailEmployee {
                EmployeeId
            }
        }
    }
`;

export const GET_SHIFTS_QUERY = gql`
    query GetInformation($id: Int){
        ShiftDetail( shiftDetail:{id:$id}) {
        id
        startDate
        endDate
        startTime
        endTime
        ShiftId
        color
        status
        shift{
            id
            entityId
            title
            color
            status
            idPosition
            startDate
            endDate
            comment
            dayWeek
            workOrder
            {
              id: WorkOrderId    
            }
        }
        detailEmployee{
            EmployeeId
        }
        }
    }  
`;

export const GET_SHIFTS_BY_DATE_EMPLOYEE_QUERY = gql`
    query ShiftDetailByDate ($startDate: Date,$endDate:Date,$startTime: String,$endTime: String,$employeeId: [Int], $shiftDetailId: [Int], $daysWeek: String){
        ShiftDetailByDate(startDate: $startDate,endDate: $endDate,startTime: $startTime,endTime: $endTime,employeeId:$employeeId, shiftDetailId: $shiftDetailId, daysWeek: $daysWeek){
            id
            startDate
            endDate
            startTime
            endTime
        }
    }
`;

export const GET_SHIFTS_BY_SPECIFIC_DATE_EMPLOYEE_QUERY = gql`
    query ShiftDetailBySpecificDate ($date: Date,$startTime: String,$endTime: String,$employeeId: [Int]){
        ShiftDetailBySpecificDate(date: $date,startTime: $startTime,endTime: $endTime,employeeId:$employeeId){
            id
            startDate
            endDate
            startTime
            endTime
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


export const GET_SHIFT_BY_DATE = gql`
    query getshift($startDate: Date, $endDate: Date, $idPosition: Int, $entityId: Int) {
        shiftDetailByWeek(startDate:$startDate,endDate: $endDate,idPosition:$idPosition, entityId:$entityId)
        {
            id
            startDate
            endDate
            ShiftId
        }
    }
`;

export const GET_LIST_SHIFT_ID = gql`
    query getshiftid($ShiftId: Int) {
        ShiftDetail ( shiftDetail:{ShiftId:$ShiftId}){
        id
        }
    }
`;


export const GET_TEMPLATES = gql`
    query gettemplate($id: Int) {
        template (id:$id){
        id,
        title
    }
}
`;
