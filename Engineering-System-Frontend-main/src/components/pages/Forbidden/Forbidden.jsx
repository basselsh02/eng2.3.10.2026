import React from "react";
import Image403 from "../../../assets/images/Forbidden.svg";
import Button from "../../ui/Button/Button";
import { useNavigate } from "react-router";
export default function Forbidden() {
  const navigate = useNavigate();
  return (
    <>
      <section className="h-[calc(100vh-100px)] flex flex-col justify-center items-center ">
        <div className="text-center -mb-10">
          <h1 className="text-xl font-extrabold">غير مصرح</h1>
          <p>لا يمكنك الوصول لهذه الصفحة</p>
          <p className="text-xs font-light">يرجى التحقق من صلاحياتك</p>
        </div>
        <img src={Image403} alt="403" className="h-auto max-w-lg" />
        <div className="-mt-10">
          <Button onClick={() => navigate("/")}>الصفحة الرئيسية</Button>
        </div>
      </section>
    </>
  );
}
