"use client";

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { fetchVendorProfile } from "@/store/slices/admin/authSlice";

import Nav from "./nav";
import Main from "./main";
import Header from "./header";

export default function DashboardLayout({ children }) {
  const [openNav, setOpenNav] = useState(false);
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.adminAuth);

  useEffect(() => {
    if (admin?.role === "vendor" && admin?._id) {
      dispatch(fetchVendorProfile(admin._id));
    }
  }, [admin, dispatch]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50/50">
      <Header onOpenNav={() => setOpenNav(true)} />

      <div className="flex flex-col lg:flex-row w-full min-h-screen">
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />

        <Main>{children}</Main>
      </div>
    </div>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
