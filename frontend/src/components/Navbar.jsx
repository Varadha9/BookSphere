import { useStore } from "../store/useStore";
import { supabase } from "../lib/supabase";

const pages = [
  { name: "Catalog", icon: "⌘" },
  { name: "Cart", icon: "Bag" },
  { name: "Orders", icon: "Box" },
  { name: "Delivery", icon: "Map" },
  { name: "Recommendations", icon: "Spark" },
  { name: "UX", icon: "Flow" },
];

export default function Navbar({ page, setPage }) {
  const { state, dispatch } = useStore();
  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);

  return (
    <nav className="navbar">
      <button className="logo" onClick={() => setPage("Catalog")} aria-label="Go to catalog">
        <span className="logo-mark">B</span>
        <span>
          <strong>BookSphere</strong>
          <small>Curated reads</small>
        </span>
      </button>
      <div className="nav-links">
        {pages.map(p => (
          <button key={p.name} className={page === p.name ? "active" : ""} onClick={() => setPage(p.name)}>
            <span className="nav-icon">{p.icon}</span>
            <span>{p.name}</span>
            {p.name === "Cart" && cartCount > 0 ? <b>{cartCount}</b> : null}
          </button>
        ))}
      </div>
      <div className="nav-user">
        <span className="user-pill">
          <span className="avatar">{state.user?.name?.slice(0, 1).toUpperCase()}</span>
          <span>{state.user?.name}</span>
          {state.user?.isPremium ? <em>Premium</em> : null}
        </span>
        <button onClick={() => supabase.auth.signOut()}>Logout</button>
      </div>
    </nav>
  );
}
