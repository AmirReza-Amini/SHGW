// import external modules
import React from "react";
import { Route,Redirect } from "react-router-dom";
import auth from "../../services/authService";

// import internal(own) modules
import MainLayout from "../mainLayout";

const MainLayoutRoute = ({render, ...rest }) => {

   return (
   
      <Route
         {...rest}
         render={matchProps => {
            if (!auth.getCurrentUser()) {
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
