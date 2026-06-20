
login_tcs = [
    ["TC_L_01","Valid email + password login","User on login page","Enter email + password → Click Sign In →","Email: varadmandhare924@gmail.com / Password: Varad@999","Redirected to catalog page","","PASS","P1","Smoke"],
    ["TC_L_02","Wrong password shows error","User on login page","Enter correct email + wrong password → Click Sign In →","Password: wrongpass","lf-error-msg appears below form","","FAIL","P1","Regression"],
    ["TC_L_03","Empty email — inline validation","User on login page","Leave email blank → enter password → Click Sign In →","Email: (empty)","'Enter a valid email' under email field","","","P1","Regression"],
    ["TC_L_04","Empty password — inline validation","User on login page","Enter email → leave password blank → Click Sign In →","Password: (empty)","'Password is required' under password field","","","P1","Regression"],
    ["TC_L_05","Invalid email format rejected","User on login page","Enter notanemail → password → Click Sign In →","Email: notanemail","'Enter a valid email' shown — form does not submit","","","P2","Regression"],
    ["TC_L_06","Password show/hide toggle","User on login page","Enter password → click 👁️ → verify text → click 🙈 → verify masked","Password: Varad@999","Input type toggles between text and password","","","P3","Functional"],
    ["TC_L_07","Switch to Sign Up mode","User in Sign In mode","Click 'Sign Up' toggle button","N/A","Full Name field appears in register mode","","","P2","Functional"],
    ["TC_L_08","Forgot password flow","User on login page","Enter email → click 'Forgot password?'","Email: varadmandhare924@gmail.com","'✓ Reset link sent to ...' shown","","","P2","Functional"],
    ["TC_L_09","Session persists after refresh","User logged in","Login → press F5","Valid credentials","User stays on catalog — not redirected to login","","","P1","Regression"],
    ["TC_L_10","Both fields empty — both errors shown","User on login page","Leave both blank → Click Sign In →","Both empty","Errors under both email and password fields","","","P1","Regression"],
    ["TC_L_11","SQL injection in email rejected","User on login page","Enter ' OR '1'='1 as email → Click Sign In →","Email: ' OR '1'='1","Validation error shown — no login, no crash","","","P1","Security"],
    ["TC_L_12","Very long email handled gracefully","User on login page","Enter 300-char string as email → Click Sign In →","Email: 300 chars","Error shown — no crash","","","P2","Boundary"],
    ["TC_L_13","Register with valid data","User in Sign Up mode","Click Sign Up → fill name/email/password → Click Create Account →","Email: newtestuser99@gmail.com / Pass: Test@1234","'Account created! Signing you in…' shown","","","P2","Functional"],
    ["TC_L_14","Register with weak password","User in Sign Up mode","Click Sign Up → enter password: 123 → Click Create Account →","Password: 123 (3 chars)","'Minimum 6 characters' error shown","","","P2","Regression"],
]

catalog_tcs = [
    ["TC_C_01","All 12 books load on catalog page","User logged in","Login → navigate to catalog → count .product-card elements","Valid credentials","12 book cards rendered","","","P1","Smoke"],
    ["TC_C_02","Search by title — Atomic Habits","User on catalog","Type 'Atomic' in search input","Query: Atomic","≥1 result, fewer than 12 shown","","","P1","Regression"],
    ["TC_C_03","Search by author — James Clear","User on catalog","Type 'James Clear' in search","Query: James Clear","Books by James Clear shown","","","P2","Regression"],
    ["TC_C_04","Search by tag — classic","User on catalog","Type 'classic' in search","Query: classic","Books tagged 'classic' shown","","","P2","Regression"],
    ["TC_C_05","Search returns empty for garbage input","User on catalog","Type 'xyzxyzxyz' in search","Query: xyzxyzxyz","Empty state shown — no crash","","","P2","Regression"],
    ["TC_C_06","Clear search restores full catalog","User on catalog, search active","Type 'Atomic' → clear input","Search cleared","All 12 books shown again","","","P2","Regression"],
    ["TC_C_07","Genre tree visible and rendered","User on catalog","Check for .tree-node elements","N/A","Genre tree nodes visible","","","P1","Smoke"],
    ["TC_C_08","Click Fiction genre filters books","Genre tree visible","Click Fiction node → check books","Genre: Fiction","Only Fiction books displayed","","","P2","Regression"],
    ["TC_C_09","Price sort — Low to High","User on catalog","Select 'Price: Low to High' sort","Sort: asc","Lowest price book appears first","","","P2","Regression"],
    ["TC_C_10","Price sort — High to Low","User on catalog","Select 'Price: High to Low' sort","Sort: desc","Highest price book appears first","","","P2","Regression"],
    ["TC_C_11","Book card shows title, author, price","User on catalog","Inspect any book card","N/A","Title, author and ₹ price visible on card","","","P2","Functional"],
    ["TC_C_12","Add to Wishlist from catalog","User logged in","Click heart/wishlist icon on a book → go to Wishlist page","N/A","Book appears in Wishlist (HashSet — no duplicates)","","","P2","Regression"],
]

cart_tcs = [
    ["TC_CA_01","Add book to cart from catalog","User logged in on catalog","Click 'Add to Cart' → navigate to /cart","Any book","Cart shows ≥1 item","","","P1","Smoke"],
    ["TC_CA_02","Cart count updates in navbar","User on catalog","Note count → add book → check navbar","N/A","Navbar counter increments by 1","","","P1","Regression"],
    ["TC_CA_03","Add same book twice — qty increases","User on catalog","Add same book twice → go to cart","Same book ×2","Qty shows 2, not two separate rows","","","P2","Regression"],
    ["TC_CA_04","Remove item from cart","Cart has ≥1 item","Go to cart → click remove (✕) on first item","N/A","Item removed, count decreases by 1","","","P1","Regression"],
    ["TC_CA_05","Undo remove restores item — Stack DSA","Cart has ≥1 item","Remove item → click Undo","N/A","Item restored — Stack LIFO working","","","P1","Regression"],
    ["TC_CA_06","Undo button visibility logic","Cart has 1 item","Remove → undo → remove again → reload","N/A","Undo only shown when stack has items","","","P3","Functional"],
    ["TC_CA_07","Apply coupon BOOK30 (min ₹200)","Cart total ≥ ₹200","Enter BOOK30 → click Apply","Coupon: BOOK30 / Discount: ₹30","₹30 deducted from total","","","P1","Regression"],
    ["TC_CA_08","Apply coupon BOOK80 (min ₹500)","Cart total ≥ ₹500","Enter BOOK80 → click Apply","Coupon: BOOK80 / Discount: ₹80","₹80 deducted from total","","","P1","Regression"],
    ["TC_CA_09","Apply coupon BOOK150 (min ₹900)","Cart total ≥ ₹900","Enter BOOK150 → click Apply","Coupon: BOOK150 / Discount: ₹150","₹150 deducted from total","","","P2","Regression"],
    ["TC_CA_10","Invalid coupon shows no discount","Cart has items","Enter FAKECODE → click Apply","Coupon: FAKECODE","No discount applied — no crash","","","P2","Regression"],
    ["TC_CA_11","DP engine picks best coupon combo","Cart ≥ ₹900, all coupons available","Add books ≥ ₹900 → let DP auto-select","Total ≥ ₹900","Max discount selected via 0/1 Knapsack DP","","","P1","Regression"],
    ["TC_CA_12","Place order clears cart","Cart has items","Click 'Place Order' → go back to cart","N/A","Cart empty after order; order on Orders page","","","P1","Regression"],
]

orders_tcs = [
    ["TC_O_01","Orders page loads with orders","User has ≥1 order","Navigate to /orders","N/A","Order cards rendered on page","","","P1","Smoke"],
    ["TC_O_02","Premium order first — Priority Queue","User is premium, has both order types","Place premium + standard order → go to /orders","isPremium: true","Premium (priority=1) listed above standard (priority=10)","","","P1","Regression"],
    ["TC_O_03","New order status shows PENDING","Order just placed","Place order → check status badge on Orders page","N/A","Status badge shows PENDING","","","P2","Regression"],
    ["TC_O_04","Order shows correct items and total","Order placed with known book","Add ₹599 book → place order → check order details","Book: The Pragmatic Programmer ₹599","Correct book name, qty and ₹ total shown","","","P1","Regression"],
    ["TC_O_05","Multiple orders all listed","User has 3+ orders","Place 3 orders → go to /orders → count cards","N/A","All 3 order cards visible","","","P2","Regression"],
    ["TC_O_06","Orders sorted by priority","Mixed order types placed","Place standard then premium → go to /orders","priority=1 vs priority=10","Sorted ascending by priority — premium first","","","P1","Regression"],
    ["TC_O_07","Empty orders page shows empty state","New user with no orders","Login as new user → navigate to /orders","No prior orders","Empty state message shown — no blank screen or error","","","P2","Functional"],
]

api_tcs = [
    ["TC_A_01","GET /books returns 200 with 12 books","Valid anon key in ApiTest.java","GET /rest/v1/books?select=*  with apikey header","apikey: sb_publishable_5pi0OY09...","HTTP 200, JSON array of 12 books","","","P1","API"],
    ["TC_A_02","GET /coupons returns 200 with 4 coupons","Valid anon key","GET /rest/v1/coupons?select=*  with apikey header","apikey: sb_publishable_5pi0OY09...","HTTP 200, JSON array of 4 coupons","","","P1","API"],
    ["TC_A_03","GET /books filtered by category=Fiction","Valid anon key","GET /rest/v1/books?select=*&category=eq.Fiction","category=Fiction","HTTP 200, only Fiction books in response","","","P2","API"],
    ["TC_A_04","GET /books sorted by price ascending","Valid anon key","GET /rest/v1/books?select=*&order=price.asc","order=price.asc","HTTP 200, books ordered lowest price first","","","P2","API"],
    ["TC_A_05","GET /carts without JWT returns 401","No Authorization header","GET /rest/v1/carts?select=*  — apikey only, no Bearer token","Authorization: missing","HTTP 401 — Supabase RLS blocks unauthenticated access","","","P1","API"],
]

STATUS_ICON = {"PASS": "🟢", "FAIL": "🔴", "SKIP": "⚪", "": "🟡"}

def md_table(headers, rows):
    sep = "| " + " | ".join(["---"] * len(headers)) + " |"
    head = "| " + " | ".join(headers) + " |"
    lines = [head, sep]
    for r in rows:
        clean = [str(c).replace("\n", " ").replace("|", "\\|") for c in r]
        # status column (index 8) — add icon
        clean[8] = STATUS_ICON.get(clean[8], "🟡") + " " + clean[8] if clean[8] else "🟡"
        lines.append("| " + " | ".join(clean) + " |")
    return "\n".join(lines)

HEADERS = ["TC ID", "Test Case Title", "Preconditions", "Test Steps",
           "Test Data", "Expected Result", "Actual Result",
           "Status", "Priority", "Type"]

total = len(login_tcs)+len(catalog_tcs)+len(cart_tcs)+len(orders_tcs)+len(api_tcs)

md = f"""# 🧪 BookSphere — Test Cases ({total} Total)

> Hybrid Automation Framework: Java 17 · Selenium 4.18 · TestNG 7.9 · Cucumber 7.15 · Maven

---

## Summary

| Sheet | Module | Count | TC Range |
| --- | --- | --- | --- |
| 1 | 🔐 Login | {len(login_tcs)} | TC_L_01 – TC_L_{len(login_tcs):02d} |
| 2 | 📚 Catalog | {len(catalog_tcs)} | TC_C_01 – TC_C_{len(catalog_tcs):02d} |
| 3 | 🛒 Cart | {len(cart_tcs)} | TC_CA_01 – TC_CA_{len(cart_tcs):02d} |
| 4 | 📦 Orders | {len(orders_tcs)} | TC_O_01 – TC_O_0{len(orders_tcs)} |
| 5 | 🔌 API | {len(api_tcs)} | TC_A_01 – TC_A_0{len(api_tcs)} |
| | **Total** | **{total}** | |

**Status legend:** 🟢 PASS · 🔴 FAIL · 🟡 Pending · ⚪ Skip

---

## 🔐 Login Tests ({len(login_tcs)} cases)

{md_table(HEADERS, login_tcs)}

---

## 📚 Catalog Tests ({len(catalog_tcs)} cases)

{md_table(HEADERS, catalog_tcs)}

---

## 🛒 Cart Tests ({len(cart_tcs)} cases)

{md_table(HEADERS, cart_tcs)}

---

## 📦 Orders Tests ({len(orders_tcs)} cases)

{md_table(HEADERS, orders_tcs)}

---

## 🔌 API Tests ({len(api_tcs)} cases)

{md_table(HEADERS, api_tcs)}

---

*BookSphere Test Cases — generated from `gen_testcases.py` · Excel file: `BookSphere_TestCases.xlsx`*
"""

out = "/home/varad/projects/E-commerce/selenium-tests/TEST_CASES.md"
with open(out, "w") as f:
    f.write(md)
print(f"Saved: {out}  |  Total: {total} test cases")
