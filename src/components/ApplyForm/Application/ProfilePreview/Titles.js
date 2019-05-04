import React , { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Select from 'react-select';
import makeAnimated from "react-select/lib/animated";

class Titles extends Component {

    constructor(props) {
        super(props);
        this.state = {
            titles: [],
            title: null
        }
    }

    handleChangeTitle = (positionsTags) => {
        this.setState({ positionsTags });
    };

    render() {
        return(
            <Dialog open={this.props.titleModal} maxWidth="sm">
                <DialogTitle>
                    <h5>Add Titles</h5>
                </DialogTitle>
                <DialogContent>
                    <Select
                        options={this.state.titles}
                        value={this.state.title}
                        onChange={this.handleChangeTitle}
                        closeMenuOnSelect={true}
                        components={makeAnimated()}
                        isMulti={true}
                    />
                </DialogContent>     
                <DialogActions>
                    <button className="btn btn-success" type="submit">Save</button>
                    <button className="btn btn-danger" onClick={this.props.hanldeCloseTitleModal}>Cancel</button>
                </DialogActions>
            </Dialog>
        );
    }

}

export default Titles;