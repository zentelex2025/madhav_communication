-- ==============================================================================
-- Shri Narayan Telecom - Seed Data (10 Mobiles, IMEI Units, Admin User, Sample Bill)
-- Dialect: PostgreSQL
-- ==============================================================================

-- 1. Default Admin User (Password: admin123 -> bcrypt hash)
-- bcrypt hash for 'admin123' with 10 rounds: $2a$10$wN8Ww.o18d48Qo8aXmS.je8sI/cWfF.Meqr98V6p2lqT2hP9QdYxO
INSERT INTO users (id, name, email, password_hash, role)
VALUES (
    1,
    'Manish Kumar Mehta (Admin)',
    'admin@shrinaarayan.com',
    '$2b$10$emGWn012NTl5rW1aI6GnMuxkwiXAxrMCjoLYiU7h1RBYSj6nmSBUW',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- 2. Shop Settings
INSERT INTO shop_settings (
    id, shop_name, tagline, address, phone, whatsapp_number, email, gstin, hsn_default,
    salesman_name, bank_name, account_no, ifsc_code, upi_id, terms_1, terms_2, jurisdiction, default_gst_percent
) VALUES (
    1,
    'SHRI NARAYAN TELECOM',
    'Deals in : All types of Mobile & Accessories',
    'KAZIPUR QUARTER ROAD NO-3 NEAR-RADHE SHYAM MANDIR PATNA-800004',
    '8409946197',
    '918409946197',
    'manishkumarmehta97@gmail.com',
    '10DUEPK6618D1Z2',
    '85171300',
    'MANISH KUMAR MEHTA',
    'STATE BANK OF INDIA',
    '389201948192',
    'SBIN0001234',
    '8409946197@upi',
    '1.No Refund after Sale of Any Mobiles.',
    '2.All Subject to "PATNA" Jurisdiction Only.',
    'PATNA',
    18.00
) ON CONFLICT (id) DO UPDATE SET
    shop_name = EXCLUDED.shop_name,
    address = EXCLUDED.address,
    phone = EXCLUDED.phone,
    gstin = EXCLUDED.gstin;

-- 3. 10 Sample Mobiles
INSERT INTO products (
    id, brand, model, variant, color, condition, hsn_code, purchase_price, selling_price, stock_quantity, warranty_period, description, specs, is_visible
) VALUES
(
    1,
    'SAMSUNG',
    'GALAXY A57 5G',
    '8GB / 256GB',
    'ICEBLUE',
    'New',
    '85171300',
    51200.00,
    58700.00,
    4,
    '1 Year Brand Warranty',
    'Flagship killer mid-ranger with vibrant 120Hz Super AMOLED display, 50MP OIS triple camera system, IP68 water resistance, and stereo speakers.',
    '{"ram": "8GB LPDDR5X", "storage": "256GB UFS 3.1", "battery": "5000 mAh 45W Fast Charging", "camera": "50MP OIS + 12MP Ultra-wide + 5MP Macro", "display": "6.6-inch Super AMOLED 120Hz HDR10+", "processor": "Exynos 1480 Octa-Core", "network": "5G Dual SIM"}'::jsonb,
    TRUE
),
(
    2,
    'Apple',
    'iPhone 16 Pro',
    '8GB / 256GB',
    'Desert Titanium',
    'New',
    '85171300',
    118000.00,
    129900.00,
    3,
    '1 Year Apple Official Warranty',
    'Titanium design, Camera Control button, 48MP Fusion camera system, A18 Pro chip, and industry-leading battery life.',
    '{"ram": "8GB", "storage": "256GB NVMe", "battery": "3582 mAh MagSafe Fast Charging", "camera": "48MP Main + 48MP Ultra-wide + 12MP 5x Telephoto", "display": "6.3-inch Super Retina XDR OLED 120Hz ProMotion", "processor": "Apple A18 Pro 3nm", "network": "5G Dual eSIM / Physical"}'::jsonb,
    TRUE
),
(
    3,
    'SAMSUNG',
    'Galaxy S24 Ultra 5G',
    '12GB / 512GB',
    'Titanium Gray',
    'New',
    '85171300',
    122000.00,
    139999.00,
    2,
    '1 Year Samsung India Warranty',
    'The ultimate Galaxy with integrated S-Pen, 200MP Quad Tele camera, Snapdragon 8 Gen 3 for Galaxy, and Galaxy AI suite.',
    '{"ram": "12GB LPDDR5X", "storage": "512GB UFS 4.0", "battery": "5000 mAh 45W wired, 15W wireless", "camera": "200MP OIS + 50MP 5x Periscope + 10MP 3x + 12MP UW", "display": "6.8-inch Dynamic AMOLED 2X 120Hz 2600 nits", "processor": "Snapdragon 8 Gen 3 for Galaxy", "network": "5G Dual SIM"}'::jsonb,
    TRUE
),
(
    4,
    'OnePlus',
    'OnePlus 12',
    '16GB / 512GB',
    'Flowy Emerald',
    'New',
    '85171300',
    59000.00,
    64999.00,
    5,
    '1 Year OnePlus Warranty',
    'Ultra-flagship performance powered by Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera System, and 100W SUPERVOOC charging.',
    '{"ram": "16GB LPDDR5X", "storage": "512GB UFS 4.0", "battery": "5400 mAh 100W Wired + 50W AIRVOOC", "camera": "50MP Sony LYT-808 + 64MP 3x Periscope + 48MP UW", "display": "6.82-inch 2K ProXDR Display 120Hz LTPO 4500 nits", "processor": "Snapdragon 8 Gen 3", "network": "5G Dual SIM"}'::jsonb,
    TRUE
),
(
    5,
    'vivo',
    'V40 Pro 5G',
    '12GB / 256GB',
    'Ganges Blue',
    'New',
    '85171300',
    46000.00,
    49999.00,
    4,
    '1 Year Brand Warranty',
    'ZEISS Multifocal Portrait system with 50MP ZEISS OIS main camera, ultra-slim 5500 mAh BlueVolt battery, and IP68/IP69 rating.',
    '{"ram": "12GB LPDDR5X", "storage": "256GB UFS 3.1", "battery": "5500 mAh 80W FlashCharge", "camera": "50MP ZEISS OIS + 50MP Telephoto + 50MP UW + 50MP Front", "display": "6.78-inch 1.5K AMOLED 120Hz 3D Curved", "processor": "MediaTek Dimensity 9200+ 4nm", "network": "5G Dual SIM"}'::jsonb,
    TRUE
),
(
    6,
    'Xiaomi',
    'Redmi Note 13 Pro+ 5G',
    '12GB / 256GB',
    'Fusion Purple',
    'New',
    '85171300',
    29000.00,
    33999.00,
    6,
    '1 Year Xiaomi India Warranty',
    '200MP ultra-clear camera with OIS, 120W HyperCharge, curved AMOLED display, and IP68 flagship water/dust protection.',
    '{"ram": "12GB LPDDR5", "storage": "256GB UFS 3.1", "battery": "5000 mAh 120W HyperCharge", "camera": "200MP Samsung ISOCELL HP3 OIS + 8MP UW + 2MP Macro", "display": "6.67-inch 1.5K Curved AMOLED 120Hz 1800 nits", "processor": "MediaTek Dimensity 7200 Ultra", "network": "5G Dual SIM"}'::jsonb,
    TRUE
),
(
    7,
    'oppo',
    'Reno 12 Pro 5G',
    '12GB / 512GB',
    'Sunset Gold',
    'New',
    '85171300',
    34000.00,
    38999.00,
    3,
    '1 Year Oppo Official Warranty',
    'AI Portrait Camera with 50MP Telephoto portrait lens, quad-micro-curved infinite view screen, and aerospace-grade shock resistance.',
    '{"ram": "12GB LPDDR4X", "storage": "512GB UFS 3.1", "battery": "5000 mAh 80W SUPERVOOC", "camera": "50MP Sony LYT-600 OIS + 50MP Telephoto + 8MP UW", "display": "6.7-inch Quad-Curved AMOLED 120Hz Splash Touch", "processor": "MediaTek Dimensity 7300-Energy", "network": "5G Dual SIM"}'::jsonb,
    TRUE
),
(
    8,
    'realme',
    '12 Pro+ 5G',
    '8GB / 256GB',
    'Submarine Blue',
    'New',
    '85171300',
    27500.00,
    31999.00,
    5,
    '1 Year Realme Warranty',
    'Luxury watch design with 64MP Periscope Portrait camera, Snapdragon 7s Gen 2, and 120Hz Curved Vision OLED display.',
    '{"ram": "8GB", "storage": "256GB", "battery": "5000 mAh 67W SUPERVOOC", "camera": "64MP Periscope 3x OIS + 50MP Sony IMX890 OIS + 8MP UW", "display": "6.7-inch OLED 120Hz Curved", "processor": "Snapdragon 7s Gen 2", "network": "5G Dual SIM"}'::jsonb,
    TRUE
),
(
    9,
    'Google',
    'Pixel 9 Pro',
    '16GB / 256GB',
    'Obsidian',
    'New',
    '85171300',
    96000.00,
    109999.00,
    2,
    '1 Year Google India Warranty',
    'Google Tensor G4 processor with Gemini Nano AI, pro triple rear camera system with 30x Super Res Zoom, and 7 years of OS updates.',
    '{"ram": "16GB", "storage": "256GB", "battery": "4700 mAh Fast Charging", "camera": "50MP Octa PD + 48MP Quad PD UW + 48MP Quad PD Telephoto 5x", "display": "6.3-inch Super Actua LTPO OLED 120Hz 3000 nits", "processor": "Google Tensor G4 + Titan M2", "network": "5G Dual SIM"}'::jsonb,
    TRUE
),
(
    10,
    'Apple',
    'iPhone 13 (Pre-owned / Mint)',
    '4GB / 128GB',
    'Midnight Black',
    'Used',
    '85171300',
    31000.00,
    36500.00,
    2,
    '6 Months Shop Warranty',
    'Grade A+ Certified Pre-owned iPhone 13. 100% original parts, 88% battery health, zero scratches, fully tested with 32-point inspection.',
    '{"ram": "4GB", "storage": "128GB", "battery": "3240 mAh (88% Health)", "camera": "12MP Dual Sensor-Shift OIS + 12MP Ultra-wide", "display": "6.1-inch Super Retina XDR OLED", "processor": "Apple A15 Bionic", "network": "5G Single Nano SIM + eSIM"}'::jsonb,
    TRUE
)
ON CONFLICT (id) DO UPDATE SET
    brand = EXCLUDED.brand,
    model = EXCLUDED.model,
    variant = EXCLUDED.variant,
    selling_price = EXCLUDED.selling_price,
    stock_quantity = EXCLUDED.stock_quantity;

-- 4. Product Images
INSERT INTO product_images (product_id, image_url, is_primary) VALUES
(1, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', TRUE),
(1, 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80', FALSE),
(2, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80', TRUE),
(2, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80', FALSE),
(3, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', TRUE),
(4, 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80', TRUE),
(5, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80', TRUE),
(6, 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80', TRUE),
(7, 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80', TRUE),
(8, 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80', TRUE),
(9, 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=800&q=80', TRUE),
(10, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', TRUE);

-- 5. Product Units (Realistic 15-digit IMEIs)
-- Product 1 (Samsung A57): Contains the IMEI from the uploaded bill 351791522686707 as sold!
INSERT INTO product_units (id, product_id, imei_1, imei_2, serial_no, status, created_at, sold_at) VALUES
(1, 1, '351791522686707', '351791522686715', 'R52N60AK19P', 'sold', '2026-06-25 10:00:00+05:30', '2026-06-26 14:30:00+05:30'),
(2, 1, '351791522686723', '351791522686731', 'R52N60AK20Q', 'available', CURRENT_TIMESTAMP, NULL),
(3, 1, '351791522686749', '351791522686756', 'R52N60AK21R', 'available', CURRENT_TIMESTAMP, NULL),
(4, 1, '351791522686764', '351791522686772', 'R52N60AK22S', 'available', CURRENT_TIMESTAMP, NULL),
(5, 1, '351791522686780', '351791522686798', 'R52N60AK23T', 'available', CURRENT_TIMESTAMP, NULL),

-- Product 2 (iPhone 16 Pro)
(6, 2, '359281048192011', '359281048192029', 'H8N819XQ19A', 'available', CURRENT_TIMESTAMP, NULL),
(7, 2, '359281048192037', '359281048192045', 'H8N819XQ20B', 'available', CURRENT_TIMESTAMP, NULL),
(8, 2, '359281048192052', '359281048192060', 'H8N819XQ21C', 'available', CURRENT_TIMESTAMP, NULL),

-- Product 3 (S24 Ultra)
(9, 3, '354891028193012', '354891028193020', 'RF8M10LP90K', 'available', CURRENT_TIMESTAMP, NULL),
(10, 3, '354891028193038', '354891028193046', 'RF8M10LP91L', 'available', CURRENT_TIMESTAMP, NULL),

-- Product 4 (OnePlus 12)
(11, 4, '864910294819201', '864910294819219', '1OP8920194A', 'available', CURRENT_TIMESTAMP, NULL),
(12, 4, '864910294819227', '864910294819235', '1OP8920195B', 'available', CURRENT_TIMESTAMP, NULL),
(13, 4, '864910294819243', '864910294819250', '1OP8920196C', 'available', CURRENT_TIMESTAMP, NULL),

-- Product 5 (Vivo V40 Pro)
(14, 5, '869201849102931', '869201849102949', 'VV82910481D', 'available', CURRENT_TIMESTAMP, NULL),
(15, 5, '869201849102956', '869201849102964', 'VV82910482E', 'available', CURRENT_TIMESTAMP, NULL),

-- Product 6 (Redmi Note 13 Pro+)
(16, 6, '861029481029381', '861029481029399', 'XM92019481A', 'available', CURRENT_TIMESTAMP, NULL),
(17, 6, '861029481029407', '861029481029415', 'XM92019482B', 'available', CURRENT_TIMESTAMP, NULL),

-- Product 7 (Oppo Reno 12 Pro)
(18, 7, '867192049102931', '867192049102949', 'OP72019481F', 'available', CURRENT_TIMESTAMP, NULL),
(19, 7, '867192049102956', '867192049102964', 'OP72019482G', 'available', CURRENT_TIMESTAMP, NULL),

-- Product 8 (Realme 12 Pro+)
(20, 8, '862910481920191', '862910481920209', 'RM62019481H', 'available', CURRENT_TIMESTAMP, NULL),
(21, 8, '862910481920217', '862910481920225', 'RM62019482J', 'available', CURRENT_TIMESTAMP, NULL),

-- Product 9 (Pixel 9 Pro)
(22, 9, '358291048192014', '358291048192022', 'PX92019481K', 'available', CURRENT_TIMESTAMP, NULL),
(23, 9, '358291048192030', '358291048192048', 'PX92019482L', 'available', CURRENT_TIMESTAMP, NULL),

-- Product 10 (Used iPhone 13)
(24, 10, '357291048192019', '357291048192027', 'AP52019481M', 'available', CURRENT_TIMESTAMP, NULL),
(25, 10, '357291048192035', '357291048192043', 'AP52019482N', 'available', CURRENT_TIMESTAMP, NULL)
ON CONFLICT (id) DO NOTHING;

-- Reset primary key sequences for PostgreSQL
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('product_units_id_seq', (SELECT MAX(id) FROM product_units));
SELECT setval('product_images_id_seq', (SELECT MAX(id) FROM product_images));

-- 6. Seed Sample Customer (From the attached bill!)
INSERT INTO customers (id, name, phone, address, email, gstin)
VALUES (
    1,
    'RAJESH KUMAR',
    '8210257618',
    'PHULWARI SARIF',
    'rajesh.kumar@example.com',
    ''
) ON CONFLICT (id) DO NOTHING;
SELECT setval('customers_id_seq', (SELECT MAX(id) FROM customers));

-- 7. Seed Past Bill #2686 (Matches the photo exactly!)
INSERT INTO bills (
    id, invoice_no, invoice_date, customer_id, customer_name, customer_phone, customer_address, customer_gstin,
    sales_man, sub_total, total_discount, gst_percent, taxable_amount, sgst_rate, sgst_amount, cgst_rate, cgst_amount,
    cr_dr_note, roundoff, grand_total, amount_in_words, notes, status, created_at
) VALUES (
    1,
    '2686',
    '2026-06-26',
    1,
    'RAJESH KUMAR',
    '8210257618',
    'PHULWARI SARIF',
    '',
    'MANISH KUMAR MEHTA',
    49745.76,
    0.00,
    18.00,
    49745.76,
    9.00,
    4477.12,
    9.00,
    4477.12,
    0.00,
    0.00,
    58700.00,
    'Rs. Fifty Eight Thousand Seven Hundred only',
    'BAJAJ FINSERV LOAN (INSURANCE - YES)',
    'paid',
    '2026-06-26 14:30:00+05:30'
) ON CONFLICT (id) DO NOTHING;
SELECT setval('bills_id_seq', (SELECT MAX(id) FROM bills));

-- Link unit #1 to bill #1
UPDATE product_units SET bill_id = 1 WHERE id = 1;

-- 8. Seed Bill Item for Bill #2686
INSERT INTO bill_items (
    id, bill_id, product_id, unit_id, company, model_name, variant, color,
    imei_1, imei_2, finance_name, loan_no, hsn_sac, quantity, rate, discount, amount
) VALUES (
    1,
    1,
    1,
    1,
    'SAMSUNG',
    'SAMSUNG GALAXY A57(8/256)ICEBLUE',
    '8GB / 256GB',
    'ICEBLUE',
    '351791522686707',
    '',
    'BAJAJ FINSERV',
    'INSURANCE - YES',
    '85171300',
    1,
    58700.00,
    0.00,
    58700.00
) ON CONFLICT (id) DO NOTHING;
SELECT setval('bill_items_id_seq', (SELECT MAX(id) FROM bill_items));

-- 9. Seed Payment for Bill #2686
INSERT INTO payments (
    id, bill_id, payment_mode, amount, reference_no, finance_company, exchange_value, payment_date
) VALUES (
    1,
    1,
    'EMI',
    58700.00,
    'BAJAJ-LN-9920184',
    'BAJAJ FINSERV',
    0.00,
    '2026-06-26 14:30:00+05:30'
) ON CONFLICT (id) DO NOTHING;
SELECT setval('payments_id_seq', (SELECT MAX(id) FROM payments));
