import React from "react";
import { Redirect, Route, RouteProps } from "react-router";

interface PrivateRouteProps extends RouteProps{
    condition: boolean
}

export const PrivateRoute: React.FC<PrivateRouteProps> = x => {
    const redirectPath = "/login";
    if (!x.condition) {
        alert("Nelzya");
        return <Redirect to={ redirectPath } />;
    }
    else
        return <Route { ...x } />;
};