# Shri Narayan Telecom - Mobile Shop Billing & Showcase

A full-stack web application designed for mobile phone retail showrooms and customer showcases. Built with Node.js Express MVC architecture, PostgreSQL, React (Vite), and Tailwind CSS. Features pixel-accurate tax invoice generation modeled directly from Shri Narayan Telecom's official GST invoice.

---

## 🏗️ Folder Structure

```
├── backend/
│   ├── config/
│   │   └── db.js                 # PostgreSQL connection & auto-migration loader
│   ├── controllers/
│   │   ├── authController.js     # Shopkeeper login & token verification
│   │   ├── billController.js     # Tax invoice generation, search & reprint
│   │   ├── cartController.js     # POS cart & item modifications
│   │   ├── customerController.js # Customer search & directory
│   │   ├── productController.js  # Mobile catalog, IMEI units & dashboard stats
│   │   └── shopController.js     # Store profile, GSTIN, bank & terms
│   ├── db/
│   │   ├── schema.sql            # Full PostgreSQL DDL schema definition
│   │   └── seeds.sql             # 10 sample mobiles, IMEI units & sample bill #2686
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification middleware
│   ├── models/
│   │   ├── billModel.js          # Invoicing, tax calculations, IMEI tracking
│   │   ├── cartModel.js          # Cart storage and POS items
│   │   ├── customerModel.js      # Customer records
│   │   ├── productModel.js       # Products, inventory & unit management
│   │   ├── shopModel.js          # Store settings & GST rules
│   │   └── userModel.js          # User & authentication queries
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── billRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── productRoutes.js
│   │   └── shopRoutes.js
│   └── utils/
│       └── numberToWords.js      # Indian currency word converter (Rs. Lakh/Thousand)
├── src/
│   ├── components/
│   │   ├── BillPrintModal.jsx    # Pixel-accurate GST Tax Invoice & thermal receipt
│   │   ├── CustomerStorefront.jsx# Public showroom, search, filters & specs
│   │   ├── ProductDetailModal.jsx# Phone gallery, specs & WhatsApp inquiry
│   │   ├── AdminLogin.jsx        # Shopkeeper authentication portal
│   │   ├── AdminDashboard.jsx    # POS dashboard, sales metrics & low stock alerts
│   │   ├── ProductManagement.jsx # Inventory CRUD, IMEI tracking & visibility
│   │   ├── BillingPOS.jsx        # POS cart, customer info, IMEI assignment & billing
│   │   ├── BillsHistory.jsx      # Search invoices, reprint & WhatsApp sharing
│   │   ├── ShopSettings.jsx      # Store branding, GST & bank details
│   │   └── Header.jsx            # Responsive navigation & shop banner
│   ├── context/
│   │   └── AuthContext.jsx       # Shopkeeper JWT session state
│   ├── services/
│   │   └── api.js                # Frontend API client
│   ├── App.jsx                   # Main application router & state manager
│   ├── main.jsx                  # React DOM root entry
│   └── index.css                 # Tailwind CSS styles
├── public/
│   └── assets/                   # Store assets & reference invoice
├── server.js                     # Express application & Vite dev middleware
├── package.json
└── README.md
```

---

## 🚀 Setup & Run Instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env
```
Default parameters in `.env`:
- `PORT=3000`
- `JWT_SECRET=shri_narayan_telecom_jwt_secret_key_patna_2026`

### 4. Running the Frontend
Start the Vite development server from the `Frontend` directory:
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser. The `start` script serves a production build; run `npm run build` first.

---

## 🔑 Default Admin Credentials
- **Email:** `admin@shrinaarayan.com`
- **Password:** `admin123`

---

## 📡 API Routes List

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/login` | Shopkeeper login with email & password | No |
| GET | `/api/auth/me` | Fetch authenticated user profile | Yes (JWT) |

### Products & Inventory (`/api/products`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/products` | Browse public mobile showcase (filters/search) | No |
| GET | `/api/products/:id` | Get full specifications & available IMEIs | No |
| GET | `/api/products/admin/all` | Get complete inventory list (including hidden) | Yes (JWT) |
| GET | `/api/products/admin/dashboard` | Today sales, bill count, stock & low stock | Yes (JWT) |
| POST | `/api/products/admin/create` | Add new mobile model & units | Yes (JWT) |
| PUT | `/api/products/admin/:id` | Update mobile details & specs | Yes (JWT) |
| DELETE| `/api/products/admin/:id` | Delete mobile model | Yes (JWT) |
| PATCH | `/api/products/admin/:id/visibility` | Toggle showroom visibility | Yes (JWT) |
| POST | `/api/products/admin/:id/units` | Add IMEI unit to stock | Yes (JWT) |
| DELETE| `/api/products/admin/units/:unitId` | Delete unsold IMEI unit | Yes (JWT) |

### POS Cart (`/api/cart`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/cart` | Get current active POS cart session | No |
| POST | `/api/cart/add` | Add product or serialized unit to cart | No |
| PUT | `/api/cart/items/:itemId` | Update quantity, discount or unit | No |
| DELETE| `/api/cart/items/:itemId` | Remove item from cart | No |
| DELETE| `/api/cart/clear` | Clear cart | No |

### Tax Invoices & Billing (`/api/bills`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/bills/next-number` | Fetch auto-incremented invoice number | Yes (JWT) |
| GET | `/api/bills` | Search bills by invoice, phone, date | Yes (JWT) |
| GET | `/api/bills/:id` | Get full invoice with item & payment details | Yes (JWT) |
| GET | `/api/bills/invoice/:no` | Public invoice lookup for direct viewing | No |
| POST | `/api/bills/generate` | Generate tax invoice, mark IMEIs sold, deduct stock | Yes (JWT) |

### Customers (`/api/customers`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/customers/search?q=` | Search customer by name or phone | Yes (JWT) |

### Store Settings (`/api/shop`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/shop/settings` | Get store contact, GSTIN, bank & terms | No |
| PUT | `/api/shop/settings` | Update store details | Yes (JWT) |
