// import external modules
import React from "react";
import { Route,Redirect } from "react-router-dom";
import auth from "../../services/authService";

// import internal(own) modules
import MainLayout from "../mainLayout";

const MainLayoutRoute = ({path ,render, ...rest }) => {
console.log('from mainrout', {...rest},path)
   return (
   
      <Route
         {...rest}
         path = {path}
         render={matchProps => {
            if (!auth.getCurrentUser() || path === "/operationType/vessel/discharge") {
             return ( <Redirect
              to={{
                pathname: "/login",
                state: { from: matchProps.location }
              }}
            />)
            }
            
           return <MainLayout>{render(matchProps)}</MainLayout>
         }}
      />
   );
};

export default MainLayoutRoute;
