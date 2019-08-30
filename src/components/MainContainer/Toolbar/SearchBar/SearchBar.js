import React, {Component} from 'react';
import './index.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';

class Search extends Component {
    render() {
        return (
            <div className="search-bar">
                <input type="text" placeholder="Search.." name="search" className="search-bar__input"/>
                <button type="submit" className="search-bar__button">
                    <FontAwesomeIcon icon={faSearch}/>
                </button>
            </div>
        );
    }
}

export default Search;
