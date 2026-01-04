# Server-Rendered E-commerce Product Management Dashboard

## Owner details

**Parshv Meshiya**

- GitHub: [@ParshvMeshiya](https://github.com/ParshvMeshiya)
- Project Link: [https://github.com/ParshvMeshiya/SSR-Rendered-E-commerce-Admin-Website](https://github.com/ParshvMeshiya/SSR-Rendered-E-commerce-Admin-Website)
- Deployed Website Link: [https://e-commerce-nu-roan-89.vercel.app/](https://e-commerce-nu-roan-89.vercel.app/)
- Dummy Account Credentials:
    1) Email Address : admin@example.com
    2)Password : Admin@123
---
## Project Overview

The **Server-Rendered E-commerce Product Management Dashboard** is a full-stack web application designed to help administrators manage products in an e-commerce system efficiently. The main goal of this project is to demonstrate how **server-side rendering (SSR)** can be used to build fast, SEO-friendly, and scalable admin dashboards using **Next.js**.

In this application, product data is fetched and rendered on the **server** before the page is sent to the browser. This improves performance, reduces load time, and provides better SEO compared to traditional client-side rendered applications.

The dashboard is accessible **only to authorized administrators**. Admins can create, view, update, and delete products using a structured interface. Product creation is handled using a **multi-step form**, where product details are entered first, followed by secure image uploads. All user inputs are validated to ensure data correctness, and product images are stored securely using cloud storage.

This project simulates a **real-world e-commerce admin panel** and follows industry-level best practices for security, performance, and maintainability.

---

## Features

### 1. Server-Side Rendering (SSR)

- Uses **Next.js server-side rendering** to fetch product data on the server.
- Pages load faster and are SEO-friendly.
- Ensures reliable rendering even for large datasets.

### 2. Dashboard Analytics

- **Revenue Tracking**: View total revenue and profit metrics
- **Sales Analytics**: Interactive bar and pie charts showing sales by category
- **Recent Transactions**: Real-time display of recent orders
- **Inventory Monitoring**: Track items sold and stock levels

### 3. Product Management (CRUD)

- Admins can:
  - **Create** new products
  - **View** all products
  - **Edit** existing products
  - **Delete** products
- Product data is stored in a database and updated in real time.

### 4. Multi-Step Product Creation Form

- Step 1: Enter product details such as name, description, price, stock, category, and SEO information.
- Step 2: Upload product images securely.
- Prevents incomplete or invalid submissions.

### 5. Strong Input Validation

- Uses **Zod schema validation** to validate all product inputs.
- Prevents negative prices, missing required fields, and incorrect data types.
- Displays user-friendly error messages.

### 6. Secure Image Upload

- Product images are uploaded securely using a cloud storage service (Cloudinary).
- Only image files are accepted.
- Uploaded images are stored as URLs in the database.

### 7. Authentication and Authorization

- Only authenticated **admins** can access the dashboard.
- **JWT-based authentication** with secure token storage in HTTP-only cookies.
- Non-admin users are restricted from viewing or modifying product data.
- Includes **secure logout functionality** that properly clears session tokens.
- **Protected routes** using Next.js middleware.

### 8. Admin-Only Onboarding

- Admin creation or onboarding functionality is visible **only to existing admins**.
- Prevents unauthorized access to sensitive features.

### 9. Interactive UI and Clean Design

- Built using modern UI components.
- **Recharts integration** for data visualization.
- **Responsive sidebar navigation** that works across all pages.
- Organized layout with clear sections for product information.
- Responsive design for different screen sizes.

---

## Tech Stack

### Frontend & Backend

- **Next.js 15** – Server-side rendering and full-stack framework
- **React 18** – UI component library
- **Tailwind CSS** – Utility-first CSS framework

### Data Fetching & State Management

- **React Query** – Efficient data fetching and revalidation

### Form Validation

- **Zod** – Schema-based input validation

### Data Visualization

- **Recharts** – Interactive charts for sales and stock insights

### Image Storage

- **Cloudinary** – Secure image upload and storage

### Database

- **MongoDB** – Persistent product data storage
- **Mongoose** – ODM for MongoDB

### Authentication

- **JWT (jsonwebtoken)** – Token-based authentication
- **bcryptjs** – Password hashing

### Deployment

- **Vercel** – Production hosting platform

---

## Application Workflow

1. Admin requests the dashboard page.
2. Server fetches product data from the database.
3. Page is rendered on the server and sent to the browser.
4. Admin interacts with product forms and charts.
5. Product data is created, updated, or deleted.
6. UI refreshes by re-fetching the latest data.

---

## Project Structure

```
├── src/
│   ├── app/                          # Next.js App Directory
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/
│   │   │   │   ├── login/            # Login endpoint
│   │   │   │   │   └── route.js
│   │   │   │   ├── logout/           # Logout endpoint
│   │   │   │   │   └── route.js
│   │   │   │   └── register/         # Register endpoint
│   │   │   │       └── route.js
│   │   │   ├── dashboard/            # Dashboard data endpoints
│   │   │   │   ├── category-sales/
│   │   │   │   │   └── route.js
│   │   │   │   ├── chart/
│   │   │   │   │   └── route.js
│   │   │   │   ├── metrics/
│   │   │   │   │   └── route.js
│   │   │   │   └── recent-transactions/
│   │   │   │       └── route.js
│   │   │   ├── orders/
│   │   │   │   └── [id]/
│   │   │   │       └── route.js
│   │   │   ├── products/
│   │   │   │   └── [id]/
│   │   │   │       └── route.js
│   │   │   ├── settings/
│   │   │   │   └── route.js
│   │   │   └── upload/               # Image upload endpoint
│   │   │       └── route.js
│   │   ├── dashboard/                # Dashboard pages
│   │   │   ├── page.js
│   │   │   └── DashboardClient.js
│   │   ├── orders/                   # Order management
│   │   │   ├── page.js
│   │   │   └── OrdersClient.js
│   │   ├── products/                 # Product management
│   │   │   ├── [id]/                 # Dynamic product page
│   │   │   │   └── page.js
│   │   │   ├── new/                  # Create new product
│   │   │   │   └── page.js
│   │   │   └── page.js
│   │   ├── register/                 # Registration page
│   │   │   └── page.js
│   │   ├── settings/                 # Settings page
│   │   │   ├── page.js
│   │   │   └── SettingsClient.js
│   │   ├── favicon.ico
│   │   ├── globals.css               # Global styles
│   │   ├── layout.js                 # Root layout
│   │   └── page.js                   # Home/Login page
│   ├── components/                   # Reusable components
│   │   ├── products/
│   │   │   ├── ProductForm.js        # Product creation form
│   │   │   └── ProductsTable.js      # Products listing table
│   │   └── Sidebar.js                # Navigation sidebar with logout
│   └── lib/                          # Utilities and configurations
│       ├── auth/
│       │   ├── jwt.js                # JWT utilities
│       │   └── middleware.js         # Auth middleware
│       ├── db/
│       │   ├── models/               # Mongoose schemas
│       │   │   ├── order.js
│       │   │   ├── product.js
│       │   │   ├── settings.js
│       │   │   └── user.js
│       │   └── mongodb.js            # Database connection
│       ├── validations/
│       │   └── cloudinary.js         # Image validation
│       └── utils/                    # Helper functions
├── .env.local                        # Environment variables
├── .gitignore
├── middleware.js                     # Next.js route middleware
next.config.mjs                    # Next.js configuration
├── package.json
├── postcss.config.js
├── tailwind.config.mjs
└── README.md
```

### Directory Breakdown

#### `/src/app/api/` - API Routes

- **`auth/`** - Authentication endpoints (login, logout, register)
- **`dashboard/`** - Dashboard data (metrics, sales, transactions, charts)
- **`orders/`** - Order CRUD operations
- **`products/`** - Product CRUD operations
- **`settings/`** - Application settings
- **`upload/`** - File upload handling (Cloudinary integration)

#### `/src/app/` - Pages

- **`dashboard/`** - Main admin dashboard with analytics
- **`orders/`** - Order management interface
- **`products/`** - Product listing and management
  - **`[id]/`** - Edit existing product (dynamic route)
  - **`new/`** - Create new product
- **`register/`** - Admin registration
- **`settings/`** - Application settings
- **`page.js`** - Landing/Login page

#### `/src/components/` - React Components

- **`products/ProductForm.js`** - Multi-step product creation form
- **`products/ProductsTable.js`** - Product listing with CRUD actions
- **`Sidebar.js`** - Persistent navigation sidebar with logout functionality

#### `/src/lib/` - Backend Logic

- **`auth/`** - JWT token generation, verification, and middleware
- **`db/models/`** - Mongoose schemas for MongoDB collections
- **`db/mongodb.js`** - Database connection and configuration
- **`validations/`** - Input validation and file upload validation

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Cloudinary account** (for image uploads)

### 1. Clone the Repository

```bash
git clone https://github.com/ParshvMeshiya/SSR-Rendered-E-commerce-Admin-Website.git
cd SSR-Rendered-E-commerce-Admin-Website
```

### 2. Install Dependencies

Install all required packages for the project:

```bash
npm install
```

### 3. Environment Variables Setup

Create a `.env.local` file in the root directory and add the following:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key
ADMIN_SECRET_KEY=your_admin_secret_key

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Explanation of Environment Variables

- **MONGODB_URI**  
  Connection string for MongoDB database where product, user, and admin data is stored.

- **JWT_SECRET**  
  Secret key used to sign and verify JSON Web Tokens for authentication. Use a long, random string for security.

- **ADMIN_SECRET_KEY**  
  A security key used to restrict **admin onboarding and privileged actions**.  
  Only users with this key can create or manage admin accounts, preventing unauthorized access.

- **CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET**  
  Credentials used to securely upload and store product images on Cloudinary.

- **NEXT_PUBLIC_BASE_URL**  
  Base URL of the application, used for API calls and deployment configuration.

- **NODE_ENV**  
  Environment mode (development/production). Affects security settings like cookie behavior.

### 4. Set Up MongoDB

**Option A: MongoDB Atlas (Recommended for Production)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click **"Connect"** → **"Connect your application"**
4. Copy the connection string and replace `<password>` with your database password
5. **Important for Vercel Deployment**:
   - Go to **Network Access** in MongoDB Atlas
   - Click **"Add IP Address"**
   - Select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This allows Vercel's servers to connect to your database

**Option B: Local MongoDB**

1. Install MongoDB locally from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/ecommerce-dashboard`

### 5. Set Up Cloudinary

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Go to **Dashboard**
3. Copy your **Cloud Name**, **API Key**, and **API Secret**
4. Add them to your `.env.local` file

### 6. Running the Application Locally

After setting up environment variables, start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

---

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New"** → **"Project"**
3. Import your repository
4. Vercel will auto-detect Next.js

### 3. Add Environment Variables

In Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add all variables from your `.env.local` file:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `ADMIN_SECRET_KEY`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. Select **Production**, **Preview**, and **Development** for each variable
4. Click **"Save"**

**Important**: DO NOT add `NEXT_PUBLIC_BASE_URL` in Vercel. Vercel automatically provides the `VERCEL_URL` environment variable.

### 4. Disable Vercel Deployment Protection

To avoid authentication errors:

1. Go to **Settings** → **Deployment Protection**
2. Under **"Vercel Authentication"**, select **"Disabled"** for Production
3. Click **"Save"**

### 5. Deploy

Click **"Deploy"** and wait 2-3 minutes. Your app will be live at `https://your-project.vercel.app`

### 6. Whitelist Vercel IPs in MongoDB

If using MongoDB Atlas:

1. Go to **Network Access**
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

---

## Usage Guide

### Creating an Admin Account

1. Navigate to the admin registration page
2. Enter the **ADMIN_SECRET_KEY** to verify authorization
3. Fill in admin credentials
4. Submit to create admin account

### Logging In

1. Go to the login page
2. Enter your admin credentials
3. You'll be redirected to the dashboard upon successful login

### Managing Products

1. Navigate to **Products** from the sidebar
2. Click **"Add Product"** to create a new product
3. Fill in product details in the multi-step form
4. Upload product images
5. Submit to save the product

### Viewing Dashboard Analytics

1. Navigate to **Dashboard** from the sidebar
2. View key metrics: Revenue, Items Sold, Profit, Customers
3. Analyze sales by category using interactive charts
4. Check recent transactions

### Logging Out

1. Click the **"Logout"** button in the sidebar (available on all pages)
2. Confirm logout in the modal
3. You'll be redirected to the login page

---

## API Routes

### Authentication

- `POST /api/auth/logout` - Logout and clear session

### Dashboard

- `GET /api/dashboard/metrics` - Get revenue, profit, items sold, customers
- `GET /api/dashboard/category-sales` - Get sales data by category
- `GET /api/dashboard/recent-transactions` - Get recent orders

---

## Key Features Explained

### Server-Side Rendering

All dashboard pages use Next.js Server Components to fetch data on the server before rendering. This provides:

- **Faster initial load** - No client-side data fetching delays
- **Better SEO** - Search engines can crawl the content
- **Improved security** - Sensitive logic stays on the server

### Secure Authentication

- **HTTP-only cookies** - Prevents XSS attacks by making tokens inaccessible to JavaScript
- **JWT tokens** - Stateless authentication that scales well
- **Middleware protection** - All protected routes are guarded by Next.js middleware
- **Proper logout** - Server-side cookie deletion ensures complete session termination

### Data Visualization

Uses Recharts to display:

- **Bar charts** - Sales by category
- **Pie charts** - Category distribution
- **Metrics cards** - Key performance indicators

---

## Troubleshooting

### Issue: "Failed to fetch dashboard data"

**Solution**:

- Check if MongoDB is running and accessible
- Verify `MONGODB_URI` in environment variables
- Ensure MongoDB Atlas allows connections from 0.0.0.0/0

### Issue: "Logout failed. Please try again."

**Solution**:

- Ensure `/api/auth/logout/route.js` exists
- Check Vercel function logs for errors
- Verify the file is properly deployed

### Issue: "401 Unauthorized" on deployment

**Solution**:

- Disable Vercel Deployment Protection in Settings
- Ensure all environment variables are set in Vercel
- Redeploy after making changes

### Issue: Images not uploading

**Solution**:

- Verify Cloudinary credentials in `.env.local`
- Check file size limits (max 10MB recommended)
- Ensure file is a valid image format (JPG, PNG, WebP)

---

## Technologies Used

| Technology   | Purpose                             |
| ------------ | ----------------------------------- |
| Next.js 15   | Full-stack React framework with SSR |
| React 18     | UI component library                |
| MongoDB      | NoSQL database                      |
| Mongoose     | MongoDB object modeling             |
| Tailwind CSS | Utility-first CSS framework         |
| Recharts     | Data visualization                  |
| Cloudinary   | Image hosting and optimization      |
| JWT          | Authentication tokens               |
| Zod          | Input validation                    |
| Vercel       | Deployment platform                 |

---

## Future Enhancements

- Customer-facing storefront
- Advanced filtering and search
- Bulk product import/export
- Email notifications for orders
- Multi-currency support
- Inventory alerts
- Sales forecasting
- Role-based permissions (Super Admin, Editor, Viewer)

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

