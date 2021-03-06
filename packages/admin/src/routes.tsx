import React, { useContext, lazy, Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import {
  LOGIN,
  PRODUCTS,
  ADDPRODUCT,
  RESUME,
  LABEL,
  ADDRESUME,
  PURCHASING,
  REPURCHASING,
  VIEWPURCHASING,
  EDITPURCHASING,
  ADDPURCHASING,
  IMPORTPURCHASING,
  ORDERS,
  SETTINGS,
  ADDUSER,
  CUSTOMERS,
  COUPONS,
  STAFF_MEMBERS,
  SITE_SETTINGS,
  PASSWORD_RESET,
  FORGET_PASSWORD,
  VIEWUSER,
  VIEWRESUME, 
  REALFOOD
} from './settings/constants';
import AuthProvider, { AuthContext } from './context/auth';
import { InLineLoader } from './components/InlineLoader/InlineLoader';
const Products = lazy(() => import('./containers/Products/Products'));
const AddProduct = lazy(() => import('./containers/Products/AddProduct'))
const AdminLayout = lazy(() => import('./containers/Layout/Layout'));
const Purchasing = lazy(() => import('./containers/Purchasing/Purchasing'));
const RePurchasing = lazy(() => import('./containers/Purchasing/RePurchasing'))
const ViewPruchasing = lazy(() => import('./containers/Purchasing/ViewPurchasing'));
const AddPurchasing = lazy(() => import('./containers/Purchasing/AddPurchasing'));
const ImportPurchasing = lazy(() => import('./containers/Purchasing/ImportPurchasing'));
const EditPurchasing = lazy(() => import('./containers/Purchasing/EditPurchasing'));
const AddUser = lazy(() => import('./containers/Settings/AddUser'));
const ViewUser = lazy(() => import('./containers/Settings/ViewUser'));
const Resume = lazy(() => import('./containers/Resume/Resume'));
const Label = lazy(() => import('./containers/Resume/Label'));
const AddResume = lazy(() => import('./containers/Resume/AddResume'));
const ViewResume = lazy(() => import('./containers/Resume/ViewResume'));
const Orders = lazy(() => import('./containers/Orders/Orders'));
const Settings = lazy(() => import('./containers/Settings/Settings'));
const SiteSettingForm = lazy(() => import('./containers/SiteSettingForm/SiteSettingForm'));
const StaffMembers = lazy(() => import('./containers/StaffMembers/StaffMembers'));
const Customers = lazy(() => import('./containers/Customers/Customers'));
const Coupons = lazy(() => import('./containers/Coupons/Coupons'));
const Login = lazy(() => import('./containers/Login/Login'));
const NotFound = lazy(() => import('./containers/NotFound/NotFound'));
const ForgetPassword = lazy(() => import('./containers/PasswordReset/ForgetPassword'));
const PasswordReset = lazy(() => import('./containers/PasswordReset/PasswordReset'));
const RealFood = lazy(() => import('./containers/RealFood/RealFood'));
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
          <PrivateRoute exact={true} path={REPURCHASING}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <RePurchasing />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute exact={true} path={VIEWPURCHASING}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <ViewPruchasing />
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
          <PrivateRoute path={IMPORTPURCHASING}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <ImportPurchasing />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={EDITPURCHASING}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <EditPurchasing />
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
          <PrivateRoute path={ADDPRODUCT}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <AddProduct />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={RESUME}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Resume />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={LABEL}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Label />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={ADDRESUME}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <AddResume />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={VIEWRESUME}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <ViewResume />
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
          <PrivateRoute path={VIEWUSER}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <ViewUser />
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
          <Route path={REALFOOD}>
            <RealFood />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </AuthProvider>
  );
};

export default Routes;
