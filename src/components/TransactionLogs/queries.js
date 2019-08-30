import gql from 'graphql-tag';

export const GET_TRANSACTION_LOGS = gql`
{
	transactionLogs
	{
			id
			codeUser
			nameUser
			actionDate
			action
			affectedObject
	}
}
`;




export const GET_HOTEL_QUERY = gql`
	query hotels($Region: Int) {
		getbusinesscompanies(Region: $Region, IsActive: 1, Contract_Status: "'C'", Id_Parent: -1) {
			Id
			Code
			Name
			Contract_Expiration_Date
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


export const GET_EMPLOYEES_WITHOUT_ENTITY = gql`
query employees($id:Int){
	employees (id:$id , idEntity:null, isActive:true)
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



