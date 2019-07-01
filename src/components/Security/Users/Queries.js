const GET_APPLICATION_BY_EMPLOYEES = gql`
    query ApplicationEmployees($EmployeeId: Int) {
        applicationEmployees(EmployeeId: $EmployeeId) {
            Application {
                pin
                id
            }
        }
    }
`;