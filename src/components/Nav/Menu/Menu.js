import React from 'react';
import MenuItem from '../MenuItem/MenuItem';
import './index.css';

const Menu = (...props) => (
    <ul>
        <MenuItem item="Company" title="Companies" icon="icon-home menu-item__icon"/>
        <MenuItem item="Contract" title="Contract"  icon="icon-doc menu-item__icon"/>
        <MenuItem item="Permissions" title="Permissions"  icon="icon-calendar menu-item__icon"/>
        <MenuItem item="Work Orders" title="WorkOrders"  icon="icon-chart-bar menu-item__icon"/>
    </ul>
);

export default Menu;
