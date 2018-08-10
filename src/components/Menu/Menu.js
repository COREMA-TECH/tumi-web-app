import React from 'react';
import MenuItem from "../MenuItem/MenuItem";
import './index.css';

const Menu = props => (
        <ul>
            <MenuItem  item="Company"/>
            <MenuItem  item="Contract"/>
            <MenuItem  item="Work Orders"/>
            <MenuItem  item="Permissions"/>
        </ul>
);
 
export default Menu;    