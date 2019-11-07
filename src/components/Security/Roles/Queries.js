import gql from 'graphql-tag';

export const GET_FORMS_QUERY = gql`
    query getforms {
        getforms(IsActive: 1) {
            Id
            Code
            Name
            Value
            IsActive
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
            default_form_id
        }
        getforms {
            Id
            Name
        }
    }
`;

export const GET_COMPANY_QUERY = gql`
    query getcompanies {
        getcompanies(IsActive: 1) {
            Id
            Name
        }
    }
`;

export const GET_FEATURES = gql`
    query getFeatures($RoleId: Int)  {
        features(RoleId: $RoleId) {
            id
            code
        }
    }
`;
