import gql from 'graphql-tag';

/**
 * Query to get cities
 */
export const GET_COMPLETED_STATUS = gql`
    query applicationCompleted($id: Int!) {
        applicationCompleted (id: $id)
    }
`;
/**
 * Query to get properties/hotels
 */
export const GET_PROPERTIES_QUERY = gql`
  query hotels {
    getbusinesscompanies( IsActive: 1, Contract_Status: "'C'", Id_Parent : -1) {
      Id
      Id_Parent
      Code
      Name
      Country
      State
      City
    }
  }
`;

/**
 * Query to get departments by hotel
 */
export const GET_DEPARTMENTS_QUERY = gql`
  query department($Id_Entity: Int){
    catalogitem(Id_Catalog:8, Id_Entity:$Id_Entity){
      Id
      DisplayLabel
    }
  }
`;

/**
 * Query to get applications, if logged user have field employees role the query only get your own application
 */
export const GET_APPLICATION_QUERY = gql`
		query applicationsByUser($idUsers: Int,$Id_Deparment: Int, $idEntity: Int, $isActive:[Boolean] ,$isLead:Boolean){
			applicationsByUser(idUsers: $idUsers, Id_Deparment: $Id_Deparment, idEntity: $idEntity, isActive: $isActive,isLead:$isLead) {
				id
				firstName
				middleName
				lastName
				socialSecurityNumber
				emailAddress
				cellPhone
				isLead
				idWorkOrder
				statusCompleted
				sendInterview
				User {
					Full_Name
				}
				Employee{
					idUsers
				}
				DefaultCompany{
					Id
					Name
				}
				Companies{
					Id,
					Code,
					Name
				}
				Recruiter {
					Full_Name
				}
				Position{
					Position      
				}
				PositionCompany{
     				Code
    			}
				workOrderId    
			}
		}
	`;