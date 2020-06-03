import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

interface PrivateRouteProps extends RouteProps{
    condition: boolean
}

export const PrivateRoute: React.FC<PrivateRouteProps> = x => {
    const redirectPath = "/login";
    if (!x.condition) {
        alert("Nelzya");
        const renderComponent = () => <Redirect to={ redirectPath } />;
        return <Route { ...x } render={ renderComponent } />;
    }
    else
        return <Route { ...x } />;
};