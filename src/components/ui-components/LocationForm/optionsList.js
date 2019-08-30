import { graphql } from 'react-apollo';
import { GET_CATALOGS_QUERY } from './queries';
import React from 'react';

function OptionsList({ selectValue, data: { catalogitem } }) {
    if (!catalogitem)
        return <React.Fragment></React.Fragment>
    return catalogitem.map(({ Id, Name }) => (
        <option key={Id} value={Id}>{Name}</option>
    ))
}

export default graphql(GET_CATALOGS_QUERY,
    {
        options: ({ Id_Catalog, Id_Parent, Value }) => ({ variables: { Id_Catalog, Id_Parent, Value } })
    }
)(OptionsList);