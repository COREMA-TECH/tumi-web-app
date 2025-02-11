import gql from 'graphql-tag';

/**
 * Mutation to create a contract
 */
export const CREATE_CONTRACT = gql`
    mutation addContract($contract: inputInsertContracts){
        addContract(contract: $contract){
            Id
        }
    }
`;

export const UPDATE_CONTRACT = gql`
    mutation updateContract($contract: inputUpdateContracts){
        updateContract(contract: $contract){
            Id
        }
    }
`;