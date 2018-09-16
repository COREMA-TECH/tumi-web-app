import React from 'react';
import ContactCompanyForm from '../../Company/ContactCompanyForm/ContactCompanyForm';
import withGlobalContent from 'Generic/Global';

class ContactFormDialogInternal extends React.Component {
	render() {
		return (
			<ContactCompanyForm idCompany={this.props.idCompany} handleOpenSnackbar={this.props.handleOpenSnackbar} />
		);
	}
}

export default ContactFormDialogInternal;
