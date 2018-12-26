import gql from 'graphql-tag';

export const GET_CATALOG = gql`
    {
        getcatalogitem(Id_Catalog: 13) {
            Id
            Name
        }
    }
`;

export const GET_APPLICANTS_PHASES = gql`
    {
        application_phase {
            id
            UserId
            StageId
            ReasonId
        }
    }
`;

