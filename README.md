# ShopSphere – E-commerce Storefront & Admin Dashboard

ShopSphere is a responsive e-commerce web application built using React.js, Tailwind CSS, and Material UI (MUI).

It provides a user-friendly online shopping experience for customers and an easy-to-use dashboard for store administrators.

## 🚀 Tech Stack

- React.js
- JavaScript
- Tailwind CSS
- Material UI (MUI)
- React Router DOM
- Vite
- React Context API
- LocalStorage
- ApexCharts

## ✨ Project Features

### Customer Storefront

- Responsive home page
- Product listing and product details
- Product search, filtering, and sorting
- Shopping cart and wishlist
- Checkout with simulated order confirmation
- Login and registration UI
- Customer account and order history
- Contact page

### Admin Dashboard

- Dashboard overview and sales statistics
- Product management (Add, View, Edit, Delete)
- Category management
- Inventory management
- Order management
- Customer management
- Coupons and offers
- Reviews management
- Banner management
- Reports and settings

## 🧩 React Concepts Used

- Functional components and JSX
- React Hooks: useState and useEffect
- useMemo and useCallback where appropriate
- React Context API for shared state
- React Router for navigation
- Custom Hooks:
  - useLocalStorage
  - useDebounce
- Conditional rendering
- Reusable components
- Search, filtering, sorting, and pagination
- Protected admin routes

## 📁 Project Structure

```text
shopsphere/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── forms/
│   │   ├── tables/
│   │   └── layout/
│   ├── layouts/
│   ├── pages/
│   │   ├── storefront/
│   │   └── admin/
│   ├── routes/
│   ├── services/
│   ├── hooks/
│   ├── context/
│   ├── data/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/ThakorChirag2005/shopsphere-ecommerce.git
```

### 2. Navigate to the project folder

```bash
cd shopsphere
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL displayed in the terminal to view the application.

## 📱 Responsive Design

The storefront and admin interface are designed to support:

- Desktop screens
- Tablet screens
- Mobile screens

## 🔄 State Management and Data Flow

- React Context API is used to share cart and wishlist state across components without prop drilling.
- LocalStorage is used to persist supported application data across page refreshes.
- Custom hooks help reuse LocalStorage and debounced-value logic.
- Product and order updates are reflected in the relevant storefront and admin interfaces through the application's data flow.

## 🔐 Demo Admin Credentials

- Email: `admin@shopsphere.com`
- Password: `admin123`

These credentials are provided only for frontend demonstration purposes.

## ⚠️ Project Limitations

- This project uses mock data and browser LocalStorage.
- Checkout is simulated; no real payment information is collected or processed.
- No production backend or real payment gateway is integrated.
- Authentication and admin route protection are frontend demonstrations, not production security.

## 📝 Project Information

- **Project Name:** ShopSphere
- **Project Type:** E-commerce Web Application
- **Frontend Framework:** React.js
- **Build Tool:** Vite
- **Project Purpose:** SSV Infotech Internship Project

---

**Developed as part of the SSV Infotech Internship Project.**
