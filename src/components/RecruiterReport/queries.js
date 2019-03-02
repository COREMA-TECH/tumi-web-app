import gql from 'graphql-tag';

export const GET_APPLICATION_QUERY = gql`
{
    applications(isActive: true,isLead:true) {
        id
        firstName
        middleName
        lastName
        socialSecurityNumber
        emailAddress
        cellPhone
        isLead
        idWorkOrder
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