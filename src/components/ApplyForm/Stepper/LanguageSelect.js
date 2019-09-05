import React, {Component} from 'react';
import ReactFlagsSelect from 'react-flags-select';

class LanguageSelect extends Component {

    componentWillReceiveProps(nextProps) {
        this.refs.langSelect.updateSelected(nextProps.country)
    }

    render() {
        let {country, classes ,handleChange} = this.props;
        return (
            <ReactFlagsSelect 
                ref="langSelect"
                defaultCountry={country}
                onSelect={handleChange}
                countries={["US", "ES"]}
                customLabels={{"US":"English", "ES": "Español"}}
                className={classes}
            />
        )
    }
}

export default LanguageSelect;