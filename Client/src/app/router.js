// import external modules
import React, { Component, Suspense, lazy } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import Spinner from "../components/spinner/spinner";
import { connect } from "react-redux";
// import internal(own) modules
import MainLayoutRoutes from "../layouts/routes/mainRoutes";
import ErrorLayoutRoute from "../layouts/routes/errorRoutes";

const LazyOperationTypePage = lazy(() => import("../views/pages/operationTypePage"));
const LazyOperationsPage = lazy(() => import("../views/pages/operationsPage"));
const LazyUnloadOperationPage = lazy(() => import("../views/pages/unloadOperationPage"));
const LazyLoadOperationsPage = lazy(() => import("../views/pages/loadOperationPage"));
const LazyLoginPage = lazy(() => import("../views/pages/loginPage"));
const LazyDamagePage = lazy(() => import("../views/pages/damagePage"));
const LazyLoadUnloadPage = lazy(() => import("../views/pages/statistics/loadUnloadStatisticsPage"));
const LazyStowagePage = lazy(() => import("../views/pages/stowagePage"));
const LazyUsersPage = lazy(() => import("../views/pages/usersPage"));

// Full Layout
const LazyHome = lazy(() => import("../views/dashboard/ecommerceDashboard"));

// Error Pages
const LazyErrorPage = lazy(() => import("../views/pages/error"));

class Router extends Component {
  render() {
    return (
      // Set the directory path if you are deplying in sub-folder
      <BrowserRouter basename="/">
        <Switch>
          {/* Dashboard Views */}
          <MainLayoutRoutes
            exact
            path="/"
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyHome {...matchprops} />
              </Suspense>
            )}
          />
           <MainLayoutRoutes
            exact
            path="/users"
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyUsersPage {...matchprops} />
              </Suspense>
            )}
          />
          <MainLayoutRoutes
            exact
            path="/login"
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyLoginPage {...matchprops} />
              </Suspense>
            )}
          />
          <MainLayoutRoutes
            exact
            path="/operationType/gate"
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyOperationsPage {...matchprops} operations="Gate" />
              </Suspense>
            )}
          />
          <MainLayoutRoutes
            exact
            path="/operationType/vessel/discharge/loadUnloadStatistics"
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyLoadUnloadPage {...matchprops} />
              </Suspense>
            )}
          />
          <MainLayoutRoutes
            exact
            path="/operationType/vessel/discharge/damage"
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyDamagePage {...matchprops} />
              </Suspense>
            )}
          />
          <MainLayoutRoutes
            exact
            path="/operationType/vessel/discharge"
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyUnloadOperationPage {...matchprops} />
              </Suspense>
            )}
          />
          <MainLayoutRoutes
            exact
            path="/operationType/vessel/load/loadUnloadStatistics"
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyLoadUnloadPage {...matchprops} />
              </Suspense>
            )}
          />
          <MainLayoutRoutes
            exact
            path="/operationType/vessel/load/damage"
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyDamagePage {...matchprops} />
              </Suspense>
            )}
          />
          <MainLayoutRoutes
            exact
            path="/operationType/vessel/load"
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyLoadOperationsPage {...matchprops} />
              </Suspense>
            )}
          />
          <MainLayoutRoutes
            exact
            path="/operationType/vessel/stowage"
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyStowagePage {...matchprops} />
              </Suspense>
            )}
          />
          <MainLayoutRoutes
            exact
            path="/operationType/vessel"
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyOperationsPage {...matchprops} operations="Vessel" />
              </Suspense>
            )}
          />
          <MainLayoutRoutes
            exact
            path="/operationType/cy"
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyOperationsPage {...matchprops} operations="CY" />
              </Suspense>
            )}
          />
          <MainLayoutRoutes
            exact
            path="/operationType"
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyOperationTypePage {...matchprops} />
              </Suspense>
            )}
          />
          <ErrorLayoutRoute
            exact
            path="/pages/error"
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyErrorPage {...matchprops} />
              </Suspense>
            )}
          />

          <ErrorLayoutRoute
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyErrorPage {...matchprops} />
              </Suspense>
            )}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user:state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // fetch: () => dispatch(fetchVoyagesTopTenOpen()),
    // fetchOperator:(value)=>dispatch(fetchOperatorInfoBasedOnCode(value))
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(Router);
