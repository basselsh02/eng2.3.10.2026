import React from "react";
import { useNavigate } from "react-router";
import Image404 from "../../../assets/images/NotFound.svg";
import Button from "../../ui/Button/Button";
export default function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <section className="h-[calc(100vh-100px)] flex flex-col justify-center items-center ">
        <div className="text-center">
          <h1 className="text-xl font-extrabold">غير موجود</h1>
          <p>لا يوجد صفحة بهذا الرابط</p>
          <p className="text-xs font-light">يرجى التحقق من الرابط</p>
        </div>
        <img src={Image404} alt="403" className="h-auto max-w-lg" />
        <div>
          <Button onClick={() => navigate("/")}>الصفحة الرئيسية</Button>
        </div>
      </section>
    </>
  );
}
