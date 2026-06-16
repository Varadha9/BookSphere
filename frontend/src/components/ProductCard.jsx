import { useStore } from "../store/useStore";

const CATEGORY_EMOJI = {
  "Technology":  "💻",
  "Fiction":     "📖",
  "Non-Fiction": "🔬",
  "Self-Help":   "🧠",
};

export default function ProductCard({ product, onSelect }) {
  const { state, dispatch } = useStore();
  const wishlisted = state.wishlist.has(product.id);
  const ratingPct = Math.min(100, Math.round((product.rating / 5) * 100));

  function handleView() {
    dispatch({ type: "VIEW_PRODUCT", payload: product });
    onSelect?.(product);
  }

  return (
    <article className="product-card" onClick={handleView}>
      <div className="book-cover">
        <span className="cover-shine" />
        <span className="product-emoji">{CATEGORY_EMOJI[product.category] ?? "📚"}</span>
        <span className="category-chip">{product.category}</span>
      </div>
      <div className="product-copy">
        <h3>{product.name}</h3>
        <p className="author">by {product.author}</p>
        <div className="rating-row">
          <span>★ {product.rating}</span>
          <span className="rating-meter"><i style={{ width: `${ratingPct}%` }} /></span>
        </div>
      </div>
      <div className="price-row">
        <p className="price">₹{product.price.toLocaleString()}</p>
        <span>{product.tags[0]}</span>
      </div>
      <div className="card-actions" onClick={e => e.stopPropagation()}>
        <button onClick={() => dispatch({ type: "TOGGLE_WISHLIST", payload: product.id })}>
          {wishlisted ? "Saved" : "Save"}
        </button>
        <button onClick={() => dispatch({ type: "ADD_TO_CART", payload: { product } })}>
          Add to Cart
        </button>
      </div>
    </article>
  );
}
