# 🧪 BookSphere — API Testing Guide (Postman)

BookSphere uses **Supabase** as its backend — which auto-generates a REST API for every table.
This guide explains how to test all endpoints using the provided Postman collection.

---

## 📋 Table of Contents

- [Why Postman with Supabase](#why-postman-with-supabase)
- [Setup](#setup)
- [Authentication](#authentication)
- [Public Endpoints](#public-endpoints)
- [Private Endpoints](#private-endpoints)
- [RLS Proof](#rls-proof)
- [Full Demo Flow for Jury](#full-demo-flow-for-jury)

---

## Why Postman with Supabase

Supabase auto-generates a standard REST API for every table in PostgreSQL.
These endpoints follow the PostgREST spec and can be tested just like any custom backend.

```
Traditional Backend          BookSphere (Supabase)
─────────────────────        ─────────────────────
Write routes manually   →    Auto-generated REST API
Write auth middleware   →    Supabase Auth + JWT built-in
Write security logic    →    RLS policies in PostgreSQL
Deploy a server         →    Supabase Cloud (managed)
```

The Postman collection proves that all standard HTTP methods (GET, POST, PATCH, DELETE)
work correctly — secured by JWT tokens and Row Level Security.

---

## Setup

### Step 1 — Import Collection

1. Open Postman → **My Workspace**
2. Click **Import**
3. Select `BookSphere.postman_collection.json` from the project root
4. Click **Import** — all 18 requests across 7 folders will appear

### Step 2 — Set Variables

Click **BookSphere — Supabase API** collection → **Variables** tab and fill in:

| Variable | Value | How to get |
|----------|-------|-----------|
| `supabase_url` | `https://vckpdkzsfeeibldxippd.supabase.co` | Already set |
| `anon_key` | `sb_publishable_5pi0OY09IbihgQliazw5ug_G5ha_SxJ` | Supabase Dashboard → Settings → API |
| `user_jwt` | `eyJhbGci...` | Run Login request → copy `access_token` |
| `user_id` | `16e4f285-abb7-4d00-b7f6-daef59c5a02e` | Run Login request → copy `user.id` |

Click **Save** (Ctrl+S) after filling in the values.

### Step 3 — Request Headers (already set in collection)

Every request automatically sends:
```
apikey: {{anon_key}}
Authorization: Bearer {{user_jwt}}
Content-Type: application/json
```

---

## Authentication

### POST — Register (Email + Password)

**Endpoint:** `POST /auth/v1/signup`

**Body:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "email": "test@example.com",
  "created_at": "2026-06-18T..."
}
```

What happens behind the scenes:
- Supabase hashes password with **bcrypt**
- Creates user in `auth.users` table
- Returns JWT session

---

### POST — Login (Email + Password)

**Endpoint:** `POST /auth/v1/token?grant_type=password`

**Body:**
```json
{
  "email": "varadmandhare924@gmail.com",
  "password": "your-password"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGci...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "frxohtplyj6v",
  "user": {
    "id": "16e4f285-abb7-4d00-b7f6-daef59c5a02e",
    "email": "varadmandhare924@gmail.com",
    "user_metadata": {
      "isPremium": true,
      "name": "varad mandhare"
    }
  }
}
```

Copy `access_token` → paste into `user_jwt` variable
Copy `user.id` → paste into `user_id` variable

JWT contains `isPremium: true` — this controls whether orders go into the **Priority Queue (priority=1)** or **Standard Queue (priority=10)**.

---

### POST — Logout

**Endpoint:** `POST /auth/v1/logout`

**Headers:** Requires `Authorization: Bearer {{user_jwt}}`

**Response (204):** No content — session invalidated, tokens deleted.

---

## Public Endpoints

These endpoints require only the `anon_key` — no login needed.

### GET — All Books

**Endpoint:** `GET /rest/v1/books?select=*`

**Response (200):**
```json
[
  {
    "id": "book-1",
    "name": "The Great Gatsby",
    "price": 299,
    "category": "Fiction",
    "author": "F. Scott Fitzgerald",
    "tags": ["classic", "fiction", "novel"],
    "rating": 4.5
  },
  ...12 books total
]
```

DSA connection → this catalog feeds the **HashMap search index** built in `useStore.jsx`:
```js
{ "classic": [book1, book3], "fiction": [book1, book2, ...] }
```

---

### GET — Books by Category

**Endpoint:** `GET /rest/v1/books?select=*&category=eq.Fiction`

Filters books where `category = 'Fiction'`.
PostgREST filter syntax: `column=eq.value`

---

### GET — Books sorted by Price

**Endpoint:** `GET /rest/v1/books?select=*&order=price.asc`

Returns books sorted by price ascending — same as the **TreeMap (Red-Black Tree)** price sorting feature.

---

### GET — All Coupons

**Endpoint:** `GET /rest/v1/coupons?select=*`

**Response (200):**
```json
[
  { "id": "BOOK30",  "label": "Save ₹30",  "min_spend": 200,  "discount": 30  },
  { "id": "BOOK80",  "label": "Save ₹80",  "min_spend": 500,  "discount": 80  },
  { "id": "BOOK150", "label": "Save ₹150", "min_spend": 900,  "discount": 150 },
  { "id": "BOOK300", "label": "Save ₹300", "min_spend": 1500, "discount": 300 }
]
```

DSA connection → these 4 coupons are fed into the **0/1 Knapsack DP algorithm**:
```
dp[n+1][W+1] where W = cart total
→ finds optimal combination of coupons to maximize discount
```

---

## Private Endpoints

These endpoints require `Authorization: Bearer {{user_jwt}}`.
RLS ensures each user only sees their own data.

---

### Cart

#### GET — My Cart

**Endpoint:** `GET /rest/v1/carts?select=*&user_id=eq.{{user_id}}`

**Response (200):**
```json
[
  { "user_id": "16e4f285-...", "book_id": "book-1", "qty": 2 },
  { "user_id": "16e4f285-...", "book_id": "book-3", "qty": 1 }
]
```

DSA connection → maps to **ArrayList\<CartItem\>** in the frontend store.

---

#### POST — Add to Cart

**Endpoint:** `POST /rest/v1/carts`

**Headers:** `Prefer: resolution=merge-duplicates` (upsert behavior)

**Body:**
```json
{
  "user_id": "{{user_id}}",
  "book_id": "book-1",
  "qty": 1
}
```

**Response (201):** Created

---

#### DELETE — Remove from Cart

**Endpoint:** `DELETE /rest/v1/carts?user_id=eq.{{user_id}}&book_id=eq.book-1`

**Response (204):** No content — item removed

DSA connection → removed item is pushed onto the **Undo Stack (ArrayDeque)** in the frontend, allowing undo-remove.

---

### Wishlist

#### GET — My Wishlist

**Endpoint:** `GET /rest/v1/wishlists?select=*&user_id=eq.{{user_id}}`

**Response (200):**
```json
[
  { "user_id": "16e4f285-...", "book_id": "book-2" },
  { "user_id": "16e4f285-...", "book_id": "book-5" }
]
```

DSA connection → maps to **HashSet\<Book\>** — O(1) lookup for duplicate prevention.

---

#### POST — Add to Wishlist

**Endpoint:** `POST /rest/v1/wishlists`

**Body:**
```json
{
  "user_id": "{{user_id}}",
  "book_id": "book-1"
}
```

Composite primary key `(user_id, book_id)` prevents duplicates at the database level.

---

#### DELETE — Remove from Wishlist

**Endpoint:** `DELETE /rest/v1/wishlists?user_id=eq.{{user_id}}&book_id=eq.book-1`

**Response (204):** No content

---

### Orders

#### GET — My Orders (sorted by priority)

**Endpoint:** `GET /rest/v1/orders?select=*&user_id=eq.{{user_id}}&order=priority.asc`

**Response (200):**
```json
[
  {
    "order_id": "ORD-1718693343000",
    "user_id": "16e4f285-...",
    "items": [{"product": {"id": "book-1", "name": "...", "price": 299}, "qty": 1}],
    "total": 299,
    "priority": 1,
    "status": "PENDING",
    "is_premium": true,
    "created_at": "2026-06-18T..."
  }
]
```

DSA connection:
- `priority: 1` → **Premium Queue** (PriorityQueue min-heap, processed first)
- `priority: 10` → **Standard Queue** (processed after premium)
- `items` stored as **jsonb** — full product snapshot at order time

---

#### POST — Place Order

**Endpoint:** `POST /rest/v1/orders`

**Body:**
```json
{
  "order_id": "ORD-1234567890",
  "user_id": "{{user_id}}",
  "items": [{"product": {"id": "book-1", "name": "Sample Book", "price": 299}, "qty": 1}],
  "total": 299,
  "priority": 10,
  "status": "PENDING",
  "is_premium": false
}
```

`priority: 1` for premium users, `priority: 10` for standard — controls queue order.

---

#### PATCH — Update Order Status

**Endpoint:** `PATCH /rest/v1/orders?order_id=eq.ORD-1234567890`

**Body:**
```json
{
  "status": "PROCESSING"
}
```

Status flow: `PENDING → PROCESSING → DELIVERED`

---

### Recently Viewed

#### GET — Recently Viewed (last 5)

**Endpoint:** `GET /rest/v1/recently_viewed?select=*&user_id=eq.{{user_id}}&order=viewed_at.desc&limit=5`

**Response (200):**
```json
[
  { "user_id": "16e4f285-...", "book_id": "book-3", "viewed_at": "2026-06-18T12:00:00Z" },
  { "user_id": "16e4f285-...", "book_id": "book-1", "viewed_at": "2026-06-18T11:55:00Z" }
]
```

DSA connection → **Sliding Window LinkedList** — max 5 records, ordered by most recent.

---

## RLS Proof

Row Level Security (RLS) is enforced at the PostgreSQL level.
To prove it works via Postman:

1. Run **Login** with User A credentials → copy JWT
2. Set `user_jwt` and `user_id` to User A's values
3. Run **GET My Orders** → see User A's orders only
4. Change `user_id` variable to a different (fake) UUID
5. Run **GET My Orders** again → returns `[]` empty — RLS blocked it

The database policy running behind every request:
```sql
SELECT * FROM orders WHERE auth.uid() = user_id
```

No data from other users is ever returned — even if you pass someone else's `user_id` in the query.

---

## Full Demo Flow for Jury

Follow this exact sequence to demonstrate the full backend:

```
Step 1 → POST Login
         ✓ 200 OK — JWT returned, isPremium: true visible in response

Step 2 → GET All Books
         ✓ 200 OK — 12 books returned (public, no auth needed)

Step 3 → GET All Coupons
         ✓ 200 OK — 4 coupons (BOOK30, BOOK80, BOOK150, BOOK300)

Step 4 → POST Add to Cart
         ✓ 201 Created — book added to cart

Step 5 → GET My Cart
         ✓ 200 OK — cart data returned (JWT secured, RLS enforced)

Step 6 → POST Add to Wishlist
         ✓ 201 Created — book saved to wishlist

Step 7 → POST Place Order
         ✓ 201 Created — order placed with priority

Step 8 → GET My Orders
         ✓ 200 OK — order visible, sorted by priority (premium first)

Step 9 → PATCH Update Order Status
         ✓ 200 OK — status updated to PROCESSING

Step 10 → DELETE Remove from Cart
          ✓ 204 No Content — item removed (undo stack triggered in frontend)
```

Each step proves:
- REST API is working (HTTP methods + status codes)
- JWT authentication is enforced (private endpoints need valid token)
- RLS is working (users only see their own data)
- Database operations are persisting (open Supabase Table Editor in parallel to confirm)

---

*BookSphere API Testing — 18 requests, 7 folders, zero custom backend code.*
