import React, {Component} from 'react';

class TableItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: ''
        }
    }

    componentDidMount() {
        this.setState({
            checked: this.props.asiggned
        })
    }

    render() {
        return (
            <tr>
                <input
                    type="checkbox"
                    checked={this.state.checked}
                    onChange={(e) => {
                        this.setState({
                            checked: e.target.checked
                        })
                    }}
                />
                <td>{this.props.code}</td>
                <td>{this.props.name}</td>
                <td>{this.props.url}</td>
            </tr>
        );
    }
}


export default TableItem;