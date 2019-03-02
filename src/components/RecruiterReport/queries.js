import gql from 'graphql-tag';

export const GET_APPLICATION_QUERY = gql`
query applications($UserId: Int){
    applications(isActive: true,isLead:true, UserId: $UserId) {
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
{
    user(IsActive:1,Id_Roles:[12,4]){
      Id
      Full_Name
    }
}
`;