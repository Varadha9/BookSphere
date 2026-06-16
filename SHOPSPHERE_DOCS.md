# ShopSphere — Smart E-Commerce Platform
## Complete Technical Documentation

---

## 1. Project Overview

| Field         | Detail                                                                 |
|---------------|------------------------------------------------------------------------|
| Project Name  | ShopSphere                                                             |
| Type          | End-to-End E-Commerce Application                                      |
| Language      | Java                                                                   |
| Purpose       | Demonstrate every major Data Structure as a real-world product feature |
| Architecture  | Layered / Package-by-Feature (Monolithic, DSA-focused)                 |

### Objective
Build a fully functional e-commerce platform where every core feature is directly powered by a specific data structure. The goal is not just to write a shopping app — it is to show *why* each data structure is the natural, optimal fit for each real-world problem it solves.

### Core Philosophy
```
Real Problem → Product Feature → Best-fit Data Structure → Java Implementation
```

---

## 2. Application Flow

The entire user journey follows this linear pipeline:

```
User
 │
 ├── Register / Login         → Auth Service
 │
 ├── Browse Catalog           → Product Catalog + Category Tree
 │
 ├── Search Products          → Product Search (HashMap)
 │
 ├── View Recently Seen       → Recent Products (LinkedList)
 │
 ├── Add to Wishlist          → Wishlist (HashSet)
 │
 ├── Add to Cart              → Shopping Cart (ArrayList)
 │
 ├── Remove from Cart         → Cart + Undo Manager (Stack)
 │
 ├── Apply Discount           → Discount Engine (DP)
 │
 ├── Filter by Price          → Price Sorter (TreeMap)
 │
 ├── Place Order              → Order Queue (Queue / PriorityQueue)
 │
 ├── Payment                  → Order finalization
 │
 ├── Get Recommendations      → Recommendation Engine (Graph)
 │
 └── Track Delivery           → Delivery Graph (Graph + Dijkstra)
```

This flow is identical across every feature — no step is skipped or optional in the design.

---

## 3. Project Directory Structure

```
E-commerce/
├── pom.xml
└── src/
    └── main/
        └── java/
            └── com/
                └── shopsphere/
                    │
                    ├── ShopSphereApp.java
                    │
                    ├── model/
                    │   ├── User.java
                    │   ├── Product.java
                    │   ├── Order.java
                    │   ├── CartItem.java
                    │   └── DeliveryRoute.java
                    │
                    ├── auth/
                    │   └── AuthService.java
                    │
                    ├── catalog/
                    │   ├── ProductCatalog.java
                    │   └── CategoryTree.java
                    │
                    ├── cart/
                    │   ├── ShoppingCart.java
                    │   └── UndoManager.java
                    │
                    ├── order/
                    │   ├── OrderQueue.java
                    │   └── PremiumOrderQueue.java
                    │
                    ├── search/
                    │   └── ProductSearch.java
                    │
                    ├── wishlist/
                    │   └── Wishlist.java
                    │
                    ├── pricing/
                    │   ├── PriceSorter.java
                    │   └── DiscountEngine.java
                    │
                    ├── delivery/
                    │   └── DeliveryGraph.java
                    │
                    ├── history/
                    │   └── RecentProducts.java
                    │
                    └── recommendation/
                        └── RecommendationEngine.java
```

---

## 4. Feature → Data Structure Mapping (Master Table)

| #  | Feature              | Problem It Solves                              | Data Structure    | Java Class/API                        | Time Complexity          |
|----|----------------------|------------------------------------------------|-------------------|---------------------------------------|--------------------------|
| 1  | Product Catalog      | Store and display all products                 | ArrayList         | `ArrayList<Product>`                  | Add O(1), Get O(1)       |
| 2  | Shopping Cart        | Hold selected items for current session        | ArrayList         | `ArrayList<CartItem>`                 | Add O(1), Remove O(n)    |
| 3  | Undo Remove          | Restore last removed cart item                 | Stack (Deque)     | `ArrayDeque<CartItem>`                | Push/Pop O(1)            |
| 4  | Order Processing     | Process orders in arrival order (FIFO)         | Queue             | `LinkedList<Order>` as Queue          | Enqueue/Dequeue O(1)     |
| 5  | Premium Orders       | High-priority orders processed first           | Priority Queue    | `PriorityQueue<Order>`                | Insert O(log n)          |
| 6  | Product Search       | Instant lookup by keyword or tag               | HashMap           | `HashMap<String, List<Product>>`      | Search O(1) avg          |
| 7  | Wishlist             | Save products, no duplicates                   | HashSet           | `HashSet<Product>`                    | Add/Contains O(1) avg    |
| 8  | Price Sorting        | Sort and filter products by price range        | TreeMap           | `TreeMap<Double, List<Product>>`      | Insert/Range O(log n)    |
| 9  | Product Categories   | Hierarchical category browsing                 | Tree              | Custom N-ary Tree                     | Traversal O(n)           |
| 10 | Delivery Routes      | Find shortest delivery path                    | Graph             | `Map<String, List<Edge>>`             | Dijkstra O((V+E) log V)  |
| 11 | Recent Products      | Track last N viewed products                   | LinkedList        | `LinkedList<Product>`                 | Add/Remove O(1)          |
| 12 | Discount             | Maximize discount without exceeding budget     | Dynamic Prog.     | 2D DP array                           | O(n × capacity)          |
| 13 | Recommendations      | Suggest related products                       | Graph             | `Map<Product, Set<Product>>`          | BFS O(V+E)               |

---

## 5. Package-by-Package Detailed Breakdown

---

### 5.1 `model/` — Data Layer

Pure POJOs. Zero business logic. All other packages depend on these.

#### `User.java`
| Field     | Type    | Purpose                              |
|-----------|---------|--------------------------------------|
| userId    | String  | Unique identifier                    |
| name      | String  | Display name                         |
| email     | String  | Login credential / key in AuthService|
| password  | String  | Hashed password                      |
| isPremium | boolean | Determines order queue priority      |

#### `Product.java`
| Field      | Type          | Purpose                                   |
|------------|---------------|-------------------------------------------|
| productId  | String        | Unique identifier                         |
| name       | String        | Display name                              |
| price      | double        | Used in TreeMap key, DiscountEngine       |
| category   | String        | Maps to CategoryTree node                 |
| tags       | List<String>  | Indexed in ProductSearch HashMap          |
| rating     | double        | Used in RecommendationEngine edge weight  |

#### `Order.java`
| Field     | Type          | Purpose                                  |
|-----------|---------------|------------------------------------------|
| orderId   | String        | Unique identifier                        |
| userId    | String        | Owner                                    |
| items     | List<CartItem>| Snapshot of cart at checkout             |
| priority  | int           | PriorityQueue comparator field           |
| status    | OrderStatus   | Enum: PENDING, PROCESSING, DELIVERED     |
| total     | double        | Final amount after discount              |

#### `CartItem.java`
| Field    | Type    | Purpose                   |
|----------|---------|---------------------------|
| product  | Product | Reference to product      |
| quantity | int     | Number of units           |

#### `DeliveryRoute.java`
| Field       | Type   | Purpose                    |
|-------------|--------|----------------------------|
| source      | String | Origin city/warehouse      |
| destination | String | Target city/warehouse      |
| distance    | double | Edge weight in graph       |

---

### 5.2 `auth/` — Authentication

#### `AuthService.java`
- Data Structure: `HashMap<String, User>` (email → User)
- Why HashMap: O(1) average-case login lookup. No need to scan a list.

| Method             | Description                                      |
|--------------------|--------------------------------------------------|
| register(User)     | Put into map if email not already present        |
| login(email, pass) | Get from map, validate password, return User     |
| logout(userId)     | Clear session                                    |
| getUser(email)     | Direct O(1) lookup                               |

---

### 5.3 `catalog/` — Product Browsing

#### `ProductCatalog.java`
- Data Structure: `ArrayList<Product>`
- Why ArrayList: Random index access O(1), dynamic resizing, natural fit for a flat list of products.

| Method                       | Description                                 |
|------------------------------|---------------------------------------------|
| addProduct(Product)          | Append to list                              |
| removeProduct(productId)     | Linear scan + remove                        |
| getAllProducts()              | Return full list                            |
| getProductsByCategory(cat)   | Filter stream by category                   |

#### `CategoryTree.java`
- Data Structure: Custom N-ary Tree
- Why Tree: Categories are inherently hierarchical (Electronics → Phones → Android). A tree models this parent-child relationship exactly.

```
Root
 ├── Electronics
 │    ├── Mobiles
 │    │    ├── Android
 │    │    └── iOS
 │    └── Laptops
 ├── Clothing
 │    ├── Men
 │    └── Women
 └── Home & Kitchen
```

| Method                       | Description                                       |
|------------------------------|---------------------------------------------------|
| addCategory(parent, child)   | Add child node under parent                       |
| getChildren(category)        | Return direct subcategories                       |
| traverseDFS(node)            | Full tree walk for sitemap / breadcrumb           |
| findCategory(name)           | BFS/DFS search for node by name                   |

Node structure:
```
CategoryNode {
    String name
    List<CategoryNode> children
}
```

---

### 5.4 `cart/` — Shopping Cart & Undo

#### `ShoppingCart.java`
- Data Structure: `ArrayList<CartItem>`
- Why ArrayList: Sequential list of items, fast indexed access, easy iteration for total calculation.

| Method                    | Description                                          |
|---------------------------|------------------------------------------------------|
| addItem(Product, qty)     | Append CartItem or increment qty if exists           |
| removeItem(productId)     | Remove + push to UndoManager stack                   |
| getItems()                | Return current cart list                             |
| calculateTotal()          | Iterate and sum item prices                          |
| clear()                   | Empty cart after order placed                        |

#### `UndoManager.java`
- Data Structure: `ArrayDeque<CartItem>` used as Stack
- Why Stack: Undo is LIFO — the last removed item is the first to be restored. Stack is the canonical structure for this.

| Method       | Description                                            |
|--------------|--------------------------------------------------------|
| push(item)   | Called by ShoppingCart.removeItem()                    |
| undo()       | Pop top item, return to ShoppingCart                   |
| canUndo()    | Check if stack is non-empty                            |

Stack state example:
```
Remove "Shoes"  → Stack: [Shoes]
Remove "Watch"  → Stack: [Shoes, Watch]
Undo            → Watch restored, Stack: [Shoes]
Undo            → Shoes restored, Stack: []
```

---

### 5.5 `order/` — Order Processing

#### `OrderQueue.java`
- Data Structure: `LinkedList<Order>` implementing `Queue`
- Why Queue: Orders must be processed in arrival order — FIFO. Queue is the exact model for this.

| Method            | Description                                   |
|-------------------|-----------------------------------------------|
| enqueue(Order)    | Add order to tail                             |
| dequeue()         | Remove and process from head                  |
| peek()            | View next order without removing              |
| isEmpty()         | Check if queue has pending orders             |

#### `PremiumOrderQueue.java`
- Data Structure: `PriorityQueue<Order>`
- Why PriorityQueue: Premium users should not wait behind regular orders. PriorityQueue with a comparator on `Order.priority` ensures highest-priority orders are always processed first. Internally a min-heap.

| Method                | Description                                          |
|-----------------------|------------------------------------------------------|
| enqueue(Order)        | Insert with priority (premium = higher priority int) |
| dequeue()             | Always returns highest-priority order                |
| peek()                | View top-priority order                              |

Comparator logic:
```
isPremium → priority = 1  (processed first)
isRegular → priority = 10 (processed after premium)
```

---

### 5.6 `search/` — Product Search

#### `ProductSearch.java`
- Data Structure: `HashMap<String, List<Product>>`
- Why HashMap: Keyword-to-product indexing gives O(1) average lookup. Building the index at insert time means search is instant regardless of catalog size.

| Method                     | Description                                      |
|----------------------------|--------------------------------------------------|
| indexProduct(Product)      | For each tag, add product to map entry           |
| search(keyword)            | Return list mapped to keyword key                |
| removeFromIndex(Product)   | Remove product from all its tag entries          |

Index example:
```
"wireless"  → [AirPods, Sony WH-1000XM5]
"laptop"    → [MacBook, Dell XPS]
"nike"      → [Air Max, React Foam]
```

---

### 5.7 `wishlist/` — Wishlist

#### `Wishlist.java`
- Data Structure: `HashSet<Product>`
- Why HashSet: A wishlist should not contain duplicates. HashSet guarantees uniqueness automatically and gives O(1) add/remove/contains.

| Method               | Description                              |
|----------------------|------------------------------------------|
| addToWishlist(p)     | Add product (duplicate ignored)          |
| removeFromWishlist(p)| Remove product                           |
| isWishlisted(p)      | O(1) membership check                    |
| getAll()             | Return all wishlisted products           |

---

### 5.8 `pricing/` — Price Sorting & Discounts

#### `PriceSorter.java`
- Data Structure: `TreeMap<Double, List<Product>>`
- Why TreeMap: Red-Black Tree internally. All products are always sorted by price. `subMap()` gives price-range filtering in O(log n) — something a HashMap or ArrayList cannot do efficiently.

| Method                        | Description                                       |
|-------------------------------|---------------------------------------------------|
| addProduct(Product)           | Insert at key = product.price                     |
| getInRange(minPrice, maxPrice)| `subMap(min, max)` — O(log n) range query         |
| getCheapest(n)                | First n entries from TreeMap                      |
| getMostExpensive(n)           | Last n entries via `descendingMap()`              |

#### `DiscountEngine.java`
- Data Structure: 2D DP table `int[n+1][W+1]`
- Why DP: Given a set of discount coupons each with a minimum spend and a discount value, finding the best combination that maximizes total discount without exceeding budget is a variant of the 0/1 Knapsack problem. Greedy fails here; DP gives the guaranteed optimal.

Problem modeled as:
```
Items     = available discount coupons
Weight    = minimum spend required per coupon
Value     = discount amount
Capacity  = user's cart total
Goal      = maximize total discount
```

| Method                          | Description                                     |
|---------------------------------|-------------------------------------------------|
| applyBestDiscount(coupons, total)| Run DP, return maximum discount amount         |
| buildDPTable(coupons, capacity) | Fill n×W table bottom-up                       |
| traceback(table)                | Identify which coupons were selected            |

---

### 5.9 `delivery/` — Delivery Route Optimization

#### `DeliveryGraph.java`
- Data Structure: Adjacency List — `Map<String, List<Edge>>`
- Why Graph: Warehouses and cities are nodes. Roads between them are weighted edges. Shortest delivery path = shortest path in a weighted graph = Dijkstra's algorithm.

Graph structure:
```
Mumbai ──5──→ Pune
Mumbai ──8──→ Nashik
Pune   ──3──→ Nashik
Nashik ──6──→ Aurangabad
```

Edge structure:
```
Edge {
    String destination
    double weight   ← distance / cost
}
```

| Method                          | Description                                         |
|---------------------------------|-----------------------------------------------------|
| addCity(city)                   | Add node to graph                                   |
| addRoute(src, dest, dist)       | Add directed weighted edge                          |
| shortestPath(src, dest)         | Dijkstra's — returns path + total distance          |
| getAllReachable(src)             | BFS from source — all deliverable locations         |

Dijkstra's uses `PriorityQueue<Node>` internally (min-heap on distance).

---

### 5.10 `history/` — Recently Viewed Products

#### `RecentProducts.java`
- Data Structure: `LinkedList<Product>`
- Why LinkedList: Add to front is O(1). Remove from tail is O(1). No index-based access needed. Ideal sliding-window of last N viewed products.

| Method              | Description                                              |
|---------------------|----------------------------------------------------------|
| addViewed(Product)  | addFirst(); if size > MAX (e.g. 10), removeLast()        |
| getRecent()         | Return list in view order (most recent first)            |
| clear()             | Reset on logout                                          |

State example (MAX = 3):
```
View A → [A]
View B → [B, A]
View C → [C, B, A]
View D → [D, C, B]   ← A dropped
```

---

### 5.11 `recommendation/` — Product Recommendations

#### `RecommendationEngine.java`
- Data Structure: Directed Graph — `Map<Product, Set<Product>>`
- Why Graph: "Users who bought A also bought B" is a relationship — edges between products. BFS from a given product returns all related products within N hops.

| Method                         | Description                                           |
|--------------------------------|-------------------------------------------------------|
| addRelation(productA, productB)| Add directed edge A → B                              |
| getRecommendations(product, n) | BFS up to depth n, return visited products            |
| buildFromOrderHistory(orders)  | Auto-build graph by co-occurrence in past orders      |

BFS traversal (depth = 2):
```
Shoes → [Socks, Laces]
Socks → [Insoles]

Recommend for Shoes (depth 2) = [Socks, Laces, Insoles]
```

---

## 6. Data Flow: End-to-End Trace

### Scenario: User searches, adds to cart, applies discount, places order

```
1. login("user@email.com", "pass")
      AuthService.HashMap → returns User object

2. search("wireless")
      ProductSearch.HashMap → returns [AirPods, Sony WH-1000XM5]

3. viewProduct(AirPods)
      RecentProducts.LinkedList → addFirst(AirPods)

4. addToCart(AirPods, qty=1)
      ShoppingCart.ArrayList → append CartItem

5. removeFromCart(AirPods)
      ShoppingCart.ArrayList → remove
      UndoManager.Stack → push(AirPods)

6. undo()
      UndoManager.Stack → pop() → AirPods
      ShoppingCart.ArrayList → re-add AirPods

7. filterByPrice(500, 2000)
      PriceSorter.TreeMap → subMap(500.0, 2000.0)

8. applyDiscount(coupons, cartTotal)
      DiscountEngine.DP → returns best discount combo

9. placeOrder(cart)
      if user.isPremium → PremiumOrderQueue.PriorityQueue.enqueue(order)
      else             → OrderQueue.Queue.enqueue(order)

10. processNextOrder()
       PriorityQueue / Queue → dequeue() → process

11. findDeliveryRoute("Mumbai", "Aurangabad")
       DeliveryGraph.Dijkstra → shortest path + distance

12. getRecommendations(AirPods)
       RecommendationEngine.Graph.BFS → [Sony WH, JBL, ...]
```

---

## 7. Data Structure Decision Rationale

| Feature           | Why NOT other structures                                                           |
|-------------------|------------------------------------------------------------------------------------|
| Cart (ArrayList)  | LinkedList would be slower for index access; Array is fixed-size                   |
| Undo (Stack)      | Queue gives wrong order (FIFO); List requires manual index tracking                |
| Order (Queue)     | Stack reverses order; ArrayList requires manual head tracking                      |
| Premium (PQ)      | Regular Queue ignores priority; Sorting entire list on every insert is O(n log n)  |
| Search (HashMap)  | ArrayList search is O(n); TreeMap search is O(log n); HashMap is O(1)              |
| Wishlist (HashSet)| List allows duplicates and O(n) contains; HashSet is O(1) and unique               |
| Price (TreeMap)   | HashMap cannot do range queries; ArrayList needs full sort for every filter        |
| Category (Tree)   | Flat list cannot represent parent-child; HashMap loses hierarchy                   |
| Delivery (Graph)  | Tree cannot model cycles; Matrix wastes memory for sparse city connections         |
| Recent (LinkedList)| ArrayList tail removal is O(n) copy; LinkedList is O(1) at both ends             |
| Discount (DP)     | Greedy does not guarantee optimal coupon combination for all cases                 |
| Recommend (Graph) | Simple list has no relationship model; HashMap only stores 1-level relations       |

---

## 8. Java API Reference

| Data Structure  | Java Class/Interface Used              | Package              |
|-----------------|----------------------------------------|----------------------|
| ArrayList       | `java.util.ArrayList`                  | `java.util`          |
| Stack/Deque     | `java.util.ArrayDeque`                 | `java.util`          |
| Queue           | `java.util.LinkedList` + `Queue<E>`    | `java.util`          |
| Priority Queue  | `java.util.PriorityQueue`              | `java.util`          |
| HashMap         | `java.util.HashMap`                    | `java.util`          |
| HashSet         | `java.util.HashSet`                    | `java.util`          |
| TreeMap         | `java.util.TreeMap`                    | `java.util`          |
| LinkedList      | `java.util.LinkedList`                 | `java.util`          |
| Custom Tree     | Manual `CategoryNode` class            | `com.shopsphere.catalog` |
| Graph           | `java.util.HashMap` + `java.util.List` | `com.shopsphere.delivery` |
| DP Table        | Primitive `int[][]`                    | `com.shopsphere.pricing`  |

---

## 9. Package Dependencies

```
model/          ← no dependencies (base layer)
auth/           ← depends on model/User
catalog/        ← depends on model/Product
search/         ← depends on model/Product
wishlist/       ← depends on model/Product
history/        ← depends on model/Product
cart/           ← depends on model/Product, model/CartItem
pricing/        ← depends on model/Product, model/CartItem
order/          ← depends on model/Order, model/CartItem
delivery/       ← depends on model/DeliveryRoute
recommendation/ ← depends on model/Product
ShopSphereApp   ← orchestrates all packages
```

---

## 10. Build Configuration (`pom.xml` outline)

```
GroupId:    com.shopsphere
ArtifactId: shopsphere
Version:    1.0.0
Java:       17+
Packaging:  jar
```

Dependencies needed:
- None (pure Java, all data structures are from `java.util`)
- Optional: JUnit 5 for testing each data structure feature

---

## 11. Key Algorithms Summary

| Algorithm          | Where Used                  | Complexity          |
|--------------------|-----------------------------|---------------------|
| HashMap Indexing   | ProductSearch               | O(1) avg insert/get |
| Stack LIFO         | UndoManager                 | O(1) push/pop       |
| FIFO Queue         | OrderQueue                  | O(1) enqueue/dequeue|
| Min-Heap           | PremiumOrderQueue, Dijkstra | O(log n)            |
| DFS/BFS on Tree    | CategoryTree                | O(n)                |
| Dijkstra's         | DeliveryGraph               | O((V+E) log V)      |
| BFS on Graph       | RecommendationEngine        | O(V+E)              |
| 0/1 Knapsack DP    | DiscountEngine              | O(n × W)            |
| Sliding Window LL  | RecentProducts              | O(1) per view       |
| Red-Black Tree Ops | PriceSorter (TreeMap)       | O(log n)            |

---

*ShopSphere — Every feature backed by the right data structure.*
