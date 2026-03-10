import React from "react";

export default function PageTitle({ title = "عنوان الصفحة", subTitle }) {
  return (
    <div className="border-b border-primary-500 p-2 w-fit">
      <h2 className="text-2xl font-bold w-fit">{title}</h2>
      {subTitle && <p className="text-sm">{subTitle}</p>}
    </div>
  );
}
