# 🤖 YOUR ARTIFY AUTOMATION GUIDE (For Beginners)

If you're wondering, *"What is n8n actually doing if I'm not sending emails?"*, this guide is for you. Think of n8n as the **"invisible manager"** of your shop that handles all the boring paperwork so you don't have to.

---

## 🌟 WHAT AM I USING N8N FOR?

Even without emails, n8n is doing the heavy lifting behind the scenes. Here are the 3 main "Jobs" it does for your website:

### 1. The Inventory Manager 📦
When someone buys a "Ceramic Bowl" on your site, n8n immediately wakes up. It goes to your database (Supabase) and says: *"Hey, we just sold one! Change the stock from 10 to 9."*
*   **Why?** So you never accidentally sell something you don't have.

### 2. The Secretary 📝
Every time a customer fills out the "Contact Us" form or leaves a review, n8n catches that information and neatly files it into your database tables.
*   **Why?** So you can see everything in your Artisan Dashboard without checking 10 different places.

### 3. The Business Analyst 📊
Every night (or whenever you want), n8n can look at all your sales and calculate your profit, total orders, and best-selling products. 
*   **Why?** To give you those "Total Sales" numbers on your dashboard.

---

## 🛠️ HOW TO SET IT UP (Step-by-Step)

Don't worry about code! We're just going to "connect the dots."

### 🛠️ FIXING THE "ENETUNREACH" ERROR
If you got a red error in n8n, it's because n8n Cloud is trying to use a new type of internet address (IPv6) that doesn't always work. **We can fix this by using the Supabase "Pooler" instead.**

### STEP 1: Get the "Pooler" Details (IPv4)
1. Go to **Supabase** -> **Settings (Gear Icon)** -> **Database**.
2. Scroll to the **Connection Pooler** section.
3. Make sure the toggle is **ON**.
4. Change the "Mode" to **Transaction**.
5. Copy these NEW details:
   - **Host**: It should look like `aws-0-...pooler.supabase.com`
   - **Database**: `postgres`
   - **Port**: **6543** (IMPORTANT: This changes from 5432!)
   - **User**: `postgres.ocqtqkmzasjpbbqsutyi` (Use the full user string shown there!)
   - **Password**: `RKMRiqaaOlturedteNsSzXJLWcGEKRLk`

### STEP 2: Update n8n Credentials
1. Go back to n8n and open your PostgreSQL credential.
2. Replace the **Host**, **Port**, and **User** with the new ones from Step 1.
3. Make sure **SSL** is turned **ON**.
4. Click **Save** and it should turn Green! ✅

### STEP 2: Connect n8n to your Database
1. Open your [n8n Cloud](https://n8n.io/cloud) account.
2. On the left, click **Credentials**.
3. Click **Add Credential** and search for **PostgreSQL**.
4. Paste those 5 things from Step 1 into the boxes.
5. Click **Save**. If it turns green, you're connected!

### STEP 3: Create your first "Workflow"
Think of a workflow like a **recipe**: *"When [This Happens], do [That]."*

**Recipe: The "Update Stock" Workflow**
1. Click **+ New Workflow**.
2. Add a **Webhook** node (This is the ear that listens for your website).
3. Add a **Postgres** node (This is the hand that writes to the database).
4. Set the Postgres node to `Update` the `products` table.
5. Connect them with a line.

### STEP 4: Test it!
1. Go to your Artify website.
2. Go to the Checkout page and click "Complete Purchase."
3. Go back to n8n. You should see a little green checkmark.
4. Check your Supabase database—your stock number should have gone down!

---

## 💡 SUMMARY OF THE "VIBE"
You aren't coding these automations; you are **building a flow**. It's like building with LEGO blocks. 

- **Trigger Block**: "Someone bought something."
- **Action Block**: "Subtract 1 from stock."
- **Logging Block**: "Write this down in the History table."

**You're now running a professional, automated e-commerce store!** 🚀
