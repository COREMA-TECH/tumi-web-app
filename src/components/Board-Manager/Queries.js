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
query getlead($language: Boolean,	$experience: Boolean,  $Position: String,  $WorkOrderId: Int,	$ShiftId: Int)   {
			applicationsByMatches(language: $language, experience: $experience,Position: $Position, WorkOrderId: $WorkOrderId, ShiftId: $ShiftId) {
		id
		firstName
		lastName
		cellPhone
		homePhone
		car
		city
		isLead
		zipCode
		statusCompleted
		idealJobs
		{
		  id
		  description
		  idPosition 
		}
		Phases   {
			id
			StageId
			ApplicationId
			WorkOrderId
			ShiftId
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
	 Coordenadas
    {
      zipCode
      Lat
      Long
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
query States($parent: Int!) {
	getcatalogitem(IsActive: 1, Id_Parent: $parent, Id_Catalog: 3) {
		Id
		Name
		IsActive
	}
}
`;


export const GET_CITIES_QUERY = gql`
query Cities($parent: Int!) {
	getcatalogitem(IsActive: 1,  Id_Catalog: 5, Id_Parent: $parent) {
		Id
		Name
		IsActive
	}
}
`;

export const GET_RESPONSE_QUERY = gql`
query getmesage($number: String, $ShiftId: Int)
{
	smsLog(number:$number,ShiftId:$ShiftId)
	{
		id
number
request
response
EmployeeId
ShiftId
	}
}
`;


/*export const GET_BOARD_SHIFT = gql`
query ShiftBoard($shift: inputShiftQuery,$shiftEntity: inputShiftBoardCompany) {
	ShiftBoard(shift: $shift, shiftEntity: $shiftEntity)  {
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
	}
}
`;*/


export const GET_BOARD_SHIFT = gql`
query ShiftBoard($shift: inputShiftQuery,$shiftEntity: inputShiftBoardCompany,$workOrder: inputQueryWorkOrder,) {
	ShiftBoard(shift: $shift, shiftEntity: $shiftEntity,workOrder:$workOrder)  {
		id
		title
		quantity
		count
		workOrderId
		CompanyName
		needExperience
		needEnglish
		zipCode
		Id_positionApplying
		positionName
		status
		isOpening
		Users {
      Full_Name
    }
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