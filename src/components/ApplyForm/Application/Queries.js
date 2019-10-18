import gql from 'graphql-tag';

export const GET_APPLICATION_STATUS = gql`
   query applicationCompletedData($id: Int!) {
        applicationCompletedData (id:$id) {
            W4
            I9
            BackgroundCheck
            HarassmentPolicy
            AntiDiscrimination
            Disclosure
            NonRelation
            ConductCode
            BenefitElection
            WorkerCompensation    
        }
    }
`;

export const GET_COMPLETED_STATUS = gql`
    query applicationCompleted($id: Int!) {
        applicationCompleted (id: $id)
    }
`;

export const GET_APPLICATION_USER = gql`
query applicationUser($Id:Int){
    applicationUser(Id: $Id){
        Id
        firstName
        lastName
        Phone_Number
        Electronic_Address        
    }
}
`;