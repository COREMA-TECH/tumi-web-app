import { graphql } from 'react-apollo';
import { GET_APPLICATION, CREATE_DOCUMENTS_PDF_QUERY } from './Queries';
import SummaryDoc from '../Summary/Document';
import moment from 'moment';

let apolloClient;

const getSource = (opt, nameReference) => {
    let source;
    switch (opt) {
        case 1: source = "Facebook";
            break;
        case 2: source = "Newspaper";
            break;
        case 3: source = nameReference + " (Employee)";
            break;
        case 4: source = nameReference + " (Recruiter)";
            break;
        default: source = '';
            break;
    }

    return source;
}

const htmlWrapper = (style, htmlContent) => {
    return `<html style="${style}">${htmlContent}</html>`;
}

const createDocumentsPDF = async (style, html, documentName) => {
    const sumaryUrl = await apolloClient
        .query({
            query: CREATE_DOCUMENTS_PDF_QUERY,
            variables: {
                contentHTML: htmlWrapper(style, html),
                Name: documentName
            },
            fetchPolicy: 'no-cache'
        })
        .then(({data}) => {
            return data.createdocumentspdf;
        })
        .catch((error) => {
            return null;
        });

    console.log('url de sumary generado', sumaryUrl); // TODO: (LF) Quitar console log
};

export const generateDocuments = async (client, applicationId) => {
    let appQuery;
    let summaryHtml;

    apolloClient = client;

    await apolloClient.query({
        query: GET_APPLICATION,
        fetchPolicy: 'no-cache',
        variables: {
            id: applicationId
        }
    }).then(({ data }) => {
        console.log('Probando query de generar documentos ** ', data); // TODO: Quitar console log
        appQuery = {
            application: data.applications[0]
        }
    }).catch(error => {
        console.log(error)
    });

    console.log('query terminada ',appQuery.application); // TODO: Quitar console log
    if(!appQuery.application){
        console.log('Entra a application'); // TODO: Quitar console log
        const {firstName, middleName, lastName, employee, employmentType, marital, exemptions, optionHearTumi, nameReferences, Accounts,
            socialSecurityNumber, cellPhone, gender, birthDay, streetAddress, city, cityInfo, state, stateInfo, zipCode,
            numberId, typeOfId, expireDateId, car, area
        } = appQuery.application;
        const applicantName = `${firstName ? firstName.trim() : ''} ${middleName ? middleName.trim() : ''} ${lastName ? lastName.trim() : ''}`;
        const address = streetAddress && zipCode && city ? `${streetAddress}, ${cityInfo.Name}, ${stateInfo ? stateInfo.Name : ''}, ${zipCode.substring(0, 5)}` : '--';
        const appAccount = Array.isArray(Accounts) && Accounts.length ? Accounts[0] : null;
        let hotel, hireDate;
        if (employee){
            hireDate = employee.Employees.hireDate ? moment(employee.Employees.hireDate).format('MM/DD/YYYY') : null;
            hotel = employee.Employees.BusinessCompany ? employee.Employees.BusinessCompany.Name : null;
        }
        summaryHtml = SummaryDoc({
            applicantName,
            socialSecurityNumber,
            cellphone: cellPhone,
            gender: !gender ? null : gender === 1 ? 'MALE' : 'FEMALE',
            birthDay,
            address,
            hotel,
            hireDate,
            employmentType,
            marital: marital === 2 ? "MARRIED" : "SINGLE",
            exemptions,
            source: getSource(optionHearTumi, nameReferences),
            accountNumber: appAccount ? appAccount.accountNumber : null,
            bankName: appAccount ? appAccount.bankName : null,
            routingNumber: appAccount ? appAccount.routingNumber : null,
            numberId,
            typeOfId,
            expireDateId: expireDateId ? moment(expireDateId).format('MM/DD/YYYY'): null,
            car: car ? 'YES' : 'NO',
            area
        });
    }
    else{
        console.log('Application no encontrado'); // TODO: Quitar console log
        summaryHtml = SummaryDoc();
    }

    createDocumentsPDF('zoom: 50%; font-family: Arial, Helvetica, sans-serif;', summaryHtml, 'Sumary de prueba');
}