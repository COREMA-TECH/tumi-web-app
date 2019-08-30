import gql from 'graphql-tag';

export const INSERT_POSITION_QUERY = gql`
		mutation insposition($input: iParamPR!) {
			insposition(input: $input) {
				Id
			}
		}
	`;

export const UPDATE_POSITION_QUERY = gql`
		mutation updposition($input: iParamPR!) {
			updposition(input: $input) {
				Id
			}
		}
	`;

export const DELETE_POSITION_QUERY = gql`
		mutation delposition($Id: Int!) {
			delposition(Id: $Id, IsActive: 0) {
				Id
			}
		}
	`;

export const INSERT_DEPARTMENTS_QUERY = gql`
		mutation inscatalogitem($input: iParamCI!) {
			inscatalogitem(input: $input) {
				Id
			}
		}
	`; 