import React from 'react';
import MenuItem from '../MenuItem/MenuItem';
import './index.css';

const Menu = (...props) => (
    <ul>
        <MenuItem item="Company" icon="icon-home menu-item__icon"/>
        <MenuItem item="Permissions" icon="icon-calendar menu-item__icon"/>
        <MenuItem item="Contract" icon="icon-user menu-item__icon"/>
        <MenuItem item="Work Orders" icon="icon-chart-bar menu-item__icon"/>
    </ul>
);

export default Menu;
