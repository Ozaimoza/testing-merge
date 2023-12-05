// AdminRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Flex } from "@chakra-ui/react";
import AdminLogin from '../pages/admin/adminLogin';
import Home from '../pages/admin/home';
import Order from '../pages/admin/Order';
import User from '../pages/Admin/User';
import Product from '../pages/Admin/Product';
import FormAddProduct from '../components/Admin/FormAddProduct';
import FormEditProduct from '../components/Admin/FormEditProduct';
import AdminSidebar from '../components/Admin/AdminSidebar';
import Warehousepage from '../pages/Admin/Warehousepage';
import WarehouseForm from '../components/Admin/WareHouseForm';

const checkAuthentication = () => {
  // Periksa apakah token ada di localStorage
  return localStorage.getItem('Token');
};

const PrivateRoute = ({ element }) => {
  return checkAuthentication() ? element : <Navigate to="/admin/login" />;
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

const AdminRouter = () => {
  const isAuthenticated = checkAuthentication();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/admin/order" /> : <Navigate to="/admin/login" />} />
      <Route path="/login" element={<AdminLogin />} />
      
      {isAuthenticated && (
        <Route
          path="/*"
          element={
            <Flex w="100vw" h="100vh">
              <AdminSidebar />
              <Box bg="white" w="full" h="full">
                <Routes>
                  <Route path="/home" element={<PrivateRoute element={<Home />} />} />
                  <Route path="/order" element={<PrivateRoute element={<Order />} />} />
                  <Route path="/user" element={<PrivateRoute element={<User />} />} />
                  <Route path="/product" element={<PrivateRoute element={<Product />} />} />
                  <Route path="/product/add" element={<PrivateRoute element={<FormAddProduct />} />} />
                  <Route path="/product/edit/:id" element={<PrivateRoute element={<FormEditProduct />} />} />
                  <Route path="/warehouse" element={<PrivateRoute element={<Warehousepage />} />} />
                  <Route path="/warehouse/create" element={<PrivateRoute element={<WarehouseForm />} />} />
                </Routes>
              </Box>
            </Flex>
          }
        />
      )}
    </Routes>
  );
};

export default AdminRouter;
