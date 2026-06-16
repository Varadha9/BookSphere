import { useState } from "react";
import { dijkstra } from "../store/useStore";
import { DELIVERY_GRAPH } from "../data/mockData";

const CITIES = Object.keys(DELIVERY_GRAPH);

export default function DeliveryPage() {
  const [src, setSrc] = useState("Mumbai");
  const [dest, setDest] = useState("Bangalore");
  const [result, setResult] = useState(null);

  function findRoute() {
    setResult(dijkstra(src, dest));
  }

  return (
    <div className="page">
      {/* DSA: Graph (Adjacency List)  →  Map<String, List<Edge>>
           + Dijkstra  →  PriorityQueue<int[]> min-heap relaxation
           Shortest delivery path in O((V+E) log V) */}
      <h2>🚚 Delivery Route Finder</h2>

      <div className="delivery-controls">
        <label>
          From:
          <select value={src} onChange={e => setSrc(e.target.value)}>
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </label>
        <span>→</span>
        <label>
          To:
          <select value={dest} onChange={e => setDest(e.target.value)}>
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </label>
        <button className="btn-primary" onClick={findRoute} disabled={src === dest}>Find Shortest Path</button>
      </div>

      {result && (
        <div className="delivery-result">
          {result.distance === Infinity ? (
            <p className="error">No route found between {src} and {dest}.</p>
          ) : (
            <>
              <div className="path-display">
                {result.path.map((city, i) => (
                  <span key={city}>
                    <span className="city-node">{city}</span>
                    {i < result.path.length - 1 && <span className="path-arrow">──▶</span>}
                  </span>
                ))}
              </div>
              <p className="distance-info">📏 Total distance: <strong>{result.distance} km</strong></p>
            </>
          )}
        </div>
      )}

      <div className="graph-info">
        <h4>📍 Network Map:</h4>
        <div className="graph-edges">
          {Object.entries(DELIVERY_GRAPH).map(([city, edges]) =>
            edges.map(({ to, dist }) => (
              <span key={`${city}-${to}`} className="edge-chip">{city} → {to}: {dist}km</span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
