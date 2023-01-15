import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../../components/UserPanelLayout/footer";
import Navbar from "../../components/UserPanelLayout/navbar";

const UserPanelLayout = () => {
  return (
    <div className="width-100per">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default UserPanelLayout;
