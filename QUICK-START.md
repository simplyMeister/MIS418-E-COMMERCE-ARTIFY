# N8N AUTOMATION - QUICK START GUIDE

## 🚀 GET STARTED IN 5 STEPS

### STEP 1: Set Up Your Database (5 minutes)

**Option A: Railway.app (Recommended - Free tier available)**
1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Provision MySQL"
4. Copy your database credentials
5. Use their web SQL editor to run `database/schema.sql`

**Option B: Supabase (Alternative)**
1. Go to https://supabase.com
2. Create new project
3. Go to SQL Editor
4. Paste and run `database/schema.sql`

**Your Database Credentials:**
```
Host: _________________
Port: _________________
Database: _____________
Username: _____________
Password: _____________
```

---

### STEP 2: Set Up n8n Cloud (10 minutes)

1. **Sign Up**: https://n8n.io/cloud
   - Free tier: 5,000 workflow executions/month
   - No credit card required

2. **Create Your First Workflow**:
   - Click "+ New Workflow"
   - Name it: "Order Placed"
   - Add Webhook node (this will be your trigger)
   - Copy the webhook URL

3. **Add Database Credential**:
   - Click "Credentials" in left sidebar
   - Add "MySQL" credential
   - Enter your database details from Step 1

---

### STEP 3: Set Up Email Service (5 minutes)

**SendGrid (Recommended - Free 100 emails/day)**
1. Go to https://sendgrid.com
2. Sign up for free account
3. Create API Key:
   - Settings → API Keys → Create API Key
   - Name: "Artify Automation"
   - Full Access
4. Copy API Key

**Add to n8n**:
- Go to n8n Credentials
- Add "SendGrid" credential
- Paste API Key

---

### STEP 4: Update Webhook URLs (2 minutes)

1. Open `js/n8n-webhooks.js`
2. Replace ALL webhook URLs with your n8n webhooks:

```javascript
this.webhooks = {
    orderPlaced: 'YOUR_N8N_WEBHOOK_URL_HERE',
    // ... update all URLs
};
```

**Where to find webhook URLs:**
- In n8n, click on Webhook node
- Copy "Production URL"
- Paste into n8n-webhooks.js

---

### STEP 5: Test Your First Automation (3 minutes)

**Test Order Placed Workflow:**

1. In n8n, create this simple workflow:
   ```
   Webhook → SendGrid (Send Email)
   ```

2. Configure SendGrid node:
   - To Email: your-email@example.com
   - From Email: noreply@artify.com
   - Subject: `New Order #{{$json["order"]["orderNumber"]}}`
   - Text: `Order received from {{$json["order"]["customer"]["name"]}}`

3. Test from browser console:
   ```javascript
   const handler = new N8NWebhookHandler();
   handler.triggerOrderPlaced({
       orderId: 1,
       orderNumber: 'TEST-001',
       customerEmail: 'customer@test.com',
       customerName: 'Test Customer',
       artisanEmail: 'artisan@test.com',
       artisanName: 'Test Artisan',
       shopName: 'Test Shop',
       items: [{title: 'Test Product', quantity: 1, price: 100}],
       totalAmount: 100,
       shippingAddress: '123 Test St',
       paymentMethod: 'credit_card'
   });
   ```

4. Check your email! 📧

---

## 📋 WORKFLOW TEMPLATES (Copy & Paste)

### Template 1: Order Confirmation Email

**n8n Workflow:**
1. Webhook (Trigger)
2. SendGrid (Send Email)

**SendGrid Configuration:**
```
To: {{$json["order"]["customer"]["email"]}}
From: noreply@artify.com
Subject: Order Confirmation #{{$json["order"]["orderNumber"]}}

Body:
Hi {{$json["order"]["customer"]["name"]}},

Thank you for your order!

Order Number: {{$json["order"]["orderNumber"]}}
Total Amount: ${{$json["order"]["totalAmount"]}}

We'll send you a shipping notification once your order ships.

Best regards,
The Artify Team
```

---

### Template 2: Low Stock Alert

**n8n Workflow:**
1. Schedule Trigger (Daily at 8 AM)
2. MySQL (Query low stock products)
3. IF (stock < threshold)
4. SendGrid (Alert artisan)

**MySQL Query:**
```sql
SELECT 
    p.product_id,
    p.title,
    p.stock_quantity,
    p.low_stock_threshold,
    u.email as artisan_email,
    u.full_name as artisan_name
FROM products p
JOIN artisan_profiles ap ON p.artisan_id = ap.artisan_id
JOIN users u ON ap.user_id = u.user_id
WHERE p.stock_quantity <= p.low_stock_threshold
AND p.is_active = TRUE
```

---

### Template 3: Welcome Email

**n8n Workflow:**
1. Webhook (Trigger)
2. MySQL (Insert user)
3. SendGrid (Welcome email)

**SendGrid Configuration:**
```
To: {{$json["user"]["email"]}}
Subject: Welcome to Artify!

Body:
Hi {{$json["user"]["fullName"]}},

Welcome to Artify! We're thrilled to have you join our community.

Start exploring unique handcrafted items: https://artify.com

Best regards,
The Artify Team
```

---

## 🔧 TROUBLESHOOTING

### Webhook not triggering?
- ✅ Check webhook URL is correct in n8n-webhooks.js
- ✅ Workflow is activated in n8n (toggle switch)
- ✅ Check browser console for errors

### Email not sending?
- ✅ Verify SendGrid API key
- ✅ Check SendGrid dashboard for errors
- ✅ Verify sender email is verified in SendGrid

### Database connection failed?
- ✅ Check database credentials
- ✅ Ensure database is running
- ✅ Check firewall/network settings

---

## 📊 MONITORING

**Check Automation Logs:**
```sql
SELECT * FROM automation_logs 
ORDER BY created_at DESC 
LIMIT 50;
```

**Check Failed Automations:**
```sql
SELECT * FROM automation_logs 
WHERE status = 'failed' 
ORDER BY created_at DESC;
```

---

## 🎯 RECOMMENDED WORKFLOW ORDER

Start with these workflows first:

1. ✅ **Order Placed** (Most important)
2. ✅ **User Registration** (Welcome emails)
3. ✅ **Low Stock Alert** (Inventory management)
4. ✅ **Payment Confirmation** (Trust building)
5. ✅ **Abandoned Cart** (Revenue recovery)

Then add:
6. Sales Reports
7. Review Notifications
8. Marketing Campaigns
9. Social Media Automation
10. Support Tickets

---

## 💡 PRO TIPS

1. **Test in n8n first** - Use "Execute Workflow" button
2. **Start simple** - Begin with email-only workflows
3. **Monitor logs** - Check automation_logs table daily
4. **Use templates** - Copy successful workflows
5. **Batch operations** - Process 100 emails at a time

---

## 📞 NEED HELP?

**Resources:**
- n8n Community: https://community.n8n.io
- n8n Docs: https://docs.n8n.io
- SendGrid Support: https://support.sendgrid.com

**Common Issues:**
- Webhook 404: Workflow not activated
- Email bounce: Invalid email address
- Database timeout: Too many connections

---

## ✅ CHECKLIST

Before going live:

- [ ] Database schema created
- [ ] n8n account set up
- [ ] SendGrid configured
- [ ] Webhook URLs updated
- [ ] Test workflows executed
- [ ] Email templates customized
- [ ] Monitoring set up
- [ ] Error handling tested

---

🎉 **You're ready to automate!**

Start with the Order Placed workflow and expand from there.
