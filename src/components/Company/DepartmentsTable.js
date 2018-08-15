import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const uuidv4 = require('uuid/v4');

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
    },
});

let id = 0;

function createData(Name, Email, Number, Kind) {
    id += 1;
    return {Name, Email, Number, Kind};
}


function CustomizedTable(props) {
    const {classes} = props;
    let items = props.data;

    return (
        <Paper className={classes.root}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <CustomTableCell numeric>Code</CustomTableCell>
                        <CustomTableCell numeric>Description</CustomTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map(row => {
                        return (
                            <TableRow className={classes.row} key={uuidv4()}>
                                <CustomTableCell numeric>{row.code}</CustomTableCell>
                                <CustomTableCell numeric>{row.description}</CustomTableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Paper>
    );
}

CustomizedTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomizedTable);