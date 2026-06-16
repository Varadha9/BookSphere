import { useState } from "react";
import { useStore, knapsackDiscount } from "../store/useStore";
import { COUPONS } from "../data/mockData";

export default function CartPage({ setPage }) {
  const { state, dispatch } = useStore();
  const [discountResult, setDiscountResult] = useState(null);

  const total = state.cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  function applyDiscount() {
    const best = knapsackDiscount(COUPONS, total);
    setDiscountResult(best);
  }

  function placeOrder() {
    if (!state.cart.length) return;
    dispatch({ type: "PLACE_ORDER" });
    setDiscountResult(null);
    setPage("Orders");
  }

  return (
    <div className="page">
      {/* DSA: ArrayList<CartItem>  →  java.util.ArrayList — cart items stored in order, O(1) index access */}
      <h2>📚 Book Cart</h2>

      {state.cart.length === 0 ? (
        <p className="empty">Your cart is empty. <span className="link" onClick={() => setPage("Catalog")}>Browse books →</span></p>
      ) : (
        <>
          <table className="cart-table">
            <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr></thead>
            <tbody>
              {state.cart.map(({ product, qty }) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>₹{product.price.toLocaleString()}</td>
                  <td>
                    <button className="btn-xs" onClick={() => dispatch({ type: "ADD_TO_CART", payload: { product, qty: -1 } })} disabled={qty <= 1}>−</button>
                    {qty}
                    <button className="btn-xs" onClick={() => dispatch({ type: "ADD_TO_CART", payload: { product } })}>+</button>
                  </td>
                  <td>₹{(product.price * qty).toLocaleString()}</td>
                  <td>
                    <button className="btn-danger" onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: product.id })}>
                      🗑 Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-footer">
            <div className="undo-section">
              {/* DSA: ArrayDeque<CartItem> as Stack  →  java.util.ArrayDeque — LIFO pop/push in O(1) */}
              <button disabled={!state.undoStack.length} onClick={() => dispatch({ type: "UNDO_REMOVE" })}>
                ↩ Undo Remove {state.undoStack.length > 0 ? `(${state.undoStack[0].product.name})` : ""}
              </button>
            </div>

            <div className="discount-section">
              {/* DSA: 0/1 Knapsack DP  →  int[n+1][W+1] table — best coupon combo guaranteed in O(n×W) */}
              <button onClick={applyDiscount}>💸 Apply Best Discount</button>
              {discountResult !== null && (
                <p className="discount-result">
                  Best discount: <strong>₹{discountResult}</strong> off on ₹{total.toLocaleString()} cart
                </p>
              )}
            </div>

            <div className="total-section">
              <p>Subtotal: <strong>₹{total.toLocaleString()}</strong></p>
              {discountResult > 0 && <p>After discount: <strong>₹{(total - discountResult).toLocaleString()}</strong></p>}
              <button className="btn-primary" onClick={placeOrder}>
                Place Order {state.user?.isPremium ? "(⭐ Premium Priority)" : "(Standard)"}
              </button>
            </div>
          </div>
        </>
      )}

      <div className="coupons-info">
        <h4>Available Coupons:</h4>
        <div className="coupon-list">
          {COUPONS.map(c => (
            <span key={c.id} className="coupon-chip">
              {c.label}: ₹{c.discount} off on ₹{c.minSpend}+
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
