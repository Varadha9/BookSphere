# 📚 BookSphere — Smart Online Bookstore

> **Every feature. Every data structure. One real-world bookstore.**

BookSphere is a full-stack online bookstore where every feature is directly powered by a specific data structure. Built as a DSA showcase project — not just a bookstore, but a live demonstration of *why* each data structure is the optimal fit for each real-world problem.

---

## 💡 Core Idea

```
Real Problem  →  Bookstore Feature  →  Best-fit Data Structure  →  Implementation
```

---

## ⚙️ Tech Stack

| Field | Detail |
|-------|--------|
| Language | Java 17+ / JavaScript (React) |
| Build Tool | Maven |
| Frontend | React 18 + Vite |
| Auth & Database | Supabase (PostgreSQL + Auth) |
| Styling | Pure CSS — no UI library |
| State Management | React useReducer + Context |
| DSA Engine | Pure `java.util` (mirrored in JS) |

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/Varadha9/ShopSphere.git
cd ShopSphere

# Frontend setup
cd frontend
npm install

# Add environment variables
cp .env.example .env
# Fill in your Supabase URL and anon key in .env

npm run dev
```

### Environment Variables

Create `frontend/.env` with:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_key_here
```

---

## 🔐 Authentication — Supabase

BookSphere uses **Supabase Auth** for secure user management:

- Email + password signup / login
- Session persistence across page refreshes via `onAuthStateChange`
- Premium member flag stored in `user_metadata`
- Passwords never stored in frontend state — fully handled by Supabase

| Action | Method |
|--------|--------|
| Register | `supabase.auth.signUp()` |
| Login | `supabase.auth.signInWithPassword()` |
| Logout | `supabase.auth.signOut()` |
| Session restore | `supabase.auth.getSession()` |

### Login Page Features
- Field-level inline validation with real-time error clearing
- Password strength meter (Weak → Fair → Good → Strong)
- Show / hide password toggle
- Forgot password flow
- Remember me checkbox
- Quick demo account fill buttons
- Loading spinner on submit
- Auto-focus on mode switch

---

## 🗺️ User Journey

```
Login / Register  (Supabase Auth)
      ↓
Browse Book Catalog + Genres
      ↓
Search Books by Tag / Genre / Author
      ↓
View Recently Seen Books
      ↓
Add to Wishlist
      ↓
Add to Cart  ←→  Remove + Undo
      ↓
Apply Discount Coupons
      ↓
Filter by Price
      ↓
Place Order  →  Standard / Premium Queue
      ↓
Track Delivery Route
      ↓
Get Book Recommendations
```

---

## 🧩 Feature → Data Structure Map

| # | Feature | Data Structure | API |
|---|---------|----------------|-----|
| 1 | Book Catalog | ArrayList | `ArrayList<Book>` |
| 2 | Shopping Cart | ArrayList | `ArrayList<CartItem>` |
| 3 | Undo Remove | Stack | `ArrayDeque<CartItem>` |
| 4 | Order Processing | Queue | `LinkedList<Order>` |
| 5 | Premium Orders | Priority Queue | `PriorityQueue<Order>` |
| 6 | Book Search | HashMap | `HashMap<String, List<Book>>` |
| 7 | Wishlist | HashSet | `HashSet<Book>` |
| 8 | Price Sorting | TreeMap | `TreeMap<Double, List<Book>>` |
| 9 | Genre Categories | Tree | Custom N-ary Tree |
| 10 | Delivery Routes | Graph | `Map<String, List<Edge>>` |
| 11 | Recently Viewed | LinkedList | `LinkedList<Book>` |
| 12 | Discount Engine | Dynamic Programming | `int[n+1][W+1]` |
| 13 | Recommendations | Graph + BFS | `Map<Book, Set<Book>>` |

---

## 🔍 Feature Highlights

### 🔐 Auth — Supabase
Real user accounts with email/password. Sessions persist across refreshes. Premium flag stored in JWT metadata and read back on every login.

### 🔎 Book Search — HashMap
Every book is indexed by its tags (genre, author, topic) at insert time. Searching by keyword returns results in **O(1)** average.

### ↩️ Undo Remove — Stack (ArrayDeque)
Every cart removal is pushed onto a stack. Undo pops and restores the last removed book in **O(1)** — pure LIFO.

### 🏆 Premium Orders — PriorityQueue
Premium members get priority `1`, regular users `10`. The min-heap always surfaces the most important order next — no re-sorting needed.

### 🗂️ Genre Browsing — Custom N-ary Tree
```
Technology → Programming → Algorithms → Systems
Fiction    → Classic → Sci-Fi → Dystopia
Non-Fiction → History → Psychology
Self-Help  → Productivity → Habits
```

### 🚚 Delivery Routes — Graph + Dijkstra
Cities are graph nodes, roads are weighted edges. Dijkstra finds the shortest delivery path in **O((V+E) log V)**.

### 💸 Discount Engine — 0/1 Knapsack DP
The DP table evaluates every combination of coupons and guarantees the maximum possible discount for the cart total.

### 🤝 Recommendations — Graph + BFS
BFS from any book returns all related books within N hops across the co-purchase graph.

---

## 🧠 Algorithm Summary

| Algorithm | Feature | Complexity |
|-----------|---------|------------|
| HashMap Indexing | Book Search | O(1) avg |
| Stack LIFO | Undo Remove | O(1) |
| FIFO Queue | Order Processing | O(1) |
| Min-Heap | Premium Orders, Dijkstra | O(log n) |
| DFS / BFS | Genre Tree | O(n) |
| Dijkstra's | Delivery Routes | O((V+E) log V) |
| BFS on Graph | Recommendations | O(V+E) |
| 0/1 Knapsack DP | Discount Engine | O(n × W) |
| Sliding Window | Recently Viewed | O(1) per view |
| Red-Black Tree | Price Sorting (TreeMap) | O(log n) |

---

## 📁 Project Structure

```
ShopSphere/
├── .gitignore
├── README.md
├── pom.xml
├── frontend/
│   ├── .env.example          ← copy to .env and fill keys
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── lib/
│       │   └── supabase.js   ← Supabase client singleton
│       ├── store/
│       │   └── useStore.jsx  ← global state + DSA logic
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProductCard.jsx
│       │   └── CategoryTree.jsx
│       ├── pages/
│       │   ├── LoginPage.jsx
│       │   ├── CatalogPage.jsx
│       │   ├── CartPage.jsx
│       │   ├── OrdersPage.jsx
│       │   ├── DeliveryPage.jsx
│       │   ├── RecommendationsPage.jsx
│       │   └── UXPage.jsx
│       ├── data/
│       │   └── mockData.js
│       ├── App.jsx
│       └── index.css
└── BOOKSPHERE_DOCS.md
```

---

## 📄 Documentation

Full technical documentation including per-package breakdown, method-level descriptions, data structure decision rationale, and end-to-end data flow trace.

→ See [`BOOKSPHERE_DOCS.md`](./BOOKSPHERE_DOCS.md)

---

*BookSphere — Every bookstore feature backed by the right data structure.*
