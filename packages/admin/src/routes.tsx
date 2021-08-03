import React, { useContext, lazy, Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import {
  LOGIN,
  PRODUCTS,
  CATEGORY,
  PURCHASING,
  ADDPURCHASING,
  ORDERS,
  SETTINGS,
  ADDUSER,
  CUSTOMERS,
  COUPONS,
  STAFF_MEMBERS,
  SITE_SETTINGS,
  PASSWORD_RESET,
  FORGET_PASSWORD
} from './settings/constants';
import AuthProvider, { AuthContext } from './context/auth';
import { InLineLoader } from './components/InlineLoader/InlineLoader';
const Products = lazy(() => import('./containers/Products/Products'));
const AdminLayout = lazy(() => import('./containers/Layout/Layout'));
const Purchasing = lazy(() => import('./containers/Purchasing/Purchasing'));
const AddPurchasing = lazy(() => import('./containers/Purchasing/AddPurchasing'));
const AddUser = lazy(() => import('./containers/Settings/AddUser'));
const Category = lazy(() => import('./containers/Category/Category'));
const Orders = lazy(() => import('./containers/Orders/Orders'));
const Settings = lazy(() => import('./containers/Settings/Settings'));
const SiteSettingForm = lazy(() =>
  import('./containers/SiteSettingForm/SiteSettingForm')
);
const StaffMembers = lazy(() =>
  import('./containers/StaffMembers/StaffMembers')
);
const Customers = lazy(() => import('./containers/Customers/Customers'));
const Coupons = lazy(() => import('./containers/Coupons/Coupons'));
const Login = lazy(() => import('./containers/Login/Login'));
const NotFound = lazy(() => import('./containers/NotFound/NotFound'));
const ForgetPassword = lazy(() => import('./containers/PasswordReset/ForgetPassword'));
const PasswordReset = lazy(() => import('./containers/PasswordReset/PasswordReset'));

/**
 *
 *  A wrapper for <Route> that redirects to the login
 * screen if you're not yet authenticated.
 *
 */

function PrivateRoute({ children, ...rest }) {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

const Routes = () => {
  return (
    <AuthProvider>
      <Suspense fallback={<InLineLoader />}>
        <Switch>
          <PrivateRoute exact={true} path={PURCHASING}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Purchasing />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={ADDPURCHASING}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <AddPurchasing />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={PRODUCTS}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Products />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={CATEGORY}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Category />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={ORDERS}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Orders />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={CUSTOMERS}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Customers />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={COUPONS}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Coupons />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={SETTINGS}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Settings />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={ADDUSER}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <AddUser />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={STAFF_MEMBERS}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <StaffMembers />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={SITE_SETTINGS}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <SiteSettingForm />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <Route path={LOGIN}>
            <Login />
          </Route>
          <Route path={PASSWORD_RESET}>
            <PasswordReset />
          </Route>
          <Route path={FORGET_PASSWORD}>
            <ForgetPassword />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </AuthProvider>
  );
};

export default Routes;
