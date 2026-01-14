# N8N Automation Workflows Setup Guide

This guide will help you set up all 5 automation workflows in n8n cloud.

## 📋 Prerequisites

1. **Sign up for n8n Cloud**: https://n8n.io/cloud
2. **Email Service**: Sign up for SendGrid (https://sendgrid.com) or similar
3. **Database**: Set up MySQL/PostgreSQL database (use Railway.app, PlanetScale, or Supabase)
4. **Payment Gateway**: Stripe account (https://stripe.com)

---

## 🔧 Setup Steps

### Step 1: Create Database
1. Go to https://railway.app or https://supabase.com
2. Create a new MySQL/PostgreSQL database
3. Run the `database/schema.sql` file to create all tables
4. Save your database connection details

### Step 2: Configure n8n
1. Log into n8n Cloud
2. Go to Settings → Credentials
3. Add credentials for:
   - **MySQL/PostgreSQL** (your database)
   - **SendGrid** (email service)
   - **Stripe** (payment processing)
   - **Social Media APIs** (Instagram, Facebook, Twitter)

---

## 🚀 Workflow 1: ORDER PROCESSING & NOTIFICATIONS

### Workflow Name: `order-placed`

**Trigger**: Webhook
- URL: Copy this webhook URL and update in `js/n8n-webhooks.js`

**Nodes**:
1. **Webhook** (Trigger)
   - Method: POST
   - Path: `/order-placed`

2. **MySQL - Insert Order**
   - Operation: Insert
   - Table: `orders`
   - Columns: Map from webhook data

3. **Split Into Batches** (for multiple items)
   - Batch Size: 1

4. **MySQL - Insert Order Items**
   - Operation: Insert
   - Table: `order_items`

5. **MySQL - Update Inventory**
   - Operation: Update
   - Table: `products`
   - Decrease stock_quantity

6. **SendGrid - Customer Confirmation**
   - To: `{{$json["order"]["customer"]["email"]}}`
   - Subject: `Order Confirmation #{{$json["order"]["orderNumber"]}}`
   - Template: Order confirmation email

7. **SendGrid - Artisan Notification**
   - To: `{{$json["order"]["artisan"]["email"]}}`
   - Subject: `New Order Received #{{$json["order"]["orderNumber"]}}`
   - Template: New order notification

8. **MySQL - Log Automation**
   - Operation: Insert
   - Table: `automation_logs`

---

### Workflow Name: `order-status-update`

**Trigger**: Webhook

**Nodes**:
1. **Webhook** (Trigger)
2. **MySQL - Update Order Status**
3. **IF - Check if Shipped**
   - Condition: `newStatus === 'shipped'`
4. **SendGrid - Shipping Notification**
   - Subject: `Your Order Has Shipped! #{{$json["orderNumber"]}}`
   - Include tracking number

---

## 🚀 Workflow 2: CUSTOMER MANAGEMENT

### Workflow Name: `user-registration`

**Nodes**:
1. **Webhook** (Trigger)
2. **MySQL - Insert User**
3. **SendGrid - Welcome Email**
   - Template: Welcome email with account details
4. **IF - Newsletter Subscribed**
5. **MySQL - Add to Newsletter**

---

### Workflow Name: `abandoned-cart`

**Trigger**: Cron (runs every hour)

**Nodes**:
1. **Cron** (Every hour)
2. **MySQL - Find Abandoned Carts**
   ```sql
   SELECT * FROM shopping_carts 
   WHERE updated_at < NOW() - INTERVAL 2 HOUR 
   AND is_abandoned = FALSE 
   AND reminder_sent = FALSE
   ```
3. **MySQL - Mark as Abandoned**
4. **MySQL - Get Cart Items**
5. **SendGrid - Abandoned Cart Email**
   - Subject: `You left items in your cart!`
   - Include cart items and checkout link

---

### Workflow Name: `support-ticket`

**Nodes**:
1. **Webhook** (Trigger)
2. **MySQL - Insert Ticket**
3. **SendGrid - Customer Acknowledgment**
4. **SendGrid - Notify Support Team**
5. **Slack/Discord - Team Notification** (optional)

---

## 🚀 Workflow 3: ARTISAN DASHBOARD

### Workflow Name: `sales-report-monthly`

**Trigger**: Cron (1st of every month at 9 AM)

**Nodes**:
1. **Cron** (Monthly)
2. **MySQL - Get All Artisans**
3. **Split Into Batches**
4. **MySQL - Calculate Sales**
   ```sql
   SELECT 
     COUNT(*) as total_orders,
     SUM(total_amount) as total_revenue
   FROM orders 
   WHERE artisan_id = {{$json["artisan_id"]}}
   AND created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
   ```
5. **MySQL - Get Top Products**
6. **MySQL - Insert Report**
7. **SendGrid - Send Report**
   - Attach PDF report

---

### Workflow Name: `low-stock-alert`

**Trigger**: Cron (Daily at 8 AM)

**Nodes**:
1. **Cron** (Daily)
2. **MySQL - Find Low Stock Products**
   ```sql
   SELECT p.*, a.email as artisan_email 
   FROM products p
   JOIN artisan_profiles ap ON p.artisan_id = ap.artisan_id
   JOIN users a ON ap.user_id = a.user_id
   WHERE p.stock_quantity <= p.low_stock_threshold
   AND p.is_active = TRUE
   ```
3. **Split Into Batches**
4. **SendGrid - Low Stock Alert**

---

### Workflow Name: `new-review`

**Nodes**:
1. **Webhook** (Trigger)
2. **MySQL - Insert Review**
3. **MySQL - Update Product Rating**
4. **SendGrid - Notify Artisan**
5. **IF - Rating >= 4**
6. **Social Media - Share Review** (optional)

---

## 🚀 Workflow 4: PAYMENT PROCESSING

### Workflow Name: `payment-confirmed`

**Nodes**:
1. **Webhook** (Trigger)
2. **MySQL - Insert Payment**
3. **MySQL - Update Order Payment Status**
4. **SendGrid - Payment Confirmation**
5. **Trigger - Generate Invoice Workflow**

---

### Workflow Name: `generate-invoice`

**Nodes**:
1. **Webhook** (Trigger)
2. **HTTP Request - Generate PDF**
   - Use service like PDFMonkey or DocRaptor
3. **MySQL - Insert Invoice**
4. **SendGrid - Send Invoice**
   - Attach PDF

---

### Workflow Name: `process-refund`

**Nodes**:
1. **Webhook** (Trigger)
2. **Stripe - Create Refund**
3. **MySQL - Update Payment Status**
4. **MySQL - Update Order Status**
5. **SendGrid - Refund Confirmation**

---

## 🚀 Workflow 5: MARKETING AUTOMATION

### Workflow Name: `product-launch`

**Nodes**:
1. **Webhook** (Trigger)
2. **MySQL - Get Newsletter Subscribers**
3. **SendGrid - Product Launch Email**
4. **Instagram API - Create Post**
5. **Facebook API - Create Post**
6. **Twitter API - Create Tweet**

---

### Workflow Name: `campaign-trigger`

**Nodes**:
1. **Webhook** (Trigger)
2. **MySQL - Get Campaign Recipients**
3. **Split Into Batches** (100 per batch)
4. **SendGrid - Send Campaign Email**
5. **MySQL - Log Campaign Sent**

---

### Workflow Name: `social-post-scheduler`

**Trigger**: Cron (checks every hour)

**Nodes**:
1. **Cron** (Hourly)
2. **MySQL - Get Scheduled Posts**
   ```sql
   SELECT * FROM marketing_campaigns 
   WHERE status = 'scheduled' 
   AND scheduled_at <= NOW()
   AND campaign_type = 'social'
   ```
3. **Switch - Platform**
   - Instagram
   - Facebook
   - Twitter
4. **API Calls** (based on platform)
5. **MySQL - Update Status**

---

## 📧 Email Templates

### Order Confirmation
```html
Subject: Order Confirmation #{{orderNumber}}

Hi {{customerName}},

Thank you for your order! We've received your order and will process it shortly.

Order Details:
- Order Number: {{orderNumber}}
- Total: {{totalAmount}}
- Items: {{itemsList}}

Shipping Address:
{{shippingAddress}}

Track your order: {{trackingUrl}}

Best regards,
The Artify Team
```

### Welcome Email
```html
Subject: Welcome to Artify!

Hi {{fullName}},

Welcome to Artify! We're excited to have you join our community of artisan craft lovers.

Explore our collection: {{siteUrl}}

Best regards,
The Artify Team
```

---

## 🔗 Integration Code

Add this to your website to trigger workflows:

```javascript
// Import the webhook handler
const webhookHandler = new N8NWebhookHandler();

// Example: Trigger order placed
async function placeOrder(orderData) {
    const result = await webhookHandler.triggerOrderPlaced(orderData);
    if (result.success) {
        console.log('Order automation triggered successfully');
    }
}

// Example: Trigger user registration
async function registerUser(userData) {
    const result = await webhookHandler.triggerUserRegistration(userData);
}
```

---

## 📊 Testing Your Workflows

1. In n8n, click "Execute Workflow" to test
2. Send test data from your website
3. Check automation_logs table for results
4. Monitor email delivery in SendGrid dashboard

---

## 🎯 Next Steps

1. ✅ Set up database using schema.sql
2. ✅ Create n8n account and workflows
3. ✅ Update webhook URLs in n8n-webhooks.js
4. ✅ Configure email templates
5. ✅ Test each workflow
6. ✅ Monitor and optimize

---

## 📞 Support

For issues or questions:
- n8n Documentation: https://docs.n8n.io
- SendGrid Docs: https://docs.sendgrid.com
- Stripe Docs: https://stripe.com/docs
