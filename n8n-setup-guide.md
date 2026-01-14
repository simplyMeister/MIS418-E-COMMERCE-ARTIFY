# N8N WORKFLOW SETUP GUIDE (Internal Automations Only)

This guide explains how to set up the n8n workflows for your artisan marketplace focusing on **database logic** and **dashboard updates** (No emails).

---

## 1. Inventory & Orders
### Workflow Name: `order-placed-logic`
**Trigger**: Webhook
**Nodes**:
1. **Webhook**: Receives order data.
2. **PostgreSQL (Update)**: Decrement `stock_quantity` in `products` table.
3. **PostgreSQL (Insert)**: Create row in `orders` and `order_items`.
4. **PostgreSQL (Log)**: Insert success entry into `automation_logs`.

---

## 2. Customer Feedback
### Workflow Name: `new-review-handler`
**Trigger**: Webhook
**Nodes**:
1. **Webhook**: Receives review text and rating.
2. **PostgreSQL (Insert)**: Adds review to `reviews` table.
3. **PostgreSQL (Update)**: Recalculates `avg_rating` in `products` table.

---

## 3. Support & Contact
### Workflow Name: `support-ticket-system`
**Trigger**: Webhook
**Nodes**:
1. **Webhook**: Receives contact form data.
2. **PostgreSQL (Insert)**: Adds new ticket to `support_tickets` table.
3. **PostgreSQL (Notify)**: (Optional) Sends a Slack/Discord notification to the artisan.

---

## 4. Sales Reporting (Cron Job)
### Workflow Name: `daily-sales-report`
**Trigger**: Schedule (Every night at 11:59 PM)
**Nodes**:
1. **PostgreSQL (Query)**: Select all `orders` from the last 24 hours.
2. **Code Node**: Sum up the totals.
3. **PostgreSQL (Insert)**: Add a new entry to the `sales_reports` table.

---

## 5. Marketing (Internal Launch)
### Workflow Name: `product-launch-logic`
**Trigger**: Webhook
**Nodes**:
1. **Webhook**: Receives new product details.
2. **PostgreSQL (Update)**: Marks product as `is_active` and logs the launch time.

---

## 📝 POSTGRESQL NODE TIPS
- **Resource**: Select "Database".
- **Operation**: Select "Update" or "Insert".
- **Table**: Type the name of the table (e.g., `products`, `orders`).
- **Columns**: Map the data from the Webhook node to the database columns.
