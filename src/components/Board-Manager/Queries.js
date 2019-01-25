import gql from 'graphql-tag';

/**
 * Mutation to insert background check information
 */
export const GET_POSTIONS_QUERY = gql`
		query getposition($Id: Int) {
			getposition(IsActive: 1, Id: $Id) {
				Id
				Id_Department
				Position
				Bill_Rate
				Pay_Rate
				Shift
				IsActive
			}
		}
    `;

export const GET_MATCH = gql`
query getlead ( $positionApplyingFor: Int ) {
	applications(id: 75,isActive: true , positionApplyingFor: $positionApplyingFor) {
		id
	firstName
	lastName
	cellPhone
	homePhone
	car
	city
	isLead
	zipCode
	idealJobs
    {
      id
	  description
	  idPosition 
    }
	applicationPhases   {
		id
		StageId
		ApplicationId
		WorkOrderId
		createdAt
	  } 
	cityInfo{
		DisplayLabel
	  }
	state	
	stateInfo{
		DisplayLabel
	  }
	  generalComment
 languages
{
language
}
employments
{
  id
}
	}

}
	`;

export const GET_COORDENADAS = gql`
	query coordenadas($Zipcode:String){
		zipcode(Zipcode:$Zipcode){
		  Zipcode
		  Lat
		  Long
		}
	  }

`;
export const GET_WORK_ORDERS = gql`
query workorder ($IdEntity: Int, $status: Int,$id: Int)  {
	workOrder(IdEntity:$IdEntity, status:$status,id:$id){
		id
		IdEntity
		userId
		date
		quantity
		shift
		startDate
		endDate
		needExperience
		needEnglish
		PositionRateId
		position{
			Position
			Id_positionApplying
		  }
		BusinessCompany
		  {
			   Id
				  Name
				  Zipcode
			
		  }
		comment
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


export const GET_HOTEL_QUERY = gql`
	query hotels($id: Int) {
		getbusinesscompanies(Id: $id, IsActive: 1, Contract_Status: "'C'", Id_Parent : -1) {
			Id
			Name
			Country
			State
			City
		}
	}
`;

export const GET_STATES_QUERY = gql`
query States($id: Int,$parent: Int!) {
	getcatalogitem(Id: $id, IsActive: 1, Id_Parent: $parent, Id_Catalog: 3) {
		Id
		Name
		IsActive
	}
}
`;


export const GET_CITIES_QUERY = gql`
query Cities($id: Int) {
	getcatalogitem(Id: $id, IsActive: 1,  Id_Catalog: 5) {
		Id
		Name
		IsActive
	}
}
`;

export const GET_COMPANY_QUERY = gql`
		query getCompany($id: Int!) {
			getbusinesscompanies(Id: $id, IsActive: 1, Contract_Status: "'C'") {
				Id
				Code
				Code01
				Id_Company
				BusinessType
				Name
				Rooms
				Description
				Start_Week
				End_Week
				Start_Date
				Legal_Name
				Region
				Country
				State
				Zipcode
				Fax
				City
				Id_Parent
				IsActive
				User_Created
				User_Updated
				Date_Created
				Date_Updated
				ImageURL
				Rate
				Location
				Location01
				Primary_Email
				Phone_Number
				Suite
				Contract_URL
				Contract_File
				Insurance_URL
				Insurance_File
				Other_URL
				Other_Name
				Other_File
				Other01_URL
				Other01_Name
				Other01_File
			}
		}
	`;