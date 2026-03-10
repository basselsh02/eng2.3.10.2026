// OrganizationalTree.jsx
import TreeNode from "../TreeNode/TreeNode";

export default function OrganizationalTree({
  data,
  selectedNodes,
  setSelectedNodes,
  multiple = false,
}) {
  return (
    <div className="p-3">
      {data.map((node) => (
        <TreeNode
          key={node._id}
          node={node}
          selectedNodes={selectedNodes}
          setSelectedNodes={setSelectedNodes}
          multiple={multiple}
        />
      ))}
    </div>
  );
}
