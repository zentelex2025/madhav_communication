-- ==============================================================================
-- Shri Narayan Telecom - Mobile Shop Billing & Showcase Database Schema
-- Dialect: PostgreSQL
-- ==============================================================================

-- 1. Users Table (Shopkeeper / Admin Authentication)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Shop Settings Table (Header, Contact, GSTIN, Bank, Footer Terms)
CREATE TABLE IF NOT EXISTS shop_settings (
    id SERIAL PRIMARY KEY,
    shop_name VARCHAR(200) NOT NULL DEFAULT 'SHRI NARAYAN TELECOM',
    tagline VARCHAR(255) DEFAULT 'Deals in : All types of Mobile & Accessories',
    address TEXT NOT NULL DEFAULT 'KAZIPUR QUARTER ROAD NO-3 NEAR-RADHE SHYAM MANDIR PATNA-800004',
    phone VARCHAR(50) NOT NULL DEFAULT '8409946197',
    whatsapp_number VARCHAR(50) NOT NULL DEFAULT '918409946197',
    email VARCHAR(150) NOT NULL DEFAULT 'manishkumarmehta97@gmail.com',
    gstin VARCHAR(50) NOT NULL DEFAULT '10DUEPK6618D1Z2',
    hsn_default VARCHAR(50) DEFAULT '85171300',
    salesman_name VARCHAR(100) DEFAULT 'MANISH KUMAR MEHTA',
    bank_name VARCHAR(100) DEFAULT 'STATE BANK OF INDIA',
    account_no VARCHAR(100) DEFAULT '389201948192',
    ifsc_code VARCHAR(50) DEFAULT 'SBIN0001234',
    upi_id VARCHAR(100) DEFAULT '8409946197@upi',
    terms_1 TEXT DEFAULT '1. No Refund after Sale of Any Mobiles.',
    terms_2 TEXT DEFAULT '2. All Subject to "PATNA" Jurisdiction Only.',
    jurisdiction VARCHAR(100) DEFAULT 'PATNA',
    default_gst_percent NUMERIC(5,2) DEFAULT 18.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products Table (Mobile phone catalog)
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(150) NOT NULL,
    variant VARCHAR(100) NOT NULL, -- e.g. '8GB / 256GB'
    color VARCHAR(50) NOT NULL,   -- e.g. 'ICEBLUE'
    condition VARCHAR(20) DEFAULT 'New', -- 'New' or 'Used'
    hsn_code VARCHAR(50) DEFAULT '85171300',
    purchase_price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    selling_price NUMERIC(12,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    warranty_period VARCHAR(100) DEFAULT '1 Year Brand Warranty',
    description TEXT,
    specs JSONB DEFAULT '{}'::jsonb, -- RAM, Storage, Battery, Camera, Display, Processor, 5G
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Product Units Table (Specific IMEI tracking for each physical device)
CREATE TABLE IF NOT EXISTS product_units (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    imei_1 VARCHAR(50) NOT NULL UNIQUE,
    imei_2 VARCHAR(50),
    serial_no VARCHAR(100),
    status VARCHAR(20) DEFAULT 'available', -- 'available', 'sold', 'reserved'
    bill_id INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sold_at TIMESTAMP WITH TIME ZONE
);

-- 6. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    email VARCHAR(150),
    gstin VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Carts Table (POS Active Sessions)
CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL UNIQUE,
    customer_name VARCHAR(150),
    customer_phone VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INT REFERENCES carts(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    unit_id INT REFERENCES product_units(id) ON DELETE SET NULL,
    quantity INT NOT NULL DEFAULT 1,
    rate NUMERIC(12,2) NOT NULL,
    discount NUMERIC(12,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Bills Table (Tax Invoices)
CREATE TABLE IF NOT EXISTS bills (
    id SERIAL PRIMARY KEY,
    invoice_no VARCHAR(50) NOT NULL UNIQUE,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    customer_id INT REFERENCES customers(id),
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_address TEXT,
    customer_gstin VARCHAR(50),
    sales_man VARCHAR(100) DEFAULT 'MANISH KUMAR MEHTA',
    sub_total NUMERIC(12,2) NOT NULL,
    total_discount NUMERIC(12,2) DEFAULT 0.00,
    gst_percent NUMERIC(5,2) DEFAULT 18.00,
    taxable_amount NUMERIC(12,2) NOT NULL,
    sgst_rate NUMERIC(5,2) DEFAULT 9.00,
    sgst_amount NUMERIC(12,2) DEFAULT 0.00,
    cgst_rate NUMERIC(5,2) DEFAULT 9.00,
    cgst_amount NUMERIC(12,2) DEFAULT 0.00,
    cr_dr_note NUMERIC(12,2) DEFAULT 0.00,
    roundoff NUMERIC(12,2) DEFAULT 0.00,
    grand_total NUMERIC(12,2) NOT NULL,
    amount_in_words TEXT NOT NULL,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'paid', -- 'paid', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Bill Items Table (Line items on the printed Tax Invoice)
CREATE TABLE IF NOT EXISTS bill_items (
    id SERIAL PRIMARY KEY,
    bill_id INT REFERENCES bills(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    unit_id INT REFERENCES product_units(id),
    company VARCHAR(100) NOT NULL,
    model_name VARCHAR(150) NOT NULL,
    variant VARCHAR(100),
    color VARCHAR(50),
    imei_1 VARCHAR(50) NOT NULL,
    imei_2 VARCHAR(50),
    finance_name VARCHAR(100), -- e.g. 'BAJAJ FINSERV'
    loan_no VARCHAR(100),      -- e.g. 'INSURANCE - YES' or Loan Account ID
    hsn_sac VARCHAR(50) DEFAULT '85171300',
    quantity INT NOT NULL DEFAULT 1,
    rate NUMERIC(12,2) NOT NULL,
    discount NUMERIC(12,2) DEFAULT 0.00,
    amount NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    bill_id INT REFERENCES bills(id) ON DELETE CASCADE,
    payment_mode VARCHAR(50) NOT NULL, -- 'Cash', 'UPI', 'Card', 'EMI', 'Mixed'
    amount NUMERIC(12,2) NOT NULL,
    reference_no VARCHAR(100),
    finance_company VARCHAR(100),
    exchange_value NUMERIC(12,2) DEFAULT 0.00,
    exchange_phone_details TEXT,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_visible ON products(is_visible);
CREATE INDEX IF NOT EXISTS idx_product_units_imei ON product_units(imei_1);
CREATE INDEX IF NOT EXISTS idx_product_units_status ON product_units(status);
CREATE INDEX IF NOT EXISTS idx_bills_invoice_no ON bills(invoice_no);
CREATE INDEX IF NOT EXISTS idx_bills_date ON bills(invoice_date);
CREATE INDEX IF NOT EXISTS idx_bills_customer ON bills(customer_name, customer_phone);
