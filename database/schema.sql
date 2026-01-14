-- Artisan E-commerce Database Schema (PostgreSQL / Supabase Version)
-- This schema supports all n8n automation workflows

-- ============================================
-- EXTENSIONS & HELPER FUNCTIONS
-- ============================================

-- Create a function to help with updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- ENUM TYPES
-- ============================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'artisan');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE p_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE campaign_type AS ENUM ('email', 'social', 'promotion');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE campaign_status AS ENUM ('draft', 'scheduled', 'sent', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE auto_status AS ENUM ('success', 'failed', 'pending');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE inv_change_type AS ENUM ('sale', 'restock', 'adjustment', 'return');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    user_type user_role NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    newsletter_subscribed BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);

-- ============================================
-- ARTISAN PROFILES
-- ============================================

CREATE TABLE IF NOT EXISTS artisan_profiles (
    artisan_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT UNIQUE NOT NULL,
    shop_name VARCHAR(255) NOT NULL,
    tagline VARCHAR(500),
    description TEXT,
    location VARCHAR(255),
    website VARCHAR(255),
    profile_picture VARCHAR(500),
    instagram VARCHAR(100),
    facebook VARCHAR(255),
    pinterest VARCHAR(100),
    tiktok VARCHAR(100),
    total_sales DECIMAL(10, 2) DEFAULT 0.00,
    avg_rating DECIMAL(3, 2) DEFAULT 0.00,
    shop_views INT DEFAULT 0,
    member_since DATE NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================
-- PRODUCTS
-- ============================================

CREATE TABLE IF NOT EXISTS products (
    product_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    artisan_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    stock_quantity INT DEFAULT 0,
    low_stock_threshold INT DEFAULT 5,
    main_image VARCHAR(500),
    rating DECIMAL(3, 2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_artisan FOREIGN KEY (artisan_id) REFERENCES artisan_profiles(artisan_id) ON DELETE CASCADE
);

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_products_artisan ON products(artisan_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

CREATE TABLE IF NOT EXISTS product_images (
    image_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0,
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_variants (
    variant_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_id BIGINT NOT NULL,
    variant_type VARCHAR(50), -- 'color', 'size', etc.
    variant_value VARCHAR(100),
    price_adjustment DECIMAL(10, 2) DEFAULT 0.00,
    stock_quantity INT DEFAULT 0,
    CONSTRAINT fk_variant_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- ============================================
-- ORDERS
-- ============================================

CREATE TABLE IF NOT EXISTS orders (
    order_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id BIGINT NOT NULL,
    artisan_id BIGINT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status order_status DEFAULT 'pending',
    payment_status p_status DEFAULT 'pending',
    payment_method VARCHAR(50),
    shipping_address TEXT,
    shipping_cost DECIMAL(10, 2) DEFAULT 0.00,
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES users(user_id),
    CONSTRAINT fk_order_artisan FOREIGN KEY (artisan_id) REFERENCES artisan_profiles(artisan_id)
);

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_artisan ON orders(artisan_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

CREATE TABLE IF NOT EXISTS order_items (
    item_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    variant_details JSONB,
    CONSTRAINT fk_item_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- ============================================
-- CART (for abandoned cart tracking)
-- ============================================

CREATE TABLE IF NOT EXISTS shopping_carts (
    cart_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT,
    session_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_abandoned BOOLEAN DEFAULT FALSE,
    abandoned_at TIMESTAMPTZ,
    reminder_sent BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON shopping_carts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_carts_user ON shopping_carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_abandoned ON shopping_carts(is_abandoned, reminder_sent);

CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_cart_item_cart FOREIGN KEY (cart_id) REFERENCES shopping_carts(cart_id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_item_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- ============================================
-- REVIEWS
-- ============================================

CREATE TABLE IF NOT EXISTS reviews (
    review_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    order_id BIGINT,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_review_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_review_order FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

-- ============================================
-- PAYMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS payments (
    payment_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    order_id BIGINT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    status auto_status DEFAULT 'pending',
    payment_gateway VARCHAR(50), -- 'stripe', 'paypal', etc.
    gateway_response JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_payment_order FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

CREATE TABLE IF NOT EXISTS invoices (
    invoice_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    order_id BIGINT NOT NULL,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_url VARCHAR(500),
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    CONSTRAINT fk_invoice_order FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE INDEX IF NOT EXISTS idx_invoices_order ON invoices(order_id);

-- ============================================
-- SUPPORT TICKETS
-- ============================================

CREATE TABLE IF NOT EXISTS support_tickets (
    ticket_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ticket_status DEFAULT 'open',
    priority ticket_priority DEFAULT 'medium',
    assigned_to BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    CONSTRAINT fk_ticket_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);

CREATE TABLE IF NOT EXISTS ticket_messages (
    message_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    ticket_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    is_staff_reply BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_msg_ticket FOREIGN KEY (ticket_id) REFERENCES support_tickets(ticket_id) ON DELETE CASCADE,
    CONSTRAINT fk_msg_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- ============================================
-- NEWSLETTER & MARKETING
-- ============================================

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    subscriber_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_id BIGINT,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    unsubscribed_at TIMESTAMPTZ,
    CONSTRAINT fk_sub_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX IF NOT EXISTS idx_subs_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subs_active ON newsletter_subscribers(is_active);

CREATE TABLE IF NOT EXISTS marketing_campaigns (
    campaign_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    campaign_name VARCHAR(255) NOT NULL,
    campaign_type campaign_type NOT NULL,
    subject VARCHAR(255),
    content TEXT,
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    status campaign_status DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON marketing_campaigns(status);

CREATE TABLE IF NOT EXISTS campaign_recipients (
    recipient_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    campaign_id BIGINT NOT NULL,
    email VARCHAR(255) NOT NULL,
    sent_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    CONSTRAINT fk_recipient_campaign FOREIGN KEY (campaign_id) REFERENCES marketing_campaigns(campaign_id) ON DELETE CASCADE
);

-- ============================================
-- NOTIFICATIONS & AUTOMATION LOGS
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
    notification_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'order', 'review', 'low_stock', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_notify_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notify_user_read ON notifications(user_id, is_read);

CREATE TABLE IF NOT EXISTS automation_logs (
    log_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    workflow_name VARCHAR(255) NOT NULL,
    trigger_type VARCHAR(100),
    entity_type VARCHAR(50), -- 'order', 'user', 'product', etc.
    entity_id BIGINT,
    status auto_status DEFAULT 'pending',
    error_message TEXT,
    n8n_execution_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auto_workflow ON automation_logs(workflow_name);
CREATE INDEX IF NOT EXISTS idx_auto_status ON automation_logs(status);
CREATE INDEX IF NOT EXISTS idx_auto_created ON automation_logs(created_at);

-- ============================================
-- INVENTORY TRACKING
-- ============================================

CREATE TABLE IF NOT EXISTS inventory_logs (
    log_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_id BIGINT NOT NULL,
    change_type inv_change_type NOT NULL,
    quantity_change INT NOT NULL,
    previous_quantity INT,
    new_quantity INT,
    order_id BIGINT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_inv_product FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT fk_inv_order FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE INDEX IF NOT EXISTS idx_inv_product ON inventory_logs(product_id);

-- ============================================
-- ANALYTICS & REPORTS
-- ============================================

CREATE TABLE IF NOT EXISTS sales_reports (
    report_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    artisan_id BIGINT NOT NULL,
    report_period VARCHAR(20), -- 'daily', 'weekly', 'monthly'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_sales DECIMAL(10, 2),
    total_orders INT,
    total_revenue DECIMAL(10, 2),
    report_data JSONB,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    CONSTRAINT fk_report_artisan FOREIGN KEY (artisan_id) REFERENCES artisan_profiles(artisan_id)
);

CREATE INDEX IF NOT EXISTS idx_reports_artisan_period ON sales_reports(artisan_id, period_start);

-- ============================================
-- SAMPLE DATA FOR TESTING
-- ============================================

-- Insert sample customer
INSERT INTO users (email, password_hash, full_name, user_type, newsletter_subscribed) 
VALUES ('customer@example.com', '$2b$10$sample_hash', 'John Customer', 'customer', TRUE);

-- Insert sample artisan
INSERT INTO users (email, password_hash, full_name, user_type) 
VALUES ('sarah@ceramics.com', '$2b$10$sample_hash', 'Sarah Anderson', 'artisan');

INSERT INTO artisan_profiles (user_id, shop_name, tagline, description, location, member_since)
VALUES (2, 'Sarah''s Ceramics', 'Handcrafted ceramic art for your home', 
        'I''m a ceramic artist based in Portland, Oregon. Each piece is handmade with care.', 
        'Portland, Oregon', CURRENT_DATE);
