# 🏗️ THE 5 WORKFLOWS TO BUILD IN N8N

Since we are focusing on **Database-Only Automations**, these 5 workflows will handle all the intelligence for your artisan shop.

---

## 1. The "Order Placed" Workflow
**Goal**: Record a sale and update your inventory automatically.

### The Recipe:
1.  **Webhook Node**: Set it to "POST" and "Production".
2.  **PostgreSQL Node (Insert)**: Connect it to the Webhook.
    -   Table: `orders`
    -   **Columns to Fill**:
        -   `order_number`: Drag `orderNumber` from the Webhook.
        -   `total_amount`: Drag `totalAmount` from the Webhook.
        -   **`customer_id`**: Type `1` manually (This links to the sample customer).
        -   **`artisan_id`**: Type `2` manually (This links to the sample artisan).
3.  **PostgreSQL Node (Update)**: Connect it to the previous node.
    -   Table: `products`
    -   **Action**: Update.
    -   **Column to Match On**: `title` (since we don't have the DB ID from the website).
    -   **Value of Match Column**: Drag `items[0].title` from Webhook.
    -   **Column to Update**: `stock_quantity` -> Expression: `{{ $node["Webhook"].json["body"]["previousStock"] }}` (Or just manually set it to reduce by 1).

---

## 2. The "New Review" Workflow
**Goal**: Capture customer feedback and update product ratings.

### The Recipe:
1.  **Webhook Node**: Receives the rating (1-5) and the comment.
2.  **PostgreSQL Node (Insert)**: 
    -   Table: `reviews`
    -   Action: Add the review text and rating.
3.  **PostgreSQL Node (Update)**:
    -   Table: `products`
    -   Action: Update the `avg_rating` for that product.

---

## 3. The "Support Ticket" Workflow
**Goal**: Turn "Contact Us" submissions into tasks you can manage.

### The Recipe:
1.  **Webhook Node**: Listens for the Contact Form submission.
2.  **PostgreSQL Node (Insert)**:
    -   Table: `support_tickets`
    -   Action: Save the subject, name, and message with status `open`.

---

## 4. The "Product Launch" Workflow
**Goal**: Notify your system when you add a new handmade item.

### The Recipe:
1.  **Webhook Node**: Listens for the "Add Product" button from your dashboard.
2.  **PostgreSQL Node (Insert)**:
    -   Table: `products`
    -   Action: Add the title, price, and description.
3.  **PostgreSQL Node (Log)**:
    -   Table: `automation_logs`
    -   Action: Write "New product [Title] launched successfully."

---

## 5. The "Nightly Sales Report"
**Goal**: Calculate your total revenue every 24 hours.

### The Recipe:
1.  **Schedule Node**: Set it to run every day at **23:59 (11:59 PM)**.
2.  **PostgreSQL Node (Query)**:
    -   SQL: `SELECT SUM(total_amount) FROM orders WHERE created_at >= NOW() - INTERVAL '24 hours'`
3.  **PostgreSQL Node (Insert)**:
    -   Table: `sales_reports`
    -   Action: Save that total sum so you can see it on your dashboard tomorrow morning.

---

## 💡 PRO TIPS FOR BUILDING
-   **Production vs Test**: In n8n, remember to use the **Production URL** in your code (found in `js/n8n-webhooks.js`) once you've finished testing.
-   **Connecting Nodes**: Just click the gray circle on the right of one node and drag the line to the left circle of the next node.
-   **Columns**: In the PostgreSQL nodes, n8n will show you a list of your database columns. Just pick the ones you want to fill!

## ❓ COMMON QUESTIONS

### "Do I have to fill ALL the parameters?"
**Not all of them, but you MUST fill the "Required" ones.**
-   **Required**: `customer_id`, `artisan_id`, `total_amount`, `order_number`.
-   **Why?** The database is strict. It won't let you save an order if it doesn't know WHO bought it (`customer_id`).
-   **The Cheat Code**: For now, just type **`1`** for `customer_id` and **`2`** for `artisan_id`. This uses the "Sample Users" we created so your test will always work!

**You're all set! Start with Workflow #1, it's the most important!** 🚀
