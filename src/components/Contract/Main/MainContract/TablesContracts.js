import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import withApollo from "react-apollo/withApollo";
import Route from 'react-router-dom/es/Route';

const CustomTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
        '&:hover': {
            cursor: 'pointer',
        },
    },
});

class CustomizedTable extends Component {
    constructor(props){
        super(props);
    }

    render() {
        const {classes} = this.props;

        return (
            <Route render={({history}) => (
                <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <CustomTableCell>Contract Name</CustomTableCell>
                                <CustomTableCell>Contract Owner</CustomTableCell>
                                <CustomTableCell>Contract Status</CustomTableCell>
                                <CustomTableCell>Contract Expiration Date</CustomTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.data.map(contractItem => {
                                return (
                                    <TableRow className={classes.row} key={contractItem.Id} onClick={() => {
                                        history.push({
                                            pathname: '/home/contract/add',
                                            state: { contract: contractItem.Id}
                                        });
                                    }}>
                                        <CustomTableCell>{contractItem.Contract_Name}</CustomTableCell>
                                        <CustomTableCell>{contractItem.Contrat_Owner}</CustomTableCell>
                                        <CustomTableCell>{contractItem.Contract_Status}</CustomTableCell>
                                        <CustomTableCell>{contractItem.Contract_Expiration_Date}</CustomTableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            )}/>
        );
    }
}

CustomizedTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withApollo(CustomizedTable));