# N8N AUTOMATION - QUICK START GUIDE (Database-First)

## 🚀 GET STARTED IN 4 STEPS

### STEP 1: Set Up Supabase (The Database)
1. Go to https://supabase.com
2. Create a new project named "Artify-DB".
3. Go to the **SQL Editor** in Supabase.
4. Paste the content of `database/schema.sql` and click **Run**.
5. Your tables are now ready!

---

### STEP 2: Connecting n8n to Supabase
1. Sign up for [n8n Cloud](https://n8n.io/cloud).
2. Get your Database credentials from Supabase:
   - **Settings** -> **Database** -> **Connection Info**.
3. In n8n, go to **Credentials** -> **Add Credential** -> **PostgreSQL**.
4. Fill in the Host, Database, User, and Password from Supabase.

---

### STEP 3: Update Your Webhook URLs
1. In n8n, every workflow will give you a "Production URL".
2. Open `js/n8n-webhooks.js` in your project.
3. Replace the placeholder URLs with your actual n8n URLs:
```javascript
this.webhooks = {
    orderPlaced: 'https://primary-production.n8n.cloud/webhook/...',
    // ... and so on
};
```

---

### STEP 4: Test Your First Data Flow
1. In n8n, create a simple workflow: **Webhook** -> **PostgreSQL**.
2. Configure the PostgreSQL node to `Insert` a row into the `automation_logs` table.
3. From your website's Checkout page, click "Complete Purchase".
4. Check your Supabase `automation_logs` table—you should see a new entry!

---

## 📋 WHY NO EMAIL?
We are focusing on **Database Integrity** and **Artisan Dashboard** updates. n8n will:
- Auto-reduce stock in the database.
- Log every automation success/failure for the dashboard.
- Create support tickets from the contact form.

*Need help? Check [N8N-GUIDE-FOR-BEGINNERS.md](file:///c:/Users/hp/Desktop/418/N8N-GUIDE-FOR-BEGINNERS.md)*
