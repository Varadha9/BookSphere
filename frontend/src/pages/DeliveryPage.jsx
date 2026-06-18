import { useState } from "react";
import { dijkstra } from "../store/useStore";
import { DELIVERY_GRAPH } from "../data/mockData";

const CITIES = Object.keys(DELIVERY_GRAPH);

export default function DeliveryPage() {
  const [src, setSrc]     = useState("Mumbai");
  const [dest, setDest]   = useState("Bangalore");
  const [result, setResult] = useState(null);

  function findRoute() {
    setResult(dijkstra(src, dest));
  }

  return (
    <div className="page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Shipping & logistics</span>
          <h2>🚚 Delivery Tracker</h2>
        </div>
      </div>

      <div className="delivery-controls">
        <label>
          Ship from:
          <select value={src} onChange={e => { setSrc(e.target.value); setResult(null); }}>
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </label>
        <span style={{ color: "var(--muted)" }}>→</span>
        <label>
          Deliver to:
          <select value={dest} onChange={e => { setDest(e.target.value); setResult(null); }}>
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </label>
        <button className="btn-primary" onClick={findRoute} disabled={src === dest}>
          Find Route
        </button>
      </div>

      {result && (
        <div className="delivery-result">
          {result.distance === Infinity ? (
            <p className="error">No route found between {src} and {dest}.</p>
          ) : (
            <>
              <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: 12 }}>Optimal shipping route</p>
              <div className="path-display">
                {result.path.map((city, i) => (
                  <span key={city}>
                    <span className="city-node">{city}</span>
                    {i < result.path.length - 1 && <span className="path-arrow">──▶</span>}
                  </span>
                ))}
              </div>
              <p className="distance-info">📏 Total distance: <strong>{result.distance} km</strong></p>
              <p style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: 6 }}>
                Estimated delivery: {Math.ceil(result.distance / 400)} – {Math.ceil(result.distance / 300)} business days
              </p>
            </>
          )}
        </div>
      )}

      <div className="graph-info">
        <h4>📍 Available Delivery Locations</h4>
        <div className="graph-edges">
          {CITIES.map(city => (
            <span key={city} className="edge-chip">{city}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
