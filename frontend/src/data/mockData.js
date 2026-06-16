// ╔══════════════════════════════════════════════════════════════════╗
// ║  DSA: ArrayList<Book>  →  java.util.ArrayList                    ║
// ║  Fixed catalog loaded once. O(1) index access, O(n) iteration.  ║
// ╚══════════════════════════════════════════════════════════════════╝
export const PRODUCTS = [
  { id: "p1",  name: "The Pragmatic Programmer",    price: 599,  category: "Technology",  author: "Hunt & Thomas",    tags: ["programming", "software", "engineering"], rating: 4.9 },
  { id: "p2",  name: "Clean Code",                  price: 549,  category: "Technology",  author: "Robert C. Martin", tags: ["programming", "refactoring", "engineering"], rating: 4.8 },
  { id: "p3",  name: "Dune",                         price: 399,  category: "Fiction",     author: "Frank Herbert",    tags: ["scifi", "fiction", "classic"], rating: 4.9 },
  { id: "p4",  name: "1984",                         price: 299,  category: "Fiction",     author: "George Orwell",    tags: ["dystopia", "fiction", "classic"], rating: 4.8 },
  { id: "p5",  name: "Sapiens",                      price: 449,  category: "Non-Fiction", author: "Yuval Noah Harari", tags: ["history", "nonfiction", "science"], rating: 4.7 },
  { id: "p6",  name: "Atomic Habits",                price: 499,  category: "Self-Help",   author: "James Clear",      tags: ["selfhelp", "habits", "productivity"], rating: 4.8 },
  { id: "p7",  name: "Introduction to Algorithms",  price: 899,  category: "Technology",  author: "CLRS",             tags: ["algorithms", "programming", "engineering"], rating: 4.7 },
  { id: "p8",  name: "The Alchemist",                price: 249,  category: "Fiction",     author: "Paulo Coelho",     tags: ["fiction", "classic", "inspirational"], rating: 4.6 },
  { id: "p9",  name: "Thinking, Fast and Slow",      price: 479,  category: "Non-Fiction", author: "Daniel Kahneman",  tags: ["psychology", "nonfiction", "science"], rating: 4.6 },
  { id: "p10", name: "Deep Work",                    price: 399,  category: "Self-Help",   author: "Cal Newport",      tags: ["selfhelp", "productivity", "focus"], rating: 4.7 },
  { id: "p11", name: "The Great Gatsby",              price: 199,  category: "Fiction",     author: "F. Scott Fitzgerald", tags: ["fiction", "classic", "literature"], rating: 4.4 },
  { id: "p12", name: "Designing Data-Intensive Apps",price: 799,  category: "Technology",  author: "Martin Kleppmann", tags: ["programming", "systems", "engineering"], rating: 4.9 },
];

export const COUPONS = [
  { id: "c1", label: "BOOK30",  minSpend: 300,  discount: 30 },
  { id: "c2", label: "BOOK80",  minSpend: 800,  discount: 80 },
  { id: "c3", label: "BOOK150", minSpend: 1500, discount: 150 },
  { id: "c4", label: "BOOK300", minSpend: 2500, discount: 300 },
];

// ╔══════════════════════════════════════════════════════════════════╗
// ║  DSA: Graph (Adjacency List)  →  Map<String, List<Edge>>         ║
// ║  Each city maps to a list of {to, dist} edges.                   ║
// ║  Fed into Dijkstra’s algorithm in useStore.jsx.                  ║
// ╚══════════════════════════════════════════════════════════════════╝
export const DELIVERY_GRAPH = {
  Mumbai:     [{ to: "Pune", dist: 148 }, { to: "Nashik", dist: 166 }],
  Pune:       [{ to: "Mumbai", dist: 148 }, { to: "Nashik", dist: 213 }, { to: "Hyderabad", dist: 560 }],
  Nashik:     [{ to: "Mumbai", dist: 166 }, { to: "Pune", dist: 213 }, { to: "Aurangabad", dist: 100 }],
  Aurangabad: [{ to: "Nashik", dist: 100 }, { to: "Hyderabad", dist: 488 }],
  Hyderabad:  [{ to: "Pune", dist: 560 }, { to: "Aurangabad", dist: 488 }, { to: "Bangalore", dist: 570 }],
  Bangalore:  [{ to: "Hyderabad", dist: 570 }, { to: "Chennai", dist: 346 }],
  Chennai:    [{ to: "Bangalore", dist: 346 }],
};

// ╔══════════════════════════════════════════════════════════════════╗
// ║  DSA: Graph (Adjacency List)  →  Map<Book, Set<Book>>            ║
// ║  Co-purchase edges. BFS in useStore.jsx walks this graph.        ║
// ║  Visited set prevents cycles. O(V+E) traversal.                  ║
// ╚══════════════════════════════════════════════════════════════════╝
export const RECOMMENDATION_GRAPH = {
  p1:  ["p2", "p7", "p12"],
  p2:  ["p1", "p7", "p12"],
  p3:  ["p4", "p8", "p11"],
  p4:  ["p3", "p8", "p11"],
  p5:  ["p9", "p6"],
  p6:  ["p10", "p5"],
  p7:  ["p1", "p2", "p12"],
  p8:  ["p3", "p4"],
  p9:  ["p5", "p6"],
  p10: ["p6", "p5"],
  p11: ["p3", "p4"],
  p12: ["p1", "p2", "p7"],
};

// ╔══════════════════════════════════════════════════════════════════╗
// ║  DSA: Custom N-ary Tree  →  TreeNode { name, children[] }        ║
// ║  DFS traversal renders genre sidebar and powers category filter.  ║
// ║  Each level = one genre hierarchy depth. O(n) DFS.               ║
// ╚══════════════════════════════════════════════════════════════════╝
export const CATEGORY_TREE = {
  name: "All",
  children: [
    {
      name: "Technology",
      children: [
        { name: "programming", children: [] },
        { name: "algorithms",  children: [] },
        { name: "systems",     children: [] },
      ],
    },
    {
      name: "Fiction",
      children: [
        { name: "classic",  children: [] },
        { name: "scifi",    children: [] },
        { name: "dystopia", children: [] },
      ],
    },
    {
      name: "Non-Fiction",
      children: [
        { name: "history",    children: [] },
        { name: "psychology", children: [] },
        { name: "science",    children: [] },
      ],
    },
    {
      name: "Self-Help",
      children: [
        { name: "productivity", children: [] },
        { name: "habits",       children: [] },
      ],
    },
  ],
};
