import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import PropTypes from 'prop-types';

class CatalogItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            period: this.props.PeriodId,
            options: []
        };
        //this.setState({ idCompany: this.props.idCompany });
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
        this.props.update(value);
    }

    componentWillMount() {

    }

    GET_QUERY = gql`
        query getcatalogitem($id:Int) {
            getcatalogitem(IsActive: 1, Id_Catalog: $id) {
                Id
                Code: Name
                Name: Description
                IsActive
            }
        }
    `;

    handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <select name={this.props.name} disabled={(this.props.disabled)} value={this.props.value} onChange={this.handleChange} className="form-control">
                    {
                        this.state.options.map(
                            (item) => {
                                return <option value={item.Id} key={item.Id} > {item.Name}</option>
                            }
                        )
                    }
                </select>
            </div>
        );
    }
}

CatalogItem.propTypes = {
    PeriodId: PropTypes.number.isRequired
};

export default withApollo(CatalogItem);