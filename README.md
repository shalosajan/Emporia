# 🌌 Emporia E-Commerce Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg) ![React](https://img.shields.io/badge/frontend-React_Vite-61DAFB.svg) ![Django](https://img.shields.io/badge/backend-Django_Rest_Framework-092E20.svg)

**Emporia** is a next-generation, multi-vendor e-commerce platform designed with a premium "Deep Space" aesthetic. It features a robust Django REST Framework backend and a high-performance React frontend, offering a seamless experience for customers, sellers, and administrators alike.

---

## ✨ Key Features

### 🛍️ Public Storefront
-   **Immersive UI**: "Deep Space" theme with glassmorphism, smooth Framer Motion animations, and responsive layouts.
-   **Product Discovery**: Advanced search, category filtering, and masonry grid layouts.
-   **Interactive Details**: High-res image zooming, real-time stock indicators, and dynamic "Add to Cart" interactions.
-   **Reviews & Ratings**: Verified purchase badges, star ratings, and photo reviews.

### 👤 User Experience
-   **Secure Auth**: JWT-based authentication with role-based redirection (Customer, Seller, Admin).
-   **Smart Cart**: Real-time totals, persistent state, and easy quantity management.
-   **Checkout**: Integrated Razorpay payment gateway with an "Express" checkout flow.
-   **Order Tracking**: Detailed order history and status updates.

### 💼 Vendor Dashboard
-   **Sales Analytics**: Visual charts for traffic and revenue trends.
-   **Inventory Management**: Create, edit, and manage products with ease.
-   **Order Fulfillment**: Track and update order statuses for sold items.

### 🛡️ Admin Control Panel (Superuser)
-   **Platform Overview**: Real-time metrics on revenue, users, and active orders.
-   **User Management**: Ban/Unban users and secure "Impersonation Mode" for support.
-   **Content Moderation**: Review and moderate user-submitted reviews.
-   **Audit Logs**: Comprehensive tracking of sensitive system actions.
-   **RBAC**: Granular permission control for Support, Managers, and Super Admins.

---

## 🛠️ Technology Stack

### Frontend
-   **Framework**: React 18 + Vite
-   **Styling**: Tailwind CSS 4 + Custom CSS Variables
-   **Animation**: Framer Motion
-   **Icons**: Lucide React
-   **Charts**: Recharts
-   **State Management**: React Context API

### Backend
-   **Framework**: Django 5 + Django REST Framework
-   **Authentication**: SimpleJWT
-   **Database**: PostgreSQL (Production) / SQLite (Dev)
-   **Media**: Pillow (Image Processing)
-   **Utils**: Django Filter, Corsheaders

---

## 🚀 Getting Started

### Prerequisites
-   **Node.js** (v16+)
-   **Python** (v3.10+)
-   **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/shalosajan/emporia.git
cd emporia
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create Superuser (Admin)
python manage.py createsuperuser

# Start Server
python manage.py runserver
```
*The backend runs at `http://127.0.0.1:8000`*

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Development Server
npm run dev
```
*The frontend runs at `http://localhost:5173`*

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/main` directory (next to `settings.py`) with the following keys:

```ini
# Backend Secrets
SECRET_KEY=your_django_secret_key
DEBUG=True
RAZORPAY_KEY_ID="YourRazorpayKeyID"
RAZORPAY_KEY_SECRET="YourRazorpayKeySecret"
ALLOWED_HOSTS=127.0.0.1,localhost

# Database (Optional, defaults to SQLite)
# DB_NAME=emporia
# DB_USER=postgres
# DB_PASSWORD=password
# DB_HOST=localhost
# DB_PORT=5432
```

## 🧪 Testing & Verification

The platform includes a suite of custom scripts to verify backend logic, security boundaries, and API integrity. Run these from the `backend/` directory:

| Script | Purpose | Command |
| :--- | :--- | :--- |
| **Admin Setup** | Creates the initial Superuser for the platform. | `python scripts/create_admin.py` |
| **Audit Logs** | Verifies that staff actions are correctly recorded. | `python scripts/verify_audit_logs.py` |
| **Permissions** | Tests RBAC logic (Support vs. Manager access). | `python scripts/verify_staff_permissions.py` |
| **API Suite** | Comprehensive check of all Admin API endpoints. | `python scripts/verify_full_admin_suite.py` |

> **Note:** Ensure the Django development server is running (`runserver`) before executing API-based verification scripts.

---

## 📦 Project Structure

```
emporia/
├── backend/                # Django Project
│   ├── main/               # Settings & Config
│   ├── store/              # Product & Category Logic
│   ├── users/              # Auth & Profiles
│   ├── orders/             # Order Processing
│   ├── reviews/            # Rating & Review System
│   └── manage.py
│
└── frontend/               # React Project
    ├── src/
    │   ├── components/     # Reusable UI Components
    │   ├── context/        # Global State (Auth, Cart, Alerts)
    │   ├── layouts/        # Page Layouts (Main, Admin)
    │   ├── pages/          # Application Routes
    │   └── utils/          # API Helpers
    └── package.json
```

---

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
