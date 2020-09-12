// import external modules
import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import _ from 'lodash'

import auth from "../../services/authService";
import config from '../../config.json';
import MainLayout from "../mainLayout";

const MainLayoutRoute = ({ location, path, render, ...rest }) => {

   const doesCurrentUserHaveAuthorization = (permissions) => {

      //console.log('permissions:', permissions, path);
      if (permissions == null || permissions.length == 0)
         return false;

      const items = _(path)
         .split("/")
         .value()
         .filter((c) => c !== "")
         .map((c) => _.toUpper(c));

     // console.log('item', items);
      switch (items.length) {
         case 0:
            return true
         case 1:
            let temp = permissions.filter(c => c.isGranted === true);
          //  console.log('temp ', temp);
            if (temp.length > 0)
               return true
            return false
         case 2:
            let temp1 = permissions.filter(c => _.toUpper(c.name) === items[1] && c.isGranted === true);
            //console.log('temp', temp1);
            if (temp1.length === 1)
               return true
            return false
         case 3:
         case 4:
            let temp2 = permissions.filter(c => _.toUpper(c.name) === items[1] && c.isGranted === true);
           // console.log('from main route', temp2)
            if (temp2.length === 1) {
               let temp3 = temp2[0].access.filter(c => _.toUpper(c.key) === items[2] && c.value === true);
               if (temp3.length === 1)
                  return true
            }
            return false;
      }
     // console.log('miresi ya na')
      return false
   }
   //console.log('from mainrout', location)
   return (

      <Route
         {...rest}
         path={path}
         render={matchProps => {
            if (!config.useAuthentication) {
               return <MainLayout>{render(matchProps)}</MainLayout>
            }
            const user = auth.getCurrentUser();
            if (user) {
               if (user.userType === "Admin") {
                  return <MainLayout>{render(matchProps)}</MainLayout>
               }
               else if (doesCurrentUserHaveAuthorization(user.permissions)) {
                  return <MainLayout>{render(matchProps)}</MainLayout>
               }
               else {
                  auth.logout();
                  return (<Redirect
                     to={{
                        pathname: "/login",
                        state: { message: 'دسترسی غیر مجاز' }
                     }}
                  />)
               }
            }
            return (<Redirect
               to={{
                  pathname: "/login",
                  state: { from: matchProps.location }
               }}
            />)

         }}
      />
   );
};

export default MainLayoutRoute;
