import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UserPage from '../pages/User/UserPage';

const UserRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<UserPage />} />
      {/* Tambahkan rute pengguna lainnya di sini */}
    </Routes>
  );
};

export default UserRouter;
