# 📚 BookSphere — Smart Online Bookstore

> **Every feature. Every data structure. One real-world bookstore.**

BookSphere is a Java-based end-to-end online bookstore where every feature is directly powered by a specific data structure. Built as a DSA showcase project — not just a bookstore, but a live demonstration of *why* each data structure is the optimal fit for each real-world problem.

---

## 💡 Core Idea

```
Real Problem  →  Bookstore Feature  →  Best-fit Data Structure  →  Java Implementation
```

---

## 📖 Problem Statement

Online bookstores deal with a unique set of challenges:

- A catalog of **thousands of books** across genres, authors, and price points that must be browsed, filtered, and searched instantly
- Readers want to **search by genre, author, or topic** — not scroll through hundreds of titles
- A **wishlist** where the same book should never appear twice
- A **shopping cart** where accidental removals must be undoable
- **Coupon discounts** where the best combination of offers must be computed, not guessed
- **Premium members** who expect their orders to always be processed before regular ones
- A **delivery network** spanning cities where the shortest shipping route must be computed
- **"Readers also bought"** recommendations that surface related books across genres

Each of these is a real algorithmic problem. BookSphere solves every one of them with the exact data structure built for it.

---

## 🗺️ User Journey

```
Login / Register
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
Payment
      ↓
Track Delivery Route
      ↓
Get Book Recommendations
```

---

## 🎨 UX/UI Design Considerations

### Identify UI Elements

BookSphere's interface is organized around the core elements readers expect in an online bookstore:

- **Authentication screens** for login and registration
- **Book catalog grid** with book title, author, genre, price, and action buttons
- **Search bar and filters** for genre, author, tag, and price range
- **Book detail view** for deeper information before adding a book to cart or wishlist
- **Wishlist control** to save books without duplicates
- **Shopping cart panel** with quantity, remove, undo, coupon, and checkout actions
- **Order status and delivery route view** for payment, queue status, and shipment tracking
- **Recommendation section** for related books based on reader behavior

### User Interaction Flow

The interaction flow is designed to move users from discovery to purchase with minimal friction:

1. The user logs in or registers.
2. The user browses genres or searches by keyword.
3. The user opens a book, compares price and details, then adds it to wishlist or cart.
4. The user reviews the cart, removes items if needed, and can undo accidental removals.
5. The user applies the best available discount coupon.
6. The user places an order, with premium users handled through priority processing.
7. The user tracks the shortest delivery route and receives recommendations for future purchases.

### Usability Issues

Potential usability risks in an online bookstore include:

- Users may struggle to find books if search, genre filters, and price sorting are not clearly visible.
- A cart removal without undo can cause frustration and lost purchase intent.
- Coupon selection can feel confusing if the best discount is not explained clearly.
- Premium order priority may feel invisible unless the interface communicates queue status.
- Delivery tracking can become hard to understand if route information is shown only as raw city names.
- Recommendations may feel random if they are not visually connected to the current book or purchase history.

### UX Improvements

BookSphere improves the experience by connecting data-structure behavior to user-facing design:

- HashMap-powered search supports fast keyword lookup.
- Tree-based genre browsing gives users a clear category hierarchy.
- Stack-based undo protects users from accidental cart removals.
- TreeMap price sorting makes low-to-high and high-to-low browsing predictable.
- Dynamic programming selects the best coupon combination automatically.
- PriorityQueue order processing gives premium users a visible service advantage.
- Graph-based delivery tracking can display shortest-route progress in a readable way.
- BFS recommendations help users discover related books without manually searching again.

### UX/UI Principles

The interface follows these core principles:

- **Clarity:** Each screen should show one primary action, such as search, add to cart, apply coupon, or place order.
- **Consistency:** Buttons, filters, book cards, and checkout controls should behave the same across the app.
- **Feedback:** Users should immediately see confirmation after adding, removing, undoing, applying coupons, or placing orders.
- **Error prevention:** Wishlist duplicates are blocked, cart removals are undoable, and coupon logic is automated.
- **Efficiency:** Search indexes, sorted maps, queues, and graphs reduce waiting time during common user tasks.
- **Accessibility:** Important controls should be keyboard-friendly, readable, and clearly labeled.

### Overcoming Usability Challenges

BookSphere addresses common bookstore usability challenges by pairing interface decisions with the right backend structures:

| Challenge | UX Response | Data Structure Support |
|-----------|-------------|------------------------|
| Too many books to browse manually | Search, filters, and genre navigation | HashMap, Tree, TreeMap |
| Accidental cart removal | Undo remove action | Stack |
| Duplicate wishlist items | Prevent repeated saved books | HashSet |
| Confusing coupon choices | Auto-calculate best discount | Dynamic Programming |
| Mixed regular and premium orders | Show priority-based processing | Queue, PriorityQueue |
| Complex delivery routes | Display shortest delivery path | Graph + Dijkstra |
| Weak product discovery | Show related book suggestions | Graph + BFS |

### Information Organization

Information is grouped by the reader's decision-making process:

- **Discovery:** Catalog, genres, search, filters, and recommendations
- **Evaluation:** Book details, author, genre, price, and related titles
- **Decision:** Wishlist, cart, quantity, coupon, and checkout
- **Fulfillment:** Order queue, payment, delivery route, and tracking
- **Retention:** Recently viewed books and personalized recommendations

This keeps the interface aligned with how users naturally shop: find a book, evaluate it, commit to buying it, track it, and discover what to read next.

---

## 🧩 Feature → Data Structure Map

| # | Feature | Data Structure | Java API |
|---|---------|---------------|----------|
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

## 📁 Project Structure

```
E-commerce/
├── pom.xml
├── frontend/               ← React + Vite UI
└── src/main/java/com/shopsphere/
    ├── ShopSphereApp.java
    ├── model/
    │   ├── User.java
    │   ├── Product.java    ← Book model
    │   ├── Order.java
    │   ├── CartItem.java
    │   └── DeliveryRoute.java
    ├── auth/           → AuthService.java
    ├── catalog/        → ProductCatalog.java, CategoryTree.java
    ├── cart/           → ShoppingCart.java, UndoManager.java
    ├── order/          → OrderQueue.java, PremiumOrderQueue.java
    ├── search/         → ProductSearch.java
    ├── wishlist/       → Wishlist.java
    ├── pricing/        → PriceSorter.java, DiscountEngine.java
    ├── delivery/       → DeliveryGraph.java
    ├── history/        → RecentProducts.java
    └── recommendation/ → RecommendationEngine.java
```

---

## ⚙️ Tech Stack

| Field | Detail |
|-------|--------|
| Language | Java 17+ |
| Build Tool | Maven |
| Frontend | React + Vite |
| Dependencies | None — pure `java.util` only |
| Testing | JUnit 5 (optional) |

---

## 🔍 Feature Highlights

### 🔎 Book Search — HashMap
Every book is indexed by its tags (genre, author, topic) at insert time. Searching by keyword returns results in **O(1)** average — no scanning through the entire catalog.

### ↩️ Undo Remove — Stack (ArrayDeque)
Every cart removal is pushed onto a stack. Undo pops and restores the last removed book in **O(1)** — pure LIFO. Readers never lose a book by accident.

### 🏆 Premium Orders — PriorityQueue
Premium members get a priority value of `1`, regular users `10`. The min-heap always surfaces the most important order next — without re-sorting the entire queue.

### 🗂️ Genre Browsing — Custom N-ary Tree
```
Technology → Programming
           → Algorithms
           → Systems
Fiction    → Classic
           → Sci-Fi
           → Dystopia
Non-Fiction → History
            → Psychology
Self-Help  → Productivity
           → Habits
```
Tree traversal powers genre filters, breadcrumbs, and sitemap generation.

### 🚚 Delivery Routes — Graph + Dijkstra
Cities and warehouses are graph nodes, roads are weighted edges. Dijkstra's algorithm finds the shortest book delivery path in **O((V+E) log V)**.

### 💸 Discount Engine — 0/1 Knapsack DP
Greedy fails when coupon combinations matter. The DP table evaluates every combination of `BOOK30`, `BOOK80`, `BOOK150`, `BOOK300` coupons and guarantees the maximum possible discount for the cart total.

### 🤝 Recommendations — Graph + BFS
"Readers who bought Clean Code also bought The Pragmatic Programmer" is an edge. BFS from any book returns all related books within N hops across the co-purchase graph.

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

## 🚀 Getting Started

```bash
# Clone the repo
git clone <repo-url>
cd E-commerce

# Run backend
mvn clean install
mvn exec:java -Dexec.mainClass="com.shopsphere.ShopSphereApp"

# Run frontend
cd frontend
npm install
npm run dev
```

---

## 📄 Documentation

Full technical documentation including:
- Detailed per-package breakdown
- Method-level descriptions
- Data structure decision rationale
- End-to-end data flow trace
- Java API reference

→ See [`BOOKSPHERE_DOCS.md`](./BOOKSPHERE_DOCS.md)

---

## 📦 Package Dependency Order

```
model  →  auth, catalog, search, wishlist, history
       →  cart  →  pricing  →  order
       →  delivery
       →  recommendation
       →  ShopSphereApp (orchestrator)
```

---

*BookSphere — Every bookstore feature backed by the right data structure.*
