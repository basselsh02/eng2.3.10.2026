// SimpleTreeNode.jsx - للاستخدام في إدارة الوحدات (single select فقط)
import { useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";

export default function SimpleTreeNode({ node, level = 0, onSelect }) {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const toggleOpen = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 cursor-pointer px-2 py-2 my-0.5 hover:bg-gray-100 rounded transition"
        style={{ marginRight: `${level * 20}px` }}
        onClick={() => onSelect?.(node)}
      >
        {hasChildren && (
          <span
            onClick={toggleOpen}
            className="text-xs w-5 h-5 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-200"
          >
            {open ? <BiMinus /> : <BiPlus />}
          </span>
        )}

        {!hasChildren && <span className="w-5" />}

        <span className="font-medium flex-1">{node.name}</span>
        <span className="text-xs text-gray-500">({node.type})</span>
      </div>

      {open &&
        hasChildren &&
        node.children.map((child) => (
          <SimpleTreeNode
            key={child._id}
            node={child}
            level={level + 1}
            onSelect={onSelect}
          />
        ))}
    </div>
  );
}
