import gql from 'graphql-tag';

/**
 * Mutation to insert conduct code information
 */
export const ADD_CONDUCT_CODE = gql`
    mutation addConductCode($conductCode:  [inputInsertApplicantConductCode]) {
        addConductCode(conductCode: $conductCode) {
            id
        }
    }
`;

export const UPDATE_CONDUCT_CODE = gql`
    mutation updateConductCode($conductCode:  inputUpdateApplicantConductCode) {
        updateConductCode(conductCode: $conductCode) {
            id
        }
    }
`;