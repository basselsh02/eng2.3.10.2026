import React from "react";
import ThemeButton from "../ThemeButton/ThemeButton";
import { BsLayoutSidebarReverse } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../../../features/sidebar/sidebarSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  return (
    <>
      <div className="w-full flex justify-between items-center px-5 py-4 bg-base">
        {/* logo */}
        <BsLayoutSidebarReverse
          className="cursor-pointer"
          size={20}
          onClick={() => {
            dispatch(toggleSidebar());
          }}
        />
        <h1 className="text-2xl font-bold">ادارة النظام</h1>
        {/* sidebarToggle */}
        {/* ThemeButton */}
        <ThemeButton />
      </div>
    </>
  );
}
