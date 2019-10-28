import React, {Fragment} from 'react';
import { Link as RouterLink } from 'react-router-dom';

const CustomBreadcrumb = props => {
    const pathnames = window.location.pathname.split('/').filter(x => x);
    return <Fragment>
        <div className="CustomBreadcrumb">
            <span className="CustomBreadcrumb-content">
                {
                    pathnames.map((value, index) => {
                        const name = value === 'home' ? <i className="fas fa-home"></i> : value;
                        const last = index === pathnames.length - 1;
                        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                        return last ? (
                        <span className="text-capitalize" key={to}>
                            {name}
                        </span>
                        ) : (
                            <Fragment>
                                <RouterLink color="inherit" to={to} key={to}>
                                    <span className="text-capitalize">
                                        {name}
                                    </span>
                                </RouterLink>
                                <span className="px-1">/</span>
                            </Fragment>
                        );
                    })
                }
            </span>
        </div>
    </Fragment>
};

export default CustomBreadcrumb;

