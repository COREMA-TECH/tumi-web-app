import { GET_APPLICATION, CREATE_DOCUMENTS_PDF_QUERY } from './Queries';
import SummaryDoc from '../Summary/Document';
import W4Doc from '../W4/Document';
import I9Doc from '../I9/Document';
import BackgroundCkeckDoc from '../BackgroundCkeck/Document';
import AntiHarassmentDoc from '../AntiHarassment/Document';
import {Document as AntiDiscriminationDoc} from '../AntiDiscrimination/Document';
import NonDisclosureDoc from '../NonDisclosure/Document';
import NonRetaliationDoc from '../NonRetaliation/Document'
import ConductCodeDoc from '../ConductCode/Document';
import BenefitElectionDoc from '../Benefits/Document';
import WorkerCompensationDoc from '../WorkerCompensation/Document';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

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

// Solo se usa cuando se actualizan los documentos vacios
const jsxToString = (Comp) => {
    return ReactDOMServer.renderToStaticMarkup(<Comp data={{}} />)
}

const updateEmptyFiles = () => {
    const summaryHtml = SummaryDoc();
    const w4Html = jsxToString(W4Doc);
    const i9Html = jsxToString(I9Doc);
    const backgroundCkeckHtml = jsxToString(BackgroundCkeckDoc);
    const antiHarassmentHtml = AntiHarassmentDoc();
    const antiDiscriminationHtml = AntiDiscriminationDoc({});
    const nonDisclosureHtml = NonDisclosureDoc();
    const nonRetaliationHtml = jsxToString(NonRetaliationDoc);
    const conductCodeHtml = ConductCodeDoc();
    const benefitElectionHtml = jsxToString(BenefitElectionDoc);
    const workerCompensationHtml = WorkerCompensationDoc();

    createDocumentsPDF(`zoom: 50%; font-family: Arial, Helvetica, sans-serif;`, summaryHtml, 'Summary-EMPTY');
    createDocumentsPDF(`zoom: 65%;`, w4Html, 'W4-EMPTY');
    createDocumentsPDF(`zoom: 50%;`, i9Html, 'I9-EMPTY');
    createDocumentsPDF(`zoom: 60%; font-family: 'Times New Roman'; line-height: 1.5;`, backgroundCkeckHtml, 'BackgroundCheck-EMPTY');
    createDocumentsPDF(`zoom: 60%; font-family: Time New Roman; letter-spacing: 0`, antiHarassmentHtml, 'AntiHarassment-EMPTY');
    createDocumentsPDF(`zoom: 70%; font-family: "Times New Roman", Times, serif  !important; line-height: 1.5 !important;`, antiDiscriminationHtml, 'AntiDiscrimination-EMPTY');
    createDocumentsPDF(`zoom: 60%; font-family: "Times New Roman", Times, serif  !important; line-height: 1.5 !important;`, nonDisclosureHtml, 'NonDisclosure-EMPTY');
    createDocumentsPDF(`zoom: 60%; font-family: "Times New Roman", Times, serif  !important; line-height: 1.0 !important;`, nonRetaliationHtml, 'NonRetaliation-EMPTY');
    createDocumentsPDF(`zoom: 60%; font-family: 'Times New Roman'; line-height: 1.3;`, conductCodeHtml, 'ConductCode-EMPTY');
    createDocumentsPDF(`zoom: 45%;`, benefitElectionHtml, 'BenefitElection-EMPTY');
    createDocumentsPDF('zoom: 60%;', workerCompensationHtml, 'WorkerCompensation-EMPTY');
}

const htmlWrapper = (style, htmlContent) => {
    return `<html style="${style}">${htmlContent}</html>`;
}

const createDocumentsPDF = async (style, html, documentName) => {
    await apolloClient
        .query({
            query: CREATE_DOCUMENTS_PDF_QUERY,
            variables: {
                contentHTML: htmlWrapper(style, html),
                Name: documentName
            },
            fetchPolicy: 'no-cache'
        })
        .then(({data}) => {
            console.log(data.createdocumentspdf); // Muestar url generada
            //return data.createdocumentspdf;
        })
        .catch((error) => {
            return null;
        });
};

export const generateDocuments = async (client, applicationId, setSumaryHtml) => {
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
        appQuery = {
            application: data.applications[0]
        }
    }).catch(error => {
        console.log(error)
    });

    if(appQuery.application){
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
        summaryHtml = SummaryDoc();
    }

    setSumaryHtml(`<html style="zoom: 50%; font-family: Arial, Helvetica, sans-serif;">${summaryHtml}</html>`);
    
    ////* Descomentar para actualizar los documentos vacios */
    //updateEmptyFiles();
}