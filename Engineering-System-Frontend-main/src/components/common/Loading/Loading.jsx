import React from "react";
import { ThreeDot } from "react-loading-indicators";

export default function Loading() {
  return (
    <>
      <div className="min-h-[calc(100vh-100px)] flex items-center justify-center">
        <div role="status">
          <ThreeDot
            variant="brick-stack"
            color="var(--color-primary-600)"
            size="small"
            text="جاري التحميل ..."
            textColor="var(--color-primary-600)"
          />
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      ;
    </>
  );
}
