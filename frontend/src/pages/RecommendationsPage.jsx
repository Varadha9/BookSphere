import { useState } from "react";
import { bfsRecommend } from "../store/useStore";
import { PRODUCTS } from "../data/mockData";
import ProductCard from "../components/ProductCard";

export default function RecommendationsPage() {
  const [selected, setSelected] = useState(PRODUCTS[0]);
  const [depth, setDepth] = useState(2);
  const recs = bfsRecommend(selected.id, depth);

  return (
    <div className="page">
      {/* DSA: Graph + BFS  →  Map<Book, Set<Book>> adjacency map
           BFS frontier expands level by level, HashSet tracks visited nodes. O(V+E) */}
      <h2>🤝 Recommendations</h2>

      <div className="rec-controls">
        <label>
          Base product:
          <select value={selected.id} onChange={e => setSelected(PRODUCTS.find(p => p.id === e.target.value))}>
            {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
        <label>
          BFS depth:
          <select value={depth} onChange={e => setDepth(+e.target.value)}>
            {[1, 2, 3].map(d => <option key={d}>{d}</option>)}
          </select>
        </label>
      </div>

      <div className="rec-seed">
        <p>Readers who bought <strong>{selected.name}</strong> also bought:</p>
      </div>

      {recs.length === 0
        ? <p className="empty">No recommendations found at depth {depth}.</p>
        : <div className="product-grid">{recs.map(p => <ProductCard key={p.id} product={p} />)}</div>
      }
    </div>
  );
}
