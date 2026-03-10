import React from "react";
import { Outlet } from "react-router";

export default function GuestLayout() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Outlet />
      </div>
    </>
  );
}
