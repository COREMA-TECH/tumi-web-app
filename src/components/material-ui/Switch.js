import React from 'react';
import Switch from '@material-ui/core/Switch';

class Switches extends React.Component {
    state = {
        active: 1,
        inactive: 0,
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
        this.props.update(event.target.checked);
    };

    render() {
        return (
            <div>
                <Switch
                    checked={this.state.inactive}
                    onChange={this.handleChange('inactive')}
                    value="active"
                    color="primary"
                />
            </div>
        );
    }
}

export default Switches;