import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Outlet } from 'react-router-dom';


const DashBoard = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default DashBoard;