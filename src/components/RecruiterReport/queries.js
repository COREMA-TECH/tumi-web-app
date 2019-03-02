import gql from 'graphql-tag';

export const GET_APPLICATION_QUERY = gql`
query applications($UserId: Int, $startDate: Date, $endDate: Date){
    recruiterReport(isActive: true,isLead:true, UserId: $UserId, startDate: $startDate, endDate: $endDate) {
        id
        firstName
        middleName
        lastName
        socialSecurityNumber
        emailAddress
        cellPhone
        isLead
        idWorkOrder
        createdAt
        car
        comment
        cityInfo{
            DisplayLabel
        }
        recruiter{
            Full_Name
        }
        user{
            Full_Name
        }
        position{
            id
            position {
                    Position
                }
            BusinessCompany {
                    Id
                    Code
                    Name
                }
        }
    }
}
`;

export const GET_RECRUITER_QUERY = gql`
query user($Id: Int){
    user(IsActive:1,Id_Roles:[4], Id: $Id){
      Id
      Full_Name
    }
}
`;