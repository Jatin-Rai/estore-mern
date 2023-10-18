import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import { Provider } from 'react-redux';
import store from './features/store.js';
import CartPage from './pages/CartPage/index.jsx';
import LoginPage from './pages/LoginPage/index.jsx';
import RegisterPage from './pages/RegisterPage/index.jsx';
import ShippingPage from './pages/ShippingPage/index.jsx';
import PrivateRoute from './components/PrivateRoute/index.jsx';
import PaymentPage from './pages/PaymentPage/index.jsx';
import PlaceOrderPage from './pages/PlaceOrderPage.jsx/index.jsx';
import OrderPage from './pages/OrderPage';
import ProfilePage from './pages/ProfilePage/index.jsx';
import AdminRoute from './components/AdminRoute/index.jsx';
import OrderListPage from './pages/AdminPages/OrderListPage/index.jsx';
import ProductsListPage from './pages/AdminPages/ProductsListPage/index.jsx';
import ProductEditPage from './pages/AdminPages/ProductEditPage/index.jsx';
import UsersListPage from './pages/AdminPages/UsersListPage/index.jsx';
import UserEditPage from './pages/AdminPages/UserEditPage/index.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} element={<HomePage />} />
      <Route path='/product/:id' element={<ProductDetailsPage />} />
      <Route path='/cart' element={<CartPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='' element={<PrivateRoute />}>
        <Route path='/shipping' element={<ShippingPage />} />
        <Route path='/payment' element={<PaymentPage />} />
        <Route path='/placeorder' element={<PlaceOrderPage />} />
        <Route path='/order/:id' element={<OrderPage />} />
        <Route path='/profile' element={<ProfilePage />} />
      </Route>
      <Route path='' element={<AdminRoute />}>
        <Route path='/admin/orderlist' element={<OrderListPage />} />
        <Route path='/admin/productslist' element={<ProductsListPage />} />
        <Route path='/admin/product/:id/edit' element={<ProductEditPage />} />
        <Route path='/admin/userslist' element={<UsersListPage />} />
        <Route path='/admin/user/:id/edit' element={<UserEditPage />} />
      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>,
)
