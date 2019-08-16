import gql from 'graphql-tag';

export const APPROVE_MARKS = gql`
    mutation approveMarks($approvedDate: Date!, $idsToApprove: [Int]! ){
        approveMarks(approvedDate:$approvedDate,idsToApprove:$idsToApprove) {
            id
        }
    }
`

export const UNAPPROVE_MARKS = gql`
    mutation unapproveMarks($idsToUnapprove: [Int]! ){
        unapproveMarks(idsToUnapprove:$idsToUnapprove) {
            id
        }
    }
`