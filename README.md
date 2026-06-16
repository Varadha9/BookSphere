# 🛒 ShopSphere — Smart E-Commerce Platform

> **Every feature. Every data structure. One real-world app.**

ShopSphere is a Java-based end-to-end e-commerce platform where every product feature is directly powered by a specific data structure. Built as a DSA showcase project — not just a shopping app, but a live demonstration of *why* each data structure is the optimal fit for each real-world problem.

---

## 💡 Core Idea

```
Real Problem  →  Product Feature  →  Best-fit Data Structure  →  Java Implementation
```

---

## 🗺️ User Journey

```
Login / Register
      ↓
Browse Catalog + Categories
      ↓
Search Products
      ↓
View Recently Seen
      ↓
Add to Wishlist
      ↓
Add to Cart  ←→  Remove + Undo
      ↓
Apply Discount
      ↓
Filter by Price
      ↓
Place Order  →  Standard / Premium Queue
      ↓
Payment
      ↓
Track Delivery Route
      ↓
Get Recommendations
```

---

## 🧩 Feature → Data Structure Map

| # | Feature | Data Structure | Java API |
|---|---------|---------------|----------|
| 1 | Product Catalog | ArrayList | `ArrayList<Product>` |
| 2 | Shopping Cart | ArrayList | `ArrayList<CartItem>` |
| 3 | Undo Remove | Stack | `ArrayDeque<CartItem>` |
| 4 | Order Processing | Queue | `LinkedList<Order>` |
| 5 | Premium Orders | Priority Queue | `PriorityQueue<Order>` |
| 6 | Product Search | HashMap | `HashMap<String, List<Product>>` |
| 7 | Wishlist | HashSet | `HashSet<Product>` |
| 8 | Price Sorting | TreeMap | `TreeMap<Double, List<Product>>` |
| 9 | Product Categories | Tree | Custom N-ary Tree |
| 10 | Delivery Routes | Graph | `Map<String, List<Edge>>` |
| 11 | Recent Products | LinkedList | `LinkedList<Product>` |
| 12 | Discount Engine | Dynamic Programming | `int[n+1][W+1]` |
| 13 | Recommendations | Graph + BFS | `Map<Product, Set<Product>>` |

---

## 📁 Project Structure

```
E-commerce/
├── pom.xml
└── src/main/java/com/shopsphere/
    ├── ShopSphereApp.java
    ├── model/
    │   ├── User.java
    │   ├── Product.java
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
| Dependencies | None — pure `java.util` only |
| Testing | JUnit 5 (optional) |

---

## 🔍 Feature Highlights

### 🔎 Product Search — HashMap
Index every product by its tags at insert time. Search by keyword in **O(1)** average regardless of catalog size.

### ↩️ Undo Remove — Stack (ArrayDeque)
Every cart removal is pushed onto a stack. Undo pops and restores the last removed item in **O(1)** — pure LIFO.

### 🏆 Premium Orders — PriorityQueue
Premium users get a priority value of `1`, regular users `10`. The min-heap always surfaces the most important order next, without re-sorting.

### 🗂️ Category Browsing — Custom N-ary Tree
```
Electronics → Mobiles → Android
                      → iOS
           → Laptops
Clothing   → Men
           → Women
```
Tree traversal powers breadcrumbs, filters, and sitemap generation.

### 🚚 Delivery Routes — Graph + Dijkstra
Cities/warehouses are nodes, roads are weighted edges. Dijkstra's algorithm finds the shortest delivery path in **O((V+E) log V)**.

### 💸 Discount Engine — 0/1 Knapsack DP
Greedy fails when coupon combinations matter. The DP table evaluates every combination and guarantees the maximum possible discount for the cart total.

### 🤝 Recommendations — Graph + BFS
"Users who bought A also bought B" is an edge. BFS from any product returns all related products within N hops.

---

## 🧠 Algorithm Summary

| Algorithm | Feature | Complexity |
|-----------|---------|------------|
| HashMap Indexing | Product Search | O(1) avg |
| Stack LIFO | Undo Remove | O(1) |
| FIFO Queue | Order Processing | O(1) |
| Min-Heap | Premium Orders, Dijkstra | O(log n) |
| DFS / BFS | Category Tree | O(n) |
| Dijkstra's | Delivery Routes | O((V+E) log V) |
| BFS on Graph | Recommendations | O(V+E) |
| 0/1 Knapsack DP | Discount Engine | O(n × W) |
| Sliding Window | Recent Products | O(1) per view |
| Red-Black Tree | Price Sorting (TreeMap) | O(log n) |

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone <repo-url>
cd E-commerce

# Build
mvn clean install

# Run
mvn exec:java -Dexec.mainClass="com.shopsphere.ShopSphereApp"
```

---

## 📄 Documentation

Full technical documentation including:
- Detailed per-package breakdown
- Method-level descriptions
- Data structure decision rationale
- End-to-end data flow trace
- Java API reference

→ See [`SHOPSPHERE_DOCS.md`](./SHOPSPHERE_DOCS.md)

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

*ShopSphere — Every feature backed by the right data structure.*
