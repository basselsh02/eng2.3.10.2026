import React, { useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";
import { useNavigate } from "react-router";
import { hasAnyPermission } from "../../../utils/permission.utils";

export default function SidebarNode({ node, isOpen, level = 0, user }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const effectiveOpen = isOpen ? open : false;

  // هل العنصر نفسه متاح (إما بدون permissions أو لديه صلاحية)
  const nodeHasPermission =
    !node.permissions ||
    node.permissions.length === 0 ||
    hasAnyPermission(user, node.permissions);

  // إذا كان leaf (بدون أطفال) → نعتمد على صلاحيته فقط
  const hasChildren = node.children && node.children.length > 0;

  // حساب الأطفال الظاهرين (اللي ليهم صلاحية)
  const visibleChildren = hasChildren
    ? node.children.filter((child) => {
        return (
          !child.permissions ||
          child.permissions.length === 0 ||
          hasAnyPermission(user, child.permissions)
        );
      })
    : [];

  const hasVisibleChildren = visibleChildren.length > 0;

  // القرار النهائي: هل نظهر هذا العنصر؟
  // - لو leaf → نظهره لو له صلاحية أو بدون permissions
  // - لو parent → نظهره فقط لو فيه ولو طفل واحد ظاهر
  const shouldRenderNode = !hasChildren
    ? nodeHasPermission
    : hasVisibleChildren;

  // لو مش هيترندر → نرجع null
  if (!shouldRenderNode) {
    return null;
  }

  return (
    <div className="relative group">
      {/* العنصر الرئيسي (الأب أو leaf) */}
      <div
        onClick={() => {
          if (hasChildren) {
            setOpen(!open);
          } else if (node.path) {
            navigate(node.path);
          }
        }}
        className={`flex items-center justify-between w-full p-2 rounded-md cursor-pointer
          hover:bg-primary-300 hover:text-primary-content-300 transition-colors duration-200 relative`}
        style={{ paddingRight: `${level * 20 + 12}px` }} // أفضل لـ RTL
      >
        {/* الخط العمودي للأطفال */}
        {level > 0 && (
          <span className="absolute start-5 top-0 bottom-0 border-s border-primary-200 w-0"></span>
        )}

        <div className="flex items-center gap-2">
          {node.icon && <span className="text-lg">{node.icon}</span>}
          {isOpen && <span className="font-medium">{node.label}</span>}
        </div>

        {/* السهم للفتح/الغلق - فقط لو في أطفال ظاهرة */}
        {hasVisibleChildren && isOpen && (
          <span className="text-gray-500">
            {effectiveOpen ? <BiMinus /> : <BiPlus />}
          </span>
        )}
      </div>

      {/* الأطفال - فقط لو في أطفال ظاهرة */}
      {hasVisibleChildren && (
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: effectiveOpen
              ? `${visibleChildren.length * 48}px`
              : "0px",
          }}
        >
          {visibleChildren.map((child) => (
            <SidebarNode
              key={child.path || child.label}
              node={child}
              isOpen={isOpen}
              level={level + 1}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
}
