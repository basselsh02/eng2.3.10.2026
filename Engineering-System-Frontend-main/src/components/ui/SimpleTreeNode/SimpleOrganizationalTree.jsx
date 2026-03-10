// SimpleOrganizationalTree.jsx
import SimpleTreeNode from "./SimpleTreeNode";

export default function SimpleOrganizationalTree({ data, onSelect }) {
  return (
    <div className="p-3">
      {data?.map((node) => (
        <SimpleTreeNode key={node._id} node={node} onSelect={onSelect} />
      ))}
    </div>
  );
}
