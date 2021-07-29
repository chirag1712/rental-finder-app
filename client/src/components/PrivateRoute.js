// used https://stackoverflow.com/questions/62605655/how-do-i-keep-track-of-whether-the-user-is-logged-in-on-my-website-or-not for reference
import React from "react";
import { Route, useHistory } from "react-router-dom";
import { useAuth } from '../useAuth';

const PrivateRoute = ({ render: Component, ...rest }) => {
    const history = useHistory();
    const auth = useAuth();
    return (
        <Route
            {...rest}
            render={props => {
                if (auth.user) {
                    return <Component {...props} />;
                } else {
                    history.push("/");
                }
            }}
        />
    );
};

export default PrivateRoute;
