-- Artisan E-commerce Database Schema
-- This schema supports all n8n automation workflows

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    user_type ENUM('customer', 'artisan') NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    newsletter_subscribed BOOLEAN DEFAULT FALSE,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type)
);

-- ============================================
-- ARTISAN PROFILES
-- ============================================

CREATE TABLE artisan_profiles (
    artisan_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
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
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================
-- PRODUCTS
-- ============================================

CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    artisan_id INT NOT NULL,
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (artisan_id) REFERENCES artisan_profiles(artisan_id) ON DELETE CASCADE,
    INDEX idx_artisan (artisan_id),
    INDEX idx_category (category),
    INDEX idx_active (is_active)
);

CREATE TABLE product_images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

CREATE TABLE product_variants (
    variant_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    variant_type VARCHAR(50), -- 'color', 'size', etc.
    variant_value VARCHAR(100),
    price_adjustment DECIMAL(10, 2) DEFAULT 0.00,
    stock_quantity INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- ============================================
-- ORDERS
-- ============================================

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT NOT NULL,
    artisan_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    shipping_address TEXT,
    shipping_cost DECIMAL(10, 2) DEFAULT 0.00,
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    shipped_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    FOREIGN KEY (customer_id) REFERENCES users(user_id),
    FOREIGN KEY (artisan_id) REFERENCES artisan_profiles(artisan_id),
    INDEX idx_customer (customer_id),
    INDEX idx_artisan (artisan_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
);

CREATE TABLE order_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    variant_details JSON,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- ============================================
-- CART (for abandoned cart tracking)
-- ============================================

CREATE TABLE shopping_carts (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_abandoned BOOLEAN DEFAULT FALSE,
    abandoned_at TIMESTAMP NULL,
    reminder_sent BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_abandoned (is_abandoned, reminder_sent)
);

CREATE TABLE cart_items (
    cart_item_id INT PRIMARY KEY AUTO_INCREMENT,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES shopping_carts(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- ============================================
-- REVIEWS
-- ============================================

CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    INDEX idx_product (product_id),
    INDEX idx_user (user_id)
);

-- ============================================
-- PAYMENTS
-- ============================================

CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_gateway VARCHAR(50), -- 'stripe', 'paypal', etc.
    gateway_response JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    INDEX idx_order (order_id),
    INDEX idx_status (status)
);

CREATE TABLE invoices (
    invoice_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_url VARCHAR(500),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    INDEX idx_order (order_id)
);

-- ============================================
-- SUPPORT TICKETS
-- ============================================

CREATE TABLE support_tickets (
    ticket_id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    assigned_to INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_user (user_id),
    INDEX idx_status (status)
);

CREATE TABLE ticket_messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    is_staff_reply BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES support_tickets(ticket_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- ============================================
-- NEWSLETTER & MARKETING
-- ============================================

CREATE TABLE newsletter_subscribers (
    subscriber_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_id INT,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    unsubscribed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_email (email),
    INDEX idx_active (is_active)
);

CREATE TABLE marketing_campaigns (
    campaign_id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_name VARCHAR(255) NOT NULL,
    campaign_type ENUM('email', 'social', 'promotion') NOT NULL,
    subject VARCHAR(255),
    content TEXT,
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP NULL,
    status ENUM('draft', 'scheduled', 'sent', 'cancelled') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status)
);

CREATE TABLE campaign_recipients (
    recipient_id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    sent_at TIMESTAMP NULL,
    opened_at TIMESTAMP NULL,
    clicked_at TIMESTAMP NULL,
    FOREIGN KEY (campaign_id) REFERENCES marketing_campaigns(campaign_id) ON DELETE CASCADE
);

-- ============================================
-- NOTIFICATIONS & AUTOMATION LOGS
-- ============================================

CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'order', 'review', 'low_stock', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read)
);

CREATE TABLE automation_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    workflow_name VARCHAR(255) NOT NULL,
    trigger_type VARCHAR(100),
    entity_type VARCHAR(50), -- 'order', 'user', 'product', etc.
    entity_id INT,
    status ENUM('success', 'failed', 'pending') DEFAULT 'pending',
    error_message TEXT,
    n8n_execution_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_workflow (workflow_name),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
);

-- ============================================
-- INVENTORY TRACKING
-- ============================================

CREATE TABLE inventory_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    change_type ENUM('sale', 'restock', 'adjustment', 'return') NOT NULL,
    quantity_change INT NOT NULL,
    previous_quantity INT,
    new_quantity INT,
    order_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    INDEX idx_product (product_id)
);

-- ============================================
-- ANALYTICS & REPORTS
-- ============================================

CREATE TABLE sales_reports (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    artisan_id INT NOT NULL,
    report_period VARCHAR(20), -- 'daily', 'weekly', 'monthly'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_sales DECIMAL(10, 2),
    total_orders INT,
    total_revenue DECIMAL(10, 2),
    report_data JSON,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP NULL,
    FOREIGN KEY (artisan_id) REFERENCES artisan_profiles(artisan_id),
    INDEX idx_artisan_period (artisan_id, period_start)
);

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
VALUES (2, 'Sarah\'s Ceramics', 'Handcrafted ceramic art for your home', 
        'I\'m a ceramic artist based in Portland, Oregon. Each piece is handmade with care.', 
        'Portland, Oregon', CURDATE());
