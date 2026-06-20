# BookSphere — Smart Online Bookstore
## Complete Technical Documentation

---

## 1. Project Overview

| Field         | Detail                                                                      |
|---------------|-----------------------------------------------------------------------------|
| Project Name  | BookSphere                                                                  |
| Type          | End-to-End Online Bookstore Application                                     |
| Language      | Java + React                                                                |
| Purpose       | Demonstrate every major Data Structure as a real-world bookstore feature    |
| Architecture  | Layered / Package-by-Feature (Monolithic backend, DSA-focused)              |

### Problem Statement

Online bookstores are deceptively complex. At scale, the following problems are non-trivial:

1. **Discovery** — A reader looking for "science fiction" should not have to scroll through 10,000 titles. Books must be indexed at insert time so search is instant.
2. **Organisation** — Books belong to genres and sub-genres. A flat list cannot express that *Dystopia* is a sub-genre of *Fiction*. A hierarchy is needed.
3. **Cart reliability** — A reader who accidentally removes a book from their cart must be able to undo it. The last-removed item must be the first restored — a LIFO problem.
4. **Fair ordering** — Premium members pay for priority. Their orders must always be processed before regular orders, without constantly re-sorting the entire queue.
5. **Smart discounts** — Applying coupons greedily does not always yield the maximum discount. The best combination of `BOOK30`, `BOOK80`, `BOOK150`, `BOOK300` coupons must be computed optimally.
6. **Delivery efficiency** — Books ship from warehouses to cities. The shortest route across a city network must be computed, not estimated.
7. **Personalisation** — "Readers who bought *Clean Code* also bought *The Pragmatic Programmer*" requires a relationship graph, not a list.

BookSphere solves each of these with the exact data structure built for it.

### Core Philosophy
```
Real Bookstore Problem → Feature → Best-fit Data Structure → Java Implementation
```

---

## 2. Application Flow

```
Reader
 │
 ├── Register / Login          → Auth Service (HashMap)
 │
 ├── Browse Book Catalog        → Book Catalog (ArrayList) + Genre Tree (N-ary Tree)
 │
 ├── Search Books               → Book Search (HashMap — tag index)
 │
 ├── View Recently Seen         → Recently Viewed (LinkedList — sliding window)
 │
 ├── Add to Wishlist            → Wishlist (HashSet — no duplicates)
 │
 ├── Add to Cart                → Shopping Cart (ArrayList)
 │
 ├── Remove from Cart           → Cart + Undo Manager (Stack)
 │
 ├── Apply Discount Coupons     → Discount Engine (0/1 Knapsack DP)
 │
 ├── Filter Books by Price      → Price Sorter (TreeMap — range query)
 │
 ├── Place Order                → Order Queue (Queue / PriorityQueue)
 │
 ├── Payment                    → Order finalization
 │
 ├── Get Recommendations        → Recommendation Engine (Graph + BFS)
 │
 └── Track Delivery             → Delivery Graph (Graph + Dijkstra)
```

---

## 3. Project Directory Structure

```
E-commerce/
├── pom.xml
├── frontend/
│   └── src/
│       ├── data/mockData.js         ← 12 books, coupons, graphs, genre tree
│       ├── store/useStore.jsx        ← all DSA logic (HashMap, DP, Dijkstra, BFS)
│       ├── pages/
│       │   ├── CatalogPage.jsx
│       │   ├── CartPage.jsx
│       │   ├── OrdersPage.jsx
│       │   ├── DeliveryPage.jsx
│       │   └── RecommendationsPage.jsx
│       └── components/
│           ├── Navbar.jsx
│           ├── ProductCard.jsx
│           └── CategoryTree.jsx
└── src/main/java/com/shopsphere/
    ├── ShopSphereApp.java
    ├── model/
    │   ├── User.java
    │   ├── Product.java          ← represents a Book
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

## 4. Feature → Data Structure Mapping (Master Table)

| #  | Feature           | Bookstore Problem It Solves                              | Data Structure    | Java Class/API                     | Time Complexity         |
|----|-------------------|----------------------------------------------------------|-------------------|------------------------------------|-------------------------|
| 1  | Book Catalog      | Store and display all books                              | ArrayList         | `ArrayList<Product>`               | Add O(1), Get O(1)      |
| 2  | Shopping Cart     | Hold selected books for current session                  | ArrayList         | `ArrayList<CartItem>`              | Add O(1), Remove O(n)   |
| 3  | Undo Remove       | Restore last accidentally removed book                   | Stack (Deque)     | `ArrayDeque<CartItem>`             | Push/Pop O(1)           |
| 4  | Order Processing  | Process orders in arrival order (FIFO)                   | Queue             | `LinkedList<Order>` as Queue       | Enqueue/Dequeue O(1)    |
| 5  | Premium Orders    | Premium members' orders processed before regular ones    | Priority Queue    | `PriorityQueue<Order>`             | Insert O(log n)         |
| 6  | Book Search       | Instant lookup by genre, author, or topic tag            | HashMap           | `HashMap<String, List<Product>>`   | Search O(1) avg         |
| 7  | Wishlist          | Save books without duplicates                            | HashSet           | `HashSet<Product>`                 | Add/Contains O(1) avg   |
| 8  | Price Sorting     | Sort and filter books by price range                     | TreeMap           | `TreeMap<Double, List<Product>>`   | Insert/Range O(log n)   |
| 9  | Genre Categories  | Hierarchical genre browsing (Fiction → Sci-Fi)           | Tree              | Custom N-ary Tree                  | Traversal O(n)          |
| 10 | Delivery Routes   | Find shortest book delivery path between cities          | Graph             | `Map<String, List<Edge>>`          | Dijkstra O((V+E) log V) |
| 11 | Recently Viewed   | Track last N books a reader viewed                       | LinkedList        | `LinkedList<Product>`              | Add/Remove O(1)         |
| 12 | Discount Engine   | Maximize coupon discount without exceeding cart budget   | Dynamic Prog.     | 2D DP array                        | O(n × capacity)         |
| 13 | Recommendations   | "Readers also bought" suggestions                        | Graph + BFS       | `Map<Product, Set<Product>>`       | BFS O(V+E)              |

---

## 5. Package-by-Package Detailed Breakdown

---

### 5.1 `model/` — Data Layer

Pure POJOs. Zero business logic. All other packages depend on these.

#### `Product.java` — represents a Book
| Field      | Type          | Purpose                                          |
|------------|---------------|--------------------------------------------------|
| productId  | String        | Unique book identifier                           |
| name       | String        | Book title                                       |
| author     | String        | Author name — displayed on book card             |
| price      | double        | Used in TreeMap key and DiscountEngine           |
| category   | String        | Maps to genre in CategoryTree (e.g. "Fiction")   |
| tags       | List<String>  | Genre/topic tags indexed in BookSearch HashMap   |
| rating     | double        | Reader rating — used in RecommendationEngine     |

#### `User.java`
| Field     | Type    | Purpose                                |
|-----------|---------|----------------------------------------|
| userId    | String  | Unique identifier                      |
| name      | String  | Display name                           |
| email     | String  | Login credential / key in AuthService  |
| password  | String  | Hashed password                        |
| isPremium | boolean | Determines order queue priority        |

#### `Order.java`
| Field     | Type           | Purpose                              |
|-----------|----------------|--------------------------------------|
| orderId   | String         | Unique identifier                    |
| userId    | String         | Reader who placed the order          |
| items     | List<CartItem> | Snapshot of cart at checkout         |
| priority  | int            | PriorityQueue comparator field       |
| status    | OrderStatus    | Enum: PENDING, PROCESSING, DELIVERED |
| total     | double         | Final amount after discount          |

#### `CartItem.java`
| Field    | Type    | Purpose                  |
|----------|---------|--------------------------|
| product  | Product | Reference to the book    |
| quantity | int     | Number of copies         |

#### `DeliveryRoute.java`
| Field       | Type   | Purpose                   |
|-------------|--------|---------------------------|
| source      | String | Origin city / warehouse   |
| destination | String | Target city               |
| distance    | double | Edge weight in graph (km) |

---

### 5.2 `auth/` — Authentication

#### `AuthService.java`
- Data Structure: `HashMap<String, User>` (email → User)
- Problem solved: A reader logging in should not trigger a scan of every registered account. HashMap gives O(1) average lookup by email — constant time regardless of how many readers are registered.

| Method             | Description                                       |
|--------------------|---------------------------------------------------|
| register(User)     | Put into map if email not already present         |
| login(email, pass) | O(1) get from map, validate password, return User |
| logout(userId)     | Clear session                                     |
| getUser(email)     | Direct O(1) lookup                                |

---

### 5.3 `catalog/` — Book Browsing

#### `ProductCatalog.java`
- Data Structure: `ArrayList<Product>`
- Problem solved: The bookstore needs a dynamic, ordered list of all books. ArrayList supports O(1) append when new books are added and O(1) indexed access for display — no fixed-size limitation like an array.

| Method                     | Description                               |
|----------------------------|-------------------------------------------|
| addBook(Product)           | Append to list                            |
| removeBook(productId)      | Linear scan + remove                      |
| getAllBooks()               | Return full catalog                       |
| getBooksByGenre(genre)     | Filter stream by category                 |

#### `CategoryTree.java`
- Data Structure: Custom N-ary Tree
- Problem solved: Book genres are inherently hierarchical. Technology → Programming → Algorithms cannot be modelled with a flat list or HashMap. A tree preserves parent-child relationships and enables genre-path breadcrumbs and nested filtering.

```
Root
 ├── Technology
 │    ├── Programming
 │    ├── Algorithms
 │    └── Systems
 ├── Fiction
 │    ├── Classic
 │    ├── Sci-Fi
 │    └── Dystopia
 ├── Non-Fiction
 │    ├── History
 │    ├── Psychology
 │    └── Science
 └── Self-Help
      ├── Productivity
      └── Habits
```

| Method                     | Description                                         |
|----------------------------|-----------------------------------------------------|
| addCategory(parent, child) | Add child genre node under parent                   |
| getChildren(genre)         | Return direct sub-genres                            |
| traverseDFS(node)          | Full tree walk for sitemap / breadcrumb             |
| findCategory(name)         | BFS/DFS search for node by name                     |

---

### 5.4 `cart/` — Shopping Cart & Undo

#### `ShoppingCart.java`
- Data Structure: `ArrayList<CartItem>`
- Problem solved: A reader's cart is a mutable ordered list of books. ArrayList gives fast append and iteration for total calculation. Sequential access patterns perfectly match ArrayList's strengths.

| Method                  | Description                                             |
|-------------------------|---------------------------------------------------------|
| addBook(Product, qty)   | Append CartItem or increment qty if book already in cart|
| removeBook(productId)   | Remove + push to UndoManager stack                      |
| getItems()              | Return current cart contents                            |
| calculateTotal()        | Iterate and sum prices × quantities                     |
| clear()                 | Empty cart after order is placed                        |

#### `UndoManager.java`
- Data Structure: `ArrayDeque<CartItem>` used as Stack
- Problem solved: A reader who removes a book by mistake must be able to restore it. The last-removed book must be the first restored — this is LIFO. A stack is the canonical, O(1) solution.

| Method       | Description                                             |
|--------------|---------------------------------------------------------|
| push(item)   | Called by ShoppingCart.removeBook()                     |
| undo()       | Pop top item, return to ShoppingCart                    |
| canUndo()    | Check if stack is non-empty                             |

Stack state example:
```
Remove "Clean Code"   → Stack: [Clean Code]
Remove "Dune"         → Stack: [Clean Code, Dune]
Undo                  → Dune restored,       Stack: [Clean Code]
Undo                  → Clean Code restored, Stack: []
```

---

### 5.5 `order/` — Order Processing

#### `OrderQueue.java`
- Data Structure: `LinkedList<Order>` implementing `Queue`
- Problem solved: Book orders from regular readers must be dispatched in the order they were placed — first come, first served. FIFO is the only fair model and Queue is its exact implementation.

| Method          | Description                             |
|-----------------|-----------------------------------------|
| enqueue(Order)  | Add order to tail                       |
| dequeue()       | Remove and process from head            |
| peek()          | View next order without removing        |
| isEmpty()       | Check for pending orders                |

#### `PremiumOrderQueue.java`
- Data Structure: `PriorityQueue<Order>`
- Problem solved: Premium members pay for faster delivery. Their orders must jump ahead of regular orders — but constantly re-sorting the full queue on every insert is O(n log n). A min-heap PriorityQueue inserts in O(log n) and always surfaces the highest-priority order at the head.

| Method          | Description                                           |
|-----------------|-------------------------------------------------------|
| enqueue(Order)  | Insert with priority (premium = 1, regular = 10)      |
| dequeue()       | Always returns the highest-priority order             |
| peek()          | View top-priority order without removing              |

Comparator logic:
```
isPremium → priority = 1   (processed first)
isRegular → priority = 10  (processed after all premium)
```

---

### 5.6 `search/` — Book Search

#### `ProductSearch.java`
- Data Structure: `HashMap<String, List<Product>>`
- Problem solved: A reader typing "programming" should not wait for a scan of 10,000 books. By indexing every book's tags into a HashMap at insert time, any keyword lookup is O(1) average — constant time regardless of catalog size.

| Method                   | Description                                    |
|--------------------------|------------------------------------------------|
| indexBook(Product)       | For each tag, add book to map entry            |
| search(keyword)          | Return list mapped to keyword key — O(1)       |
| removeFromIndex(Product) | Remove book from all its tag entries           |

Index example:
```
"programming"  → [The Pragmatic Programmer, Clean Code, CLRS]
"scifi"        → [Dune]
"productivity" → [Atomic Habits, Deep Work]
"classic"      → [1984, The Great Gatsby, The Alchemist]
```

---

### 5.7 `wishlist/` — Wishlist

#### `Wishlist.java`
- Data Structure: `HashSet<Product>`
- Problem solved: A reader's wishlist must never contain the same book twice. HashSet enforces uniqueness automatically and provides O(1) add, remove, and contains — no duplicate checks, no scans.

| Method                | Description                              |
|-----------------------|------------------------------------------|
| addToWishlist(book)   | Add book (duplicate silently ignored)    |
| removeFromWishlist(b) | Remove book                              |
| isWishlisted(book)    | O(1) membership check                   |
| getAll()              | Return all wishlisted books              |

---

### 5.8 `pricing/` — Price Sorting & Discounts

#### `PriceSorter.java`
- Data Structure: `TreeMap<Double, List<Product>>`
- Problem solved: Readers filter books by price range (e.g. ₹200–₹600). A HashMap cannot do range queries. An ArrayList requires a full sort on every filter. TreeMap (a Red-Black Tree internally) keeps all books sorted by price at all times and supports `subMap(min, max)` range queries in O(log n).

| Method                        | Description                                        |
|-------------------------------|----------------------------------------------------|
| addBook(Product)              | Insert at key = book.price                         |
| getInRange(minPrice, maxPrice)| `subMap(min, max)` — O(log n) range query          |
| getCheapest(n)                | First n entries from TreeMap                       |
| getMostExpensive(n)           | Last n entries via `descendingMap()`               |

#### `DiscountEngine.java`
- Data Structure: 2D DP table `int[n+1][W+1]`
- Problem solved: BookSphere offers four coupons — `BOOK30`, `BOOK80`, `BOOK150`, `BOOK300` — each with a minimum spend threshold. Applying the largest coupon greedily does not always yield the maximum discount (e.g. two smaller coupons may combine to beat one large one). This is exactly the 0/1 Knapsack problem. DP guarantees the optimal combination.

Problem modelled as:
```
Items     = available discount coupons
Weight    = minimum spend required per coupon
Value     = discount amount
Capacity  = reader's cart total
Goal      = maximise total discount
```

| Method                           | Description                                  |
|----------------------------------|----------------------------------------------|
| applyBestDiscount(coupons, total)| Run DP, return maximum achievable discount   |
| buildDPTable(coupons, capacity)  | Fill n×W table bottom-up                     |
| traceback(table)                 | Identify which coupons were selected         |

---

### 5.9 `delivery/` — Delivery Route Optimisation

#### `DeliveryGraph.java`
- Data Structure: Adjacency List — `Map<String, List<Edge>>`
- Problem solved: BookSphere ships from warehouses to cities. Each city is a node, each road is a weighted edge (distance in km). Finding the cheapest/fastest delivery path is a shortest-path problem on a weighted graph — solved by Dijkstra's algorithm.

Graph structure:
```
Mumbai ──148──▶ Pune
Mumbai ──166──▶ Nashik
Pune   ──560──▶ Hyderabad
Nashik ──100──▶ Aurangabad
```

| Method                      | Description                                          |
|-----------------------------|------------------------------------------------------|
| addCity(city)               | Add node to graph                                    |
| addRoute(src, dest, dist)   | Add weighted edge between cities                     |
| shortestPath(src, dest)     | Dijkstra's — returns path list + total distance      |
| getAllReachable(src)         | BFS from source — all deliverable cities             |

Dijkstra's uses `PriorityQueue<Node>` internally (min-heap on distance).

---

### 5.10 `history/` — Recently Viewed Books

#### `RecentProducts.java`
- Data Structure: `LinkedList<Product>`
- Problem solved: The reader's "recently viewed" panel shows the last N books they opened, most recent first. New books are added to the front; when the list exceeds N, the oldest book is dropped from the tail. Both operations are O(1) with LinkedList. An ArrayList would require O(n) copy on tail removal.

| Method             | Description                                               |
|--------------------|-----------------------------------------------------------|
| addViewed(book)    | addFirst(); if size > MAX (10), removeLast()              |
| getRecent()        | Return list in view order (most recent first)             |
| clear()            | Reset on logout                                           |

State example (MAX = 3):
```
View Dune          → [Dune]
View 1984          → [1984, Dune]
View Sapiens       → [Sapiens, 1984, Dune]
View Atomic Habits → [Atomic Habits, Sapiens, 1984]  ← Dune dropped
```

---

### 5.11 `recommendation/` — Book Recommendations

#### `RecommendationEngine.java`
- Data Structure: Undirected Graph — `Map<Product, Set<Product>>`
- Problem solved: "Readers who bought *Clean Code* also bought *The Pragmatic Programmer*" is a co-purchase relationship — a graph edge between two books. To suggest books within N degrees of separation, BFS from the source book traverses the graph level by level.

| Method                          | Description                                             |
|---------------------------------|---------------------------------------------------------|
| addRelation(bookA, bookB)       | Add undirected edge A ↔ B                               |
| getRecommendations(book, depth) | BFS up to given depth, return all discovered books      |
| buildFromOrderHistory(orders)   | Auto-build graph from co-occurrence in past orders      |

BFS traversal (depth = 2):
```
Clean Code → [Pragmatic Programmer, CLRS, Designing Data-Intensive Apps]
Pragmatic Programmer → [CLRS]

Recommend for Clean Code (depth 2) = [Pragmatic Programmer, CLRS, Designing Data-Intensive Apps]
```

---

## 6. Data Flow: End-to-End Trace

### Scenario: Reader searches, adds books to cart, applies discount, places order

```
1. login("reader@email.com", "pass")
      AuthService.HashMap → O(1) lookup → returns User

2. search("programming")
      BookSearch.HashMap → O(1) key lookup
      → returns [The Pragmatic Programmer, Clean Code, CLRS]

3. viewBook(Clean Code)
      RecentProducts.LinkedList → addFirst(Clean Code)

4. addToCart(Clean Code, qty=1)
      ShoppingCart.ArrayList → append CartItem

5. removeFromCart(Clean Code)
      ShoppingCart.ArrayList → remove
      UndoManager.Stack → push(Clean Code)

6. undo()
      UndoManager.Stack → pop() → Clean Code
      ShoppingCart.ArrayList → re-add Clean Code

7. filterByPrice(200, 600)
      PriceSorter.TreeMap → subMap(200.0, 600.0) → O(log n)

8. applyDiscount(coupons, cartTotal)
      DiscountEngine.DP (0/1 Knapsack) → returns optimal coupon combo

9. placeOrder(cart)
      if user.isPremium → PremiumOrderQueue.PriorityQueue.enqueue(order, priority=1)
      else             → OrderQueue.Queue.enqueue(order, priority=10)

10. processNextOrder()
       PriorityQueue / Queue → dequeue() → dispatch

11. findDeliveryRoute("Mumbai", "Bangalore")
       DeliveryGraph.Dijkstra → shortest path + total km

12. getRecommendations(Clean Code, depth=2)
       RecommendationEngine.Graph.BFS
       → [The Pragmatic Programmer, CLRS, Designing Data-Intensive Apps]
```

---

## 7. Data Structure Decision Rationale

| Feature              | Why NOT other structures                                                              |
|----------------------|---------------------------------------------------------------------------------------|
| Catalog (ArrayList)  | LinkedList is slower for indexed access; plain array is fixed-size                    |
| Cart (ArrayList)     | Same as above — ordered, dynamic, index-accessible                                    |
| Undo (Stack)         | Queue gives wrong order (FIFO); List requires manual index tracking                   |
| Order (Queue)        | Stack reverses arrival order; ArrayList requires manual head tracking                 |
| Premium (PQ)         | Regular Queue ignores priority; sorting entire queue on every insert is O(n log n)    |
| Search (HashMap)     | ArrayList search is O(n); TreeMap is O(log n); HashMap is O(1) avg                   |
| Wishlist (HashSet)   | List allows duplicates and O(n) contains; HashSet is O(1) and enforces uniqueness     |
| Price (TreeMap)      | HashMap has no range query support; ArrayList needs full sort on every filter         |
| Genre (Tree)         | Flat list loses parent-child hierarchy; HashMap cannot express nested genre paths     |
| Delivery (Graph)     | Tree cannot model cycles between cities; adjacency matrix wastes memory               |
| Recent (LinkedList)  | ArrayList tail removal is O(n); LinkedList is O(1) at both ends                      |
| Discount (DP)        | Greedy does not guarantee optimal coupon combination in all cases                     |
| Recommend (Graph)    | Simple list has no relationship model; HashMap only expresses 1-level relations       |

---

## 8. Java API Reference

| Data Structure  | Java Class/Interface Used              | Package                    |
|-----------------|----------------------------------------|----------------------------|
| ArrayList       | `java.util.ArrayList`                  | `java.util`                |
| Stack/Deque     | `java.util.ArrayDeque`                 | `java.util`                |
| Queue           | `java.util.LinkedList` + `Queue<E>`    | `java.util`                |
| Priority Queue  | `java.util.PriorityQueue`              | `java.util`                |
| HashMap         | `java.util.HashMap`                    | `java.util`                |
| HashSet         | `java.util.HashSet`                    | `java.util`                |
| TreeMap         | `java.util.TreeMap`                    | `java.util`                |
| LinkedList      | `java.util.LinkedList`                 | `java.util`                |
| Custom Tree     | Manual `CategoryNode` class            | `com.shopsphere.catalog`   |
| Graph           | `java.util.HashMap` + `java.util.List` | `com.shopsphere.delivery`  |
| DP Table        | Primitive `int[][]`                    | `com.shopsphere.pricing`   |

---

## 9. Package Dependencies

```
model/          ← no dependencies (base layer)
auth/           ← depends on model/User
catalog/        ← depends on model/Product (Book)
search/         ← depends on model/Product (Book)
wishlist/       ← depends on model/Product (Book)
history/        ← depends on model/Product (Book)
cart/           ← depends on model/Product, model/CartItem
pricing/        ← depends on model/Product, model/CartItem
order/          ← depends on model/Order, model/CartItem
delivery/       ← depends on model/DeliveryRoute
recommendation/ ← depends on model/Product (Book)
ShopSphereApp   ← orchestrates all packages
```

---

## 10. Algorithm Summary

| Algorithm          | Where Used               | Complexity           |
|--------------------|--------------------------|----------------------|
| HashMap Indexing   | Book Search              | O(1) avg insert/get  |
| Stack LIFO         | Undo Manager             | O(1) push/pop        |
| FIFO Queue         | Order Queue              | O(1) enqueue/dequeue |
| Min-Heap           | Premium Orders, Dijkstra | O(log n)             |
| DFS/BFS on Tree    | Genre Category Tree      | O(n)                 |
| Dijkstra's         | Delivery Graph           | O((V+E) log V)       |
| BFS on Graph       | Recommendation Engine    | O(V+E)               |
| 0/1 Knapsack DP    | Discount Engine          | O(n × W)             |
| Sliding Window LL  | Recently Viewed Books    | O(1) per view        |
| Red-Black Tree Ops | Price Sorter (TreeMap)   | O(log n)             |

---

*BookSphere — Every bookstore feature backed by the right data structure.*
