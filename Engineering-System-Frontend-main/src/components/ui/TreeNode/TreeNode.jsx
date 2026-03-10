// TreeNode.jsx
import { useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";

export default function TreeNode({
  node,
  level = 0,
  selectedNodes,
  setSelectedNodes,
  multiple = false,
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  // هل هذه العقدة مختارة؟
  const isSelected = selectedNodes.some((n) => n._id === node._id);

  // هل بعض الأبناء مختارين (للـ indeterminate)
  const getChildrenSelectedState = () => {
    if (!hasChildren) return { selected: 0, total: 0 };
    let selected = 0;
    let total = node.children.length;

    node.children.forEach((child) => {
      if (selectedNodes.some((n) => n._id === child._id)) selected++;
    });

    return { selected, total };
  };

  const { selected: childrenSelected, total: childrenTotal } =
    getChildrenSelectedState();

  const isIndeterminate =
    hasChildren && childrenSelected > 0 && childrenSelected < childrenTotal;

  // تحديث الاختيار (مع دعم multiple)
  const toggleNode = (e) => {
    e.stopPropagation();

    if (!multiple) {
      // single selection
      setSelectedNodes([node]);
      return;
    }

    // multiple selection
    if (isSelected) {
      setSelectedNodes(selectedNodes.filter((n) => n._id !== node._id));
    } else {
      setSelectedNodes([...selectedNodes, node]);
    }
  };

  // فتح/إغلاق الأبناء
  const toggleOpen = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 cursor-pointer px-2 py-2 my-0.5 hover:bg-gray-100 rounded"
        style={{ marginRight: `${level * 20}px` }}
      >
        {/* زر الفتح/الإغلاق */}
        {hasChildren && (
          <span
            onClick={toggleOpen}
            className="text-xs w-5 h-5 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-200"
          >
            {open ? <BiMinus /> : <BiPlus />}
          </span>
        )}

        {!hasChildren && <span className="w-5" />}

        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected || (multiple && isIndeterminate)}
          ref={(el) => {
            if (el) el.indeterminate = isIndeterminate && !isSelected;
          }}
          onChange={toggleNode}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 cursor-pointer"
        />

        <span
          className="font-medium flex-1"
          onClick={() => multiple || toggleNode(new Event("click"))} // في single mode: click على الاسم يختار
        >
          {node.name}
        </span>

        <span className="text-xs text-gray-500">({node.type})</span>
      </div>

      {/* الأبناء */}
      {open &&
        hasChildren &&
        node.children.map((child) => (
          <TreeNode
            key={child._id}
            node={child}
            level={level + 1}
            selectedNodes={selectedNodes}
            setSelectedNodes={setSelectedNodes}
            multiple={multiple}
          />
        ))}
    </div>
  );
}
