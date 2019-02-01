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




export const GET_HOTEL_QUERY = gql`
	query hotels($id: Int) {
		getbusinesscompanies(Id: $id, IsActive: 1, Contract_Status: "'C'", Id_Parent: -1) {
			Id
			Code
			Name
			Contract_Expiration_Date
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

export const GET_EMPLOYEES_WITHOUT_ENTITY = gql`
	query employees{
		employees (idEntity:null, isActive:true)
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

