import React from "react";
import {Route} from "react-router-dom";
import Redirect from "react-router-dom/es/Redirect";

const PrivateRoute = ({component: Component, ...rest}) => (
    <Route
        {...rest}
        render={props =>
            1 === 1 ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: {from: props.location}
                    }}
                />
            )
        }
    />
);


export default PrivateRoute;