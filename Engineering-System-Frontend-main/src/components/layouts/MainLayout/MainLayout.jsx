import React, { useEffect } from "react";
import { Outlet } from "react-router";
import Navbar from "../../ui/Navbar/Navbar";
import Sidebar from "../../ui/Sidebar/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../../features/auth/authSlice";

export default function MainLayout() {
  const dispatch = useDispatch();
  const { token, profile } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !profile) {
      dispatch(fetchUserProfile());
    }
  }, [token, profile, dispatch]);
  return (
    <>
      <div className="h-screen flex overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />

          <section className="flex-1 overflow-y-auto p-4">
            <Outlet />
          </section>
        </div>
      </div>
    </>
  );
}
