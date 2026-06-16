import { useStore } from "../store/useStore";

export default function OrdersPage({ setPage }) {
  const { state, dispatch } = useStore();

  return (
    <div className="page">
      {/* DSA: LinkedList<Order> (FIFO Queue)  →  java.util.LinkedList
           + PriorityQueue<Order> (Min-Heap)  →  java.util.PriorityQueue
           Premium priority=1 always dequeues before standard priority=10 */}
      <h2>📦 Order Queue</h2>

      <div className="queue-info">
        <p>Premium orders (⭐ priority=1) are always processed before regular orders (priority=10).</p>
        <button className="btn-primary" disabled={!state.orders.some(o => o.status === "PENDING")}
          onClick={() => dispatch({ type: "PROCESS_ORDER" })}>
          ▶ Process Next Order
        </button>
      </div>

      {state.orders.length === 0 ? (
        <p className="empty">No orders yet. <span className="link" onClick={() => setPage("Cart")}>Go to cart →</span></p>
      ) : (
        <div className="order-list">
          {state.orders.map((order, i) => (
            <div key={order.orderId} className={`order-card ${order.isPremium ? "premium" : ""}`}>
              <div className="order-header">
                <span>#{i + 1} {order.orderId}</span>
                <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
                {order.isPremium && <span className="premium-badge">⭐ PREMIUM</span>}
              </div>
              <p>Priority: {order.priority} · Total: ₹{order.total.toLocaleString()}</p>
              <div className="order-items">
                {order.items.map(({ product, qty }) => (
                  <span key={product.id} className="order-item-chip">{product.name} ×{qty}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
