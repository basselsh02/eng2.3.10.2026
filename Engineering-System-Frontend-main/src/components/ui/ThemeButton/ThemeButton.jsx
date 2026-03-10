import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme, toggleTheme } from "../../../features/theme/themeSlice";
import { FaMoon, FaSun } from "react-icons/fa";
import { FaM } from "react-icons/fa6";

export default function ThemeButton() {
  const theme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    dispatch(setTheme(saved));
  }, []);
  useEffect(() => {
    const html = document.documentElement;

    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [theme]);
  return (
    <>
      <button
        onClick={() => dispatch(toggleTheme())}
        className="cursor-pointer"
      >
        {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
      </button>
    </>
  );
}
