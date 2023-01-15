import React, { lazy, Suspense, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './mui_theme/theme';
import { role, token, endutoken } from './utils/actions';
import { ProtectAuth } from './helper/protectAuth';
import { Alert } from '@mui/material';
import Splash from './components/splash';

// Others
const PageNotFound = lazy(() => import('./components/PageNotFound/404Notfound'));
const UserPanel = lazy(() => import('./pages/UserPanel'));
const ProductPage = lazy(() => import('./pages/UserPanel/PDPs/product_display_page'));
const WarrantyRegistration = lazy(() => import('./pages/UserPanel/WarrantyRegistration'));
const ErrorReporting = lazy(() => import('./pages/UserPanel/ReportError'));
const EndUserLogin = lazy(() => import('./pages/UserPanel/EndUserAuthentication/endUserlogin'));
const EndUserSignUp = lazy(() => import('./pages/UserPanel/EndUserAuthentication/endUserRegistration'));
const EndUserOTPScreen = lazy(() => import('./pages/UserPanel/EndUserAuthentication/OTPScreen'));
const UserPanelLayout = lazy(() => import('./pages/UserPanel/user_panel_layout'));

// App Screen Lazy import
const LoginScreen = lazy(() => import('./pages/auth/LoginScreen'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminList = lazy(() => import('./pages/Dashboard/SA_Screens/Admin'));
const Category = lazy(() => import('./pages/Dashboard/SA_Screens/Category/category'));
const Brands = lazy(() => import('./pages/Dashboard/SA_Screens/Brand'));
const ManufacturerAdmin = lazy(() => import('./pages/Dashboard/SA_Screens/Admin/ManufacturerAdmin'));
const SubCategory = lazy(() => import('./pages/Dashboard/SA_Screens/Category/subcategory'));
const ForgetPassword = lazy(() => import('./pages/auth/ForgetPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const CreateCompanyAdmin = lazy(() => import('./pages/Dashboard/SA_Screens/Admin/CompanyAdmin/createCompanyAdmin'));
const EditCompanyAdmin = lazy(() => import('./pages/Dashboard/SA_Screens/Admin/CompanyAdmin/editCompanyAdmin'));
const ViewCompanyAdmin = lazy(() => import('./pages/Dashboard/SA_Screens/Admin/CompanyAdmin/viewCompanyAdmin'));
const RegisterCompanyAdmin = lazy(() => import('./pages/Dashboard/SA_Screens/Admin/CompanyAdmin/registerCompanyAdmin'));
const CreateCategory = lazy(() => import('./pages/Dashboard/SA_Screens/Category/category/createCategory'));
const EditCategory = lazy(() => import('./pages/Dashboard/SA_Screens/Category/category/editCategory'));
const CreateSubCategory = lazy(() => import('./pages/Dashboard/SA_Screens/Category/subcategory/createSubCategory'));
const EditSubCategory = lazy(() => import('./pages/Dashboard/SA_Screens/Category/subcategory/editSubCategory'));
const ViewSubCategory = lazy(() => import('./pages/Dashboard/SA_Screens/Category/subcategory/viewSubCategory'));
const CreateManufacturer = lazy(() => import('./pages/Dashboard/SA_Screens/Admin/ManufacturerAdmin/createManufacturer'));
const EditManufactureAdmin = lazy(() => import('./pages/Dashboard/SA_Screens/Admin/ManufacturerAdmin/editManufacture'));
const RegisterManufacturer = lazy(() => import('./pages/Dashboard/SA_Screens/Admin/ManufacturerAdmin/registerManufacturer'));
const ViewManufacturerAdmin = lazy(() => import('./pages/Dashboard/SA_Screens/Admin/ManufacturerAdmin/viewManufacturer'));
const CreateBrand = lazy(() => import('./pages/Dashboard/SA_Screens/Brand/createBrand'));
const BrandDetail = lazy(() => import('./pages/Dashboard/SA_Screens/Brand/brandDetail'));
const EditBrand = lazy(() => import('./pages/Dashboard/SA_Screens/Brand/editBrand'));
// Manufacturer
const Label = lazy(() => import('./pages/Dashboard/MA_Screens/Label'));
// Company
const CreateLabel = lazy(() => import('./pages/Dashboard/MA_Screens/Label/createLabel'));
const LabelDetail = lazy(() => import('./pages/Dashboard/MA_Screens/Label/labelDetail'));
const Product = lazy(() => import('./pages/Dashboard/CA_Screens/Product'));
const CreateProduct = lazy(() => import('./pages/Dashboard/CA_Screens/Product/CreateProduct'));
const CreateProduct2 = lazy(() => import('./pages/Dashboard/CA_Screens/Product/CreateProduct2'));
const UpdateProduct = lazy(() => import('./pages/Dashboard/CA_Screens/Product/UpdateProduct'));
const ProductDetail = lazy(() => import('./pages/Dashboard/CA_Screens/Product/ProductDetail'));

const App = () => {
  const [user, setUser] = useState("");
  const [error, setError] = useState();
  useEffect(() => {
    ProtectAuth()
      .then(res => setUser(res))
      .catch(error => {
        setError(error);
      });
  }, []);

  if (!window.navigator.onLine) return (
    <div>
      <h1>No internet Connection</h1>;
      <button onClick={() => window.location.reload()}>Reload Page</button>
    </div>
  );

  {/* Error Responser */ }
  if (error) return <Alert severity="error">{error}</Alert>;


  return (
    <Suspense fallback={<Splash token={token} />}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            {/* ====================x==================== */}

            {/* Admin Panel Routes */}
            <Route path="/ls-admin" element={PrivateRoute(token, <Dashboard user={user} />, "/ls-admin/login")} >
              {/* SUPER ADMIN ROUTES */}
              {role === 1 &&
                <Route path='/ls-admin' element={AdminRoute(role === 1, <Outlet />)}>
                  {/* SUPER ADMIN ROUTES */}
                  <Route path='admins' element={<AdminList />} />

                  {/* Company admin */}
                  <Route path='admins/register-company-admin' element={<RegisterCompanyAdmin />} />
                  <Route path='admins/create-company-admin' element={<CreateCompanyAdmin />} />
                  <Route path='admins/edit-company-admin' element={<EditCompanyAdmin />} />
                  <Route path='admins/detail' element={<ViewCompanyAdmin />} />

                  {/* Manufacturer admin */}
                  <Route path='admins/register-manufacturer' element={<RegisterManufacturer />} />
                  <Route path='admins/view-manufacturer' element={<ManufacturerAdmin />} />
                  <Route path='admins/create-manufacturer' element={<CreateManufacturer />} />
                  <Route path='admins/edit-manufacturer' element={<EditManufactureAdmin />} />
                  <Route path='admins/manufacturer-detail' element={<ViewManufacturerAdmin />} />

                  {/* Category */}
                  <Route path='category' element={<Category />} />
                  <Route path='category/create-category' element={<CreateCategory />} />
                  <Route path='category/edit-category' element={<EditCategory />} />

                  {/* Sub-category */}
                  <Route path='subcategory' element={<SubCategory />} />
                  <Route path='subcategory/create-subcategory' element={<CreateSubCategory />} />
                  <Route path='subcategory/edit-subcategory' element={<EditSubCategory />} />
                  <Route path='subcategory/view-subcategory' element={<ViewSubCategory />} />

                  {/* Brands */}
                  <Route path='brands' element={<Brands />} />
                  <Route path='brands/create-brand' element={<CreateBrand />} />
                  <Route path='brands/brand-detail' element={<BrandDetail />} />
                  <Route path='brands/edit-brand' element={<EditBrand />} />
                </Route>
              }

              {/* COMPANY ADMIN ROUTES */}
              {role === 2 &&
                <Route path='/ls-admin' element={AdminRoute(role === 2, <Outlet />, "/")}>
                  <Route path='products' element={<Product user={user} />} />
                  <Route path='products/create-product' element={<CreateProduct user={user} />} />
                  <Route path='products/CreateProduct' element={<CreateProduct2 />} />
                  <Route path='products/update' element={<UpdateProduct />} />
                  <Route path='products/detail' element={<ProductDetail />} />
                </Route>
              }

              {/* MANUFACTURER ADMIN ROUTES */}
              {role === 3 &&
                <Route path='/ls-admin' element={AdminRoute(role === 3, <Outlet />, "/")}>
                  <Route path='label' element={<Label user={user} />} />
                  <Route path='label/create-label' element={<CreateLabel user={user} />} />
                  <Route path='label/detail' element={<LabelDetail user={user} />} />
                </Route>
              }

            </Route>
            <Route path="ls-admin/login" element={PrivateRoute(!token, <LoginScreen />, "/ls-admin")} />
            <Route path='ls-admin/forgetpassword' element={PrivateRoute(!token, <ForgetPassword />, "/ls-admin")} />
            <Route path='ls-admin/passwordreset/:resetToken' element={PrivateRoute(!token, <ResetPassword />, "/ls-admin")} />

            {/* ====================x==================== */}

            {/* User Panel Routes */}
            <Route path='/' element={<UserPanelLayout />}>
              <Route index element={<UserPanel />} />
              <Route path='/:type/:dsN' element={<Outlet />}>
                <Route index element={<ProductPage />} />
                <Route path='register-warranty' element={<WarrantyRegistration />} />
                <Route path='report-error' element={<ErrorReporting />} />
              </Route>
            </Route>

            {/* End User Authentication */}
            <Route path="/user" element={PrivateRoute(!endutoken, <Outlet />, "/")}>
              <Route path='login' element={<EndUserLogin />} />
              <Route path='sign-up' element={<EndUserSignUp />} />
              <Route path='verification' element={<EndUserOTPScreen />} />
              <Route path='forgetpassword' element={<ForgetPassword />} />
            </Route>

            {/* ====================x==================== */}

            {/* Unknow Route */}
            <Route path='*' element={<PageNotFound />} />

            {/* ====================x==================== */}
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Suspense>
  );
};

const PrivateRoute = (auth, children, path) => {
  return auth ? children : <Navigate to={path} />;
};

const AdminRoute = (role, children, path) => {
  return role ? children : <Navigate to={path} />;
};

export default App;