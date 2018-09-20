import React from 'react';
import ReactAutocomplete from 'react-autocomplete';
import './index.css';

class IntegrationAutosuggest extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<ReactAutocomplete
				id={this.props.id}
				name={this.props.name}
				inputProps={{ className: this.props.error ? 'input-form _invalid input-autocomplete' : 'input-form input-autocomplete' }}
				items={this.props.data}
				shouldItemRender={(item, value) => item.Name.toLowerCase().indexOf(value.toLowerCase()) > -1}
				getItemValue={(item) => {
					return item.Name.trim();
				}}
				renderItem={(item, highlighted) => (
					<div key={item.Id} style={{ backgroundColor: highlighted ? '#eee' : '#FFF' }}>
						{item.Name.trim()}
					</div>
				)}
				value={this.props.value}
				onChange={(e) => {
					this.props.onChange(e.target.value);
				}}
				onSelect={(value) => {
					this.props.onSelect(value);
				}}
			/>
		);
	}
}
export default IntegrationAutosuggest;
