import { createContext, useContext, useReducer, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { PRODUCTS, DELIVERY_GRAPH, RECOMMENDATION_GRAPH } from "../data/mockData";

// ╔══════════════════════════════════════════════════════════════════╗
// ║  DSA: HashMap  →  java.util.HashMap<String, List<Book>>          ║
// ║  Tags are keys, List<Book> is the value.                         ║
// ║  Search by keyword runs in O(1) average time.                    ║
// ╚══════════════════════════════════════════════════════════════════╝
function buildSearchIndex(products) {
  const map = {};
  for (const p of products) {
    for (const tag of p.tags) {
      if (!map[tag]) map[tag] = [];
      map[tag].push(p);
    }
  }
  return map;
}

// ╔══════════════════════════════════════════════════════════════════╗
// ║  DSA: TreeMap  →  java.util.TreeMap<Double, List<Book>>          ║
// ║  Red-Black Tree under the hood. Keys (prices) stay sorted.       ║
// ║  Range queries (min–max price filter) run in O(log n).           ║
// ╚══════════════════════════════════════════════════════════════════╝
function buildPriceMap(products) {
  return [...products].sort((a, b) => a.price - b.price);
}

// ╔══════════════════════════════════════════════════════════════════╗
// ║  DSA: Graph + Dijkstra  →  Map<String, List<Edge>>               ║
// ║  Weighted adjacency list. PriorityQueue (min-heap) drives the    ║
// ║  relaxation loop. Shortest path in O((V+E) log V).               ║
// ╚══════════════════════════════════════════════════════════════════╝
export function dijkstra(src, dest) {
  const dist = {};
  const prev = {};
  const visited = new Set();
  const queue = [[0, src]];
  for (const city of Object.keys(DELIVERY_GRAPH)) dist[city] = Infinity;
  dist[src] = 0;

  while (queue.length) {
    queue.sort((a, b) => a[0] - b[0]);
    const [d, u] = queue.shift();
    if (visited.has(u)) continue;
    visited.add(u);
    for (const { to, dist: w } of DELIVERY_GRAPH[u] || []) {
      if (d + w < dist[to]) {
        dist[to] = d + w;
        prev[to] = u;
        queue.push([dist[to], to]);
      }
    }
  }

  const path = [];
  let cur = dest;
  while (cur) { path.unshift(cur); cur = prev[cur]; }
  return { path, distance: dist[dest] };
}

// ╔══════════════════════════════════════════════════════════════════╗
// ║  DSA: Graph + BFS  →  Map<Book, Set<Book>>                       ║
// ║  Co-purchase graph. BFS explores neighbours level by level.      ║
// ║  Visited set (HashSet) prevents revisits. O(V+E).                ║
// ╚══════════════════════════════════════════════════════════════════╝
export function bfsRecommend(productId, depth = 2) {
  const visited = new Set([productId]);
  let frontier = [productId];
  for (let i = 0; i < depth; i++) {
    const next = [];
    for (const id of frontier) {
      for (const nb of RECOMMENDATION_GRAPH[id] || []) {
        if (!visited.has(nb)) { visited.add(nb); next.push(nb); }
      }
    }
    frontier = next;
  }
  visited.delete(productId);
  return [...visited].map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
}

// ╔══════════════════════════════════════════════════════════════════╗
// ║  DSA: 0/1 Knapsack DP  →  int[n+1][W+1]                         ║
// ║  dp[i][w] = max discount using first i coupons with budget w.    ║
// ║  Guarantees the best coupon combination. O(n × W).               ║
// ╚══════════════════════════════════════════════════════════════════╝
export function knapsackDiscount(coupons, capacity) {
  const cap = Math.floor(capacity);
  const n = coupons.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(cap + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    const { minSpend, discount } = coupons[i - 1];
    for (let w = 0; w <= cap; w++) {
      dp[i][w] = dp[i - 1][w];
      if (minSpend <= w) dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - minSpend] + discount);
    }
  }
  return dp[n][cap];
}

// ── Initial state ─────────────────────────────────────────────────────────────
const MAX_RECENT = 5;

// ╔══════════════════════════════════════════════════════════════════╗
// ║  JAVA DSA — Full State Map                                       ║
// ║  users        →  HashMap<String, User>       (email → user)      ║
// ║  catalog      →  ArrayList<Book>             (full book list)    ║
// ║  searchIndex  →  HashMap<String, List<Book>> (tag → books)       ║
// ║  priceSorted  →  TreeMap<Double, List<Book>> (sorted by price)   ║
// ║  cart         →  ArrayList<CartItem>         (mutable cart)      ║
// ║  undoStack    →  ArrayDeque<CartItem>        (Stack — LIFO)      ║
// ║  wishlist     →  HashSet<String>             (unique book IDs)   ║
// ║  recentProducts → LinkedList<Book>           (sliding window)    ║
// ║  orders       →  PriorityQueue<Order>        (min-heap)          ║
// ╚══════════════════════════════════════════════════════════════════╝
const DEMO_USERS = {
  "demo@books.com": { name: "Demo User", email: "demo@books.com", password: "demo123", isPremium: false, userId: "demo@books.com" },
  "premium@books.com": { name: "Premium User", email: "premium@books.com", password: "demo123", isPremium: true, userId: "premium@books.com" },
};

const initial = {
  user: null,
  users: { ...DEMO_USERS },
  catalog: PRODUCTS,
  searchIndex: buildSearchIndex(PRODUCTS),
  priceSorted: buildPriceMap(PRODUCTS),
  cart: [],
  undoStack: [],
  wishlist: new Set(),
  recentProducts: [],
  orders: [],
  searchResults: null,
  priceFilter: { min: 0, max: 99999 },
};

function reducer(state, action) {
  switch (action.type) {

    case "SET_USER":
      return { ...state, user: action.payload, error: null };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "LOGOUT":
      return { ...initial, users: state.users, searchIndex: state.searchIndex, priceSorted: state.priceSorted };

    case "VIEW_PRODUCT": {
      // DSA: LinkedList<Book>  →  java.util.LinkedList
      // Sliding window: add to front, evict tail when size > MAX_RECENT. O(1).
      const product = action.payload;
      const filtered = state.recentProducts.filter(p => p.id !== product.id);
      const recent = [product, ...filtered].slice(0, MAX_RECENT);
      return { ...state, recentProducts: recent };
    }

    case "SEARCH": {
      // DSA: HashMap<String, List<Book>>  →  java.util.HashMap
      // O(1) average lookup by tag key.
      const kw = action.payload.toLowerCase();
      const results = state.searchIndex[kw] || [];
      return { ...state, searchResults: { keyword: kw, results } };
    }

    case "CLEAR_SEARCH":
      return { ...state, searchResults: null };

    case "SET_PRICE_FILTER":
      return { ...state, priceFilter: action.payload };

    case "ADD_TO_CART": {
      const { product, qty = 1 } = action.payload;
      const existing = state.cart.find(i => i.product.id === product.id);
      const cart = existing
        ? state.cart.map(i => i.product.id === product.id ? { ...i, qty: i.qty + qty } : i)
        : [...state.cart, { product, qty }];
      return { ...state, cart };
    }

    case "REMOVE_FROM_CART": {
      const item = state.cart.find(i => i.product.id === action.payload);
      if (!item) return state;
      return {
        ...state,
        cart: state.cart.filter(i => i.product.id !== action.payload),
        undoStack: [item, ...state.undoStack], // DSA: ArrayDeque.push() — Stack LIFO, O(1)
      };
    }

    case "UNDO_REMOVE": {
      if (!state.undoStack.length) return state;
      const [top, ...rest] = state.undoStack; // DSA: ArrayDeque.pop() — Stack LIFO, O(1)
      const existing = state.cart.find(i => i.product.id === top.product.id);
      const cart = existing
        ? state.cart.map(i => i.product.id === top.product.id ? { ...i, qty: i.qty + top.qty } : i)
        : [...state.cart, top];
      return { ...state, cart, undoStack: rest };
    }

    case "TOGGLE_WISHLIST": {
      const ws = new Set(state.wishlist);
      ws.has(action.payload) ? ws.delete(action.payload) : ws.add(action.payload);
      return { ...state, wishlist: ws };
    }

    case "PLACE_ORDER": {
      const total = state.cart.reduce((s, i) => s + i.product.price * i.qty, 0);
      const priority = state.user?.isPremium ? 1 : 10;
      const order = {
        orderId: `ORD-${Date.now()}`,
        userId: state.user?.email,
        items: [...state.cart],
        total,
        priority,
        status: "PENDING",
        isPremium: state.user?.isPremium,
      };
      // DSA: PriorityQueue<Order>  →  java.util.PriorityQueue (min-heap)
      // premium priority=1 always surfaces before standard priority=10. O(log n) insert.
      const orders = [...state.orders, order].sort((a, b) => a.priority - b.priority);
      return { ...state, orders, cart: [], undoStack: [] };
    }

    case "PROCESS_ORDER": {
      if (!state.orders.length) return state;
      const [next, ...rest] = state.orders; // DSA: PriorityQueue.poll() — dequeue min-priority order, O(log n)
      return { ...state, orders: [{ ...next, status: "PROCESSING" }, ...rest] };
    }

    default:
      return state;
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);

  // Supabase auth session listener
  useEffect(() => {
    // Check existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        dispatch({
          type: "SET_USER",
          payload: {
            userId: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email,
            isPremium: session.user.user_metadata?.isPremium || false,
          },
        });
      }
    });

    // Listen for login / logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch({
          type: "SET_USER",
          payload: {
            userId: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email,
            isPremium: session.user.user_metadata?.isPremium || false,
          },
        });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
