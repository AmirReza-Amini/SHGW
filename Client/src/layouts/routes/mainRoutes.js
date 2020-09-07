// import external modules
import React from "react";
import { Route } from "react-router-dom";

// import internal(own) modules
import MainLayout from "../mainLayout";

const MainLayoutRoute = ({ render, ...rest }) => {
   console.log('kkkkk',render);
   return (
      <Route
         {...rest}
         render={matchProps => (
            <MainLayout>{render(matchProps)}</MainLayout>
         )}
      />
   );
};

export default MainLayoutRoute;
