import React, { Component } from 'react';
import './index.css';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
	flex: {
		flexGrow: 1
	}
});

class Search extends Component {
	render() {
		const { classes } = this.props;
		return (
			<div className={classes.flex}>
				<input type="text" placeholder="Search.." name="search" className="search-bar__input" />
				<IconButton c color="inherit">
					<div>
						<SearchIcon color="primary" />
					</div>
				</IconButton>
				{/*
            		<input type="text" placeholder="Search.." name="search"  />
				<button type="submit" className="search-bar__button">
					<FontAwesomeIcon icon={faSearch} />
				</button>
            */}
			</div>
		);
	}
}
Search.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Search);
