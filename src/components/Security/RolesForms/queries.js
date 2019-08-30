import gql from 'graphql-tag';

export const GET_COMPANY_QUERY = gql`
    query getcompanies {
        getcompanies(IsActive: 1) {
            Id
            Name
        }
    }
`;

export const GET_ROLES_QUERY = gql`
    query getroles {
        getroles(IsActive: 1) {
            Id
            Id_Company
            Description
            IsActive            
        }
    }
`;