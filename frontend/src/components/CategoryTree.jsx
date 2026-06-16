export default function CategoryTree({ node, onSelect, selected }) {
  if (!node) return null;
  return (
    <ul className="cat-tree">
      <li>
        <span
          className={selected === node.name ? "cat-selected" : ""}
          onClick={() => onSelect(node.name)}
        >
          {node.name}
        </span>
        {node.children?.length > 0 && node.children.map(child => (
          <CategoryTree key={child.name} node={child} onSelect={onSelect} selected={selected} />
        ))}
      </li>
    </ul>
  );
}
