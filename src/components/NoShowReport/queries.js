import gql from 'graphql-tag'

export const GET_REPORT_INFORMATION = gql`
    query applicationPhaseByDate($startDate: Date, $endDate: Date,$idRecruiter: Int){
        applicationPhaseByDate(startDate: $startDate, endDate: $endDate,idRecruiter: $idRecruiter) {
            createdAt
            application {
            firstName
            lastName
            cellPhone
            car
            idWorkOrder
            positionApplyingFor
            position {
                position {
                Position
                department {
                    Description
                }
                }
                BusinessCompany {
                Name
                }
            }
            idealJobs {
                description
            }
            cityInfo {
                Description
            }
            stateInfo {
                Description
            }
            }
        }
        applicationPhaseByDate_Resume(startDate: $startDate, endDate: $endDate,idRecruiter: $idRecruiter){
            leadEntered
            sentToInterview
            showed
            noShow
            hired
        }
    }
`;

export const CREATE_DOCUMENTS_PDF_QUERY = gql`
    query createdocumentspdf($contentHTML:String,$Name:String) {
        createdocumentspdf(contentHTML: $contentHTML, Name: $Name) 
    }
`;

export const GET_RECRUITERS = gql`
    query getUsers {
        user(IsActive: 1, Id_Roles: 4) {
            Id
            Id_Contact
            Full_Name
        }
    }
`;
