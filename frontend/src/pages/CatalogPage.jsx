import { useState } from "react";
import { useStore } from "../store/useStore";
import ProductCard from "../components/ProductCard";
import CategoryTree from "../components/CategoryTree";
import { CATEGORY_TREE } from "../data/mockData";

const SORT_OPTIONS = [
  { value: "default",    label: "Featured" },
  { value: "price-asc",  label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
  { value: "rating",     label: "Top Rated" },
];

const TRENDING_IDS = ["p3", "p1", "p6", "p12"];
const NEW_IDS      = ["p12", "p10", "p9", "p6"];

const BANNER_BOOKS = [
  { id: "p3",  label: "Science Fiction", tag: "Award Winner" },
  { id: "p6",  label: "Self-Help",       tag: "#1 Bestseller" },
  { id: "p2",  label: "Programming",     tag: "Must Read" },
];

const BOOK_IMAGES = {
  p1:"https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80",
  p2:"https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&q=80",
  p3:"https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=80",
  p4:"https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&q=80",
  p5:"https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80",
  p6:"https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&q=80",
  p7:"https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
  p8:"https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&q=80",
  p9:"https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80",
  p10:"https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80",
  p11:"https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=600&q=80",
  p12:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
};

export default function CatalogPage({ setPage }) {
  const { state, dispatch } = useStore();
  const [searchKw, setSearchKw]       = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [bannerIdx, setBannerIdx]     = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { min, max } = state.priceFilter;
  const sortBy = state.sortBy;

  let products = state.priceSorted.filter(p => p.price >= min && p.price <= max);
  if (selectedCat !== "All") {
    products = products.filter(p =>
      p.category === selectedCat ||
      p.tags.some(t => t.toLowerCase() === selectedCat.toLowerCase())
    );
  }
  const sorted = [...products].sort((a, b) => {
    if (sortBy === "price-asc")  return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating")     return b.rating - a.rating;
    return 0;
  });
  const displayProducts = state.searchResults ? state.searchResults.results : sorted;
  const trending    = state.catalog.filter(p => TRENDING_IDS.includes(p.id));
  const newArrivals = state.catalog.filter(p => NEW_IDS.includes(p.id));
  const activeBanner = BANNER_BOOKS[bannerIdx];
  const bannerBook   = state.catalog.find(p => p.id === activeBanner?.id);

  if (!state.catalog.length) {
    return (
      <div className="page">
        <div className="catalog-loading">
          <span className="auth-spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
          <p>Loading books…</p>
        </div>
      </div>
    );
  }

  function handleSearch(e) {
    e.preventDefault();
    if (searchKw.trim()) dispatch({ type: "SEARCH", payload: searchKw.trim() });
    else dispatch({ type: "CLEAR_SEARCH" });
  }

  function clearSearch() {
    dispatch({ type: "CLEAR_SEARCH" });
    setSearchKw("");
  }

  function selectCat(cat) {
    setSelectedCat(cat);
    dispatch({ type: "CLEAR_SEARCH" });
    setSidebarOpen(false);
  }

  return (
    <div className="catalog-page">

      {/* ── Top Search Bar ─────────────────────────────────── */}
      <div className="catalog-search-bar">
        <form onSubmit={handleSearch} className="catalog-search-form">
          <span className="csb-icon">🔍</span>
          <input
            placeholder="Search books, authors, topics…"
            value={searchKw}
            onChange={e => setSearchKw(e.target.value)}
          />
          {searchKw && (
            <button type="button" className="csb-clear" onClick={clearSearch}>✕</button>
          )}
          <button type="submit" className="csb-btn">Search</button>
        </form>
      </div>

      {/* ── Hero Banner ────────────────────────────────────── */}
      {!state.searchResults && selectedCat === "All" && bannerBook && (
        <section className="catalog-banner">
          <div className="banner-content">
            <div className="banner-text">
              <span className="eyebrow">{activeBanner.tag}</span>
              <h1>{bannerBook.name}</h1>
              <p>by {bannerBook.author}</p>
              <div className="banner-price-row">
                <span className="banner-price">₹{bannerBook.price.toLocaleString()}</span>
                <span className="banner-rating">★ {bannerBook.rating}</span>
                <span className="avail-chip-lg">In Stock</span>
              </div>
              <div className="banner-actions">
                <button className="btn-primary" onClick={() => {
                  dispatch({ type: "ADD_TO_CART", payload: { product: bannerBook } });
                  dispatch({ type: "SHOW_TOAST", payload: { message: `"${bannerBook.name}" added to cart`, type: "success" } });
                }}>🛒 Add to Cart</button>
                <button className="btn-outline" onClick={() => {
                  dispatch({ type: "VIEW_PRODUCT", payload: bannerBook });
                  dispatch({ type: "SELECT_BOOK", payload: bannerBook });
                  setPage("BookDetail");
                }}>View Details</button>
              </div>
            </div>
            <div className="banner-cover">
              <img src={BOOK_IMAGES[bannerBook.id]} alt={bannerBook.name} />
            </div>
          </div>
          <div className="banner-dots">
            {BANNER_BOOKS.map((b, i) => (
              <button
                key={b.id}
                className={`banner-dot ${i === bannerIdx ? "active" : ""}`}
                onClick={() => setBannerIdx(i)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Stats strip ────────────────────────────────────── */}
      {!state.searchResults && selectedCat === "All" && (
        <div className="catalog-stats">
          <div className="cstat"><span>📚</span><strong>{state.catalog.length}</strong><small>Books</small></div>
          <div className="cstat"><span>🚚</span><strong>Free</strong><small>Delivery</small></div>
          <div className="cstat"><span>↩</span><strong>Easy</strong><small>Returns</small></div>
          <div className="cstat"><span>🔒</span><strong>Secure</strong><small>Payments</small></div>
          <div className="cstat"><span>⭐</span><strong>Premium</strong><small>Priority Orders</small></div>
        </div>
      )}

      {/* ── Trending shelf ─────────────────────────────────── */}
      {!state.searchResults && selectedCat === "All" && (
        <section className="shelf-section">
          <div className="shelf-heading">
            <h2>🔥 Trending Now</h2>
            <button className="btn-xs" onClick={() => dispatch({ type: "SET_SORT", payload: "rating" })}>See all →</button>
          </div>
          <div className="shelf-row">
            {trending.map(p => <ProductCard key={p.id} product={p} setPage={setPage} compact />)}
          </div>
        </section>
      )}

      {/* ── New Arrivals shelf ─────────────────────────────── */}
      {!state.searchResults && selectedCat === "All" && (
        <section className="shelf-section">
          <div className="shelf-heading">
            <h2>✨ New Arrivals</h2>
          </div>
          <div className="shelf-row">
            {newArrivals.map(p => <ProductCard key={p.id} product={p} setPage={setPage} compact />)}
          </div>
        </section>
      )}

      {/* ── Main catalog ───────────────────────────────────── */}
      <div className="catalog-layout">

        {/* Sidebar toggle for mobile */}
        <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(o => !o)}>
          🗂️ Filters {sidebarOpen ? "▲" : "▼"}
        </button>

        <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
          <section>
            <h4>🗂️ Browse Genre</h4>
            <CategoryTree
              node={CATEGORY_TREE}
              onSelect={selectCat}
              selected={selectedCat}
            />
          </section>

          <section>
            <h4>💰 Price Range</h4>
            <div className="price-inputs">
              <input type="number" placeholder="Min ₹" value={min === 0 ? "" : min}
                onChange={e => dispatch({ type: "SET_PRICE_FILTER", payload: { min: +e.target.value || 0, max } })} />
              <span>–</span>
              <input type="number" placeholder="Max ₹" value={max === 99999 ? "" : max}
                onChange={e => dispatch({ type: "SET_PRICE_FILTER", payload: { min, max: +e.target.value || 99999 } })} />
            </div>
            <div className="price-quick-btns">
              {[[0,300,"Under ₹300"],[300,600,"₹300–₹600"],[600,99999,"Above ₹600"]].map(([mn,mx,lbl]) => (
                <button key={lbl} className={`price-quick-btn ${min===mn&&max===mx?"active":""}`}
                  onClick={() => dispatch({ type: "SET_PRICE_FILTER", payload: { min: mn, max: mx } })}>
                  {lbl}
                </button>
              ))}
              <button className="price-quick-btn" onClick={() => dispatch({ type: "SET_PRICE_FILTER", payload: { min: 0, max: 99999 } })}>
                Reset
              </button>
            </div>
          </section>

          <section>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <h4 style={{ margin: 0 }}>💖 Wishlist
                {state.wishlist.size > 0 && (
                  <span className="sidebar-count">{state.wishlist.size}</span>
                )}
              </h4>
              {state.wishlist.size > 0 && <button className="btn-xs" onClick={() => setPage("Wishlist")}>View All</button>}
            </div>
            {state.wishlist.size === 0 ? (
              <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Tap ♡ on any book to save it.</p>
            ) : (
              <ul className="wishlist-list">
                {[...state.wishlist].slice(0, 5).map(id => {
                  const p = state.catalog.find(x => x.id === id);
                  return p ? <li key={id}>
                    <span style={{ cursor: "pointer" }} onClick={() => { dispatch({ type: "SELECT_BOOK", payload: p }); setPage("BookDetail"); }}>{p.name}</span>
                    <button className="btn-xs" onClick={() => dispatch({ type: "TOGGLE_WISHLIST", payload: id })}>✕</button>
                  </li> : null;
                })}
              </ul>
            )}
          </section>

          {state.recentProducts.length > 0 && (
            <section>
              <h4>🕐 Recently Viewed</h4>
              <ul className="recent-list">
                {state.recentProducts.map(p => (
                  <li key={p.id} className="recent-list-item"
                    onClick={() => { dispatch({ type: "SELECT_BOOK", payload: p }); setPage("BookDetail"); }}>
                    {p.name}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        <main className="catalog-main">
          {/* Toolbar */}
          <div className="catalog-toolbar">
            <div className="toolbar-left">
              <nav className="breadcrumb">
                <span onClick={() => selectCat("All")}>All Books</span>
                {selectedCat !== "All" && <><span className="bc-sep">›</span><span className="bc-active">{selectedCat}</span></>}
                {state.searchResults && <><span className="bc-sep">›</span><span className="bc-active">"{state.searchResults.keyword}"</span></>}
              </nav>
              <h2 className="toolbar-title">
                {state.searchResults
                  ? `Results for "${state.searchResults.keyword}"`
                  : selectedCat === "All" ? "All Books" : selectedCat}
                <span className="result-count">{displayProducts.length} books</span>
              </h2>
            </div>
            <div className="toolbar-right">
              <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>Sort:</span>
              {SORT_OPTIONS.map(o => (
                <button
                  key={o.value}
                  className={`sort-btn ${sortBy === o.value ? "active" : ""}`}
                  onClick={() => dispatch({ type: "SET_SORT", payload: o.value })}
                >{o.label}</button>
              ))}
            </div>
          </div>

          {state.searchResults && state.searchResults.results.length === 0 && (
            <div className="no-results">
              <p>No results for <strong>"{state.searchResults.keyword}"</strong></p>
              <p className="no-results-hint">Try:
                {["programming","fiction","habits","psychology"].map(kw => (
                  <span key={kw} onClick={() => { dispatch({ type: "SEARCH", payload: kw }); setSearchKw(kw); }}>{kw}</span>
                ))}
              </p>
            </div>
          )}

          <div className="product-grid">
            {displayProducts.length
              ? displayProducts.map(p => <ProductCard key={p.id} product={p} setPage={setPage} />)
              : (!state.searchResults && <p className="empty">No books match these filters.</p>)
            }
          </div>
        </main>
      </div>
    </div>
  );
}
