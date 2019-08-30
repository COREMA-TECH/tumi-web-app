import gql from 'graphql-tag';

export const ADD_PAYROLL = gql`
	mutation addPayroll($payroll: insertPayrollType){
        addPayroll(payroll: $payroll) {
            weekStart
            payPeriod
            lastPayPeriod
        }  
    }
`;

export const UPDATE_PAYROLL = gql`
	mutation addPayroll($payroll: updatePayrollType){
        updatePayroll(payroll: $payroll) {
            weekStart
            payPeriod
            lastPayPeriod
         }  
    }
`;


