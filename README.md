# Server-Rendered E-commerce Product Management Dashboard

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

### 2. Product Management (CRUD)
- Admins can:
  - **Create** new products
  - **View** all products
  - **Edit** existing products
  - **Delete** products
- Product data is stored in a database and updated in real time.

### 3. Multi-Step Product Creation Form
- Step 1: Enter product details such as name, description, price, stock, category, and SEO information.
- Step 2: Upload product images securely.
- Prevents incomplete or invalid submissions.

### 4. Strong Input Validation
- Uses **Zod schema validation** to validate all product inputs.
- Prevents negative prices, missing required fields, and incorrect data types.
- Displays user-friendly error messages.

### 5. Secure Image Upload
- Product images are uploaded securely using a cloud storage service (Cloudinary or AWS S3).
- Only image files are accepted.
- Uploaded images are stored as URLs in the database.

### 6. Authentication and Authorization
- Only authenticated **admins** can access the dashboard.
- Non-admin users are restricted from viewing or modifying product data.
- Includes logout functionality.

### 7. Admin-Only Onboarding
- Admin creation or onboarding functionality is visible **only to existing admins**.
- Prevents unauthorized access to sensitive features.

### 8. Interactive UI and Clean Design
- Built using modern UI components.
- Organized layout with clear sections for product information.
- Responsive design for different screen sizes.

---

## Tech Stack

### Frontend & Backend
- **Next.js** – Server-side rendering and full-stack framework

### Data Fetching
- **React Query** – Efficient data fetching and revalidation

### Form Validation
- **Zod** – Schema-based input validation

### Data Visualization
- **Recharts** – Interactive charts for sales and stock insights

### Image Storage
- **Cloudinary** – Secure image upload and storage

### Database
- **MongoDB** – Persistent product data storage

---

## Application Workflow

1. Admin requests the dashboard page  
2. Server fetches product data from the database  
3. Page is rendered on the server and sent to the browser  
4. Admin interacts with product forms and charts  
5. Product data is created, updated, or deleted  
6. UI refreshes by re-fetching the latest data  

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <https://github.com/ParshvMeshiya/SSR-Rendered-E-commerce-Admin-Website>
cd ecommerce-admin-dashboard
```
### 2. Install Dependencies

Install all required packages for the project:

```bash
npm install
```

### 3. Environment Variables Setup

Create a `.env.local` file in the root directory and add the following:

```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ADMIN_SECRET_KEY=your-admin-secret-key
```
---

## Explanation of Environment Variables

- **MONGODB_URI**  
  Connection string for MongoDB database where product, user, and admin data is stored.

- **JWT_SECRET**  
  Secret key used to sign and verify JSON Web Tokens for authentication.

- **CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET**  
  Credentials used to securely upload and store product images on Cloudinary.

- **NEXT_PUBLIC_BASE_URL**  
  Base URL of the application, used for API calls and deployment configuration.

- **ADMIN_SECRET_KEY**  
  A security key used to restrict **admin onboarding and privileged actions**.  
  Only users with this key can create or manage admin accounts, preventing unauthorized access.

## Running the Application Locally

After setting up environment variables, start the development server:

```bash
npm run dev