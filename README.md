
# 👕 Garments Order & Production Tracker System (Server)

![GOPTS Banner](assets/GOPTS1.PNG)

## 📌 API Overview

This is the robust **Backend API Server** for the **Garments Order & Production Tracker System (GOPTS)**. Built with **Node.js** and **Express.js**, it orchestrates the critical logistics of garment manufacturing—managing users, products, orders, and complex production workflows.

The backend infrastructure is designed for scalability and security, employing a **Controller-Service-Repository** pattern to ensure clean separation of concerns and maintainability.

🌐 **Live API:** [https://mygopts.vercel.app/](https://mygopts.vercel.app/)

---

## 📸 App Glimpses

<div align="center">
  <img src="assets/GOPTS1.PNG" width="48%" />
  <img src="assets/GOPTS2.PNG" width="48%" />
  <img src="assets/GOPTS3.PNG" width="48%" />
  <img src="assets/GOPTS4.PNG" width="48%" />
  <img src="assets/GOPTS5.PNG" width="48%" />
  <img src="assets/GOPTS6.PNG" width="48%" />
  <img src="assets/GOPTS7.PNG" width="48%" />
</div>

---

## 🏗 Infrastructure & Architecture

### **Architecture: Controller-Service-Repository**
This project follows a structured layered architecture to ensure code modularity and testability:
1.  **Controllers:** Handle incoming HTTP requests, validate input, and send responses.
2.  **Services:** Contain the core business logic (e.g., calculating order totals, validating stock levels).
3.  **Repositories:** Manage direct database interactions (CRUD operations), keeping the data layer isolated.

### **Core Capabilities**
-   **Secure Authentication:** Firebase Admin SDK integration for verifying user tokens and managing sessions.
-   **Role-Based Access Control (RBAC):** Middleware-enforced permissions for Admin, Manager, and Buyer roles.
-   **Production Workflow:** Logic for managing complex production stages (e.g., Cutting → Sewing → Finishing).
-   **Data Validation:** Strict input validation using `express-validator` to ensure data integrity.
-   **Payment Processing:** Secure payment integration via Stripe.

---

## 🛠 Tech Stack

### Core Technologies
-   **Node.js:** Runtime environment for efficient, scalable network applications.
-   **Express.js 5:** Fast, unopinionated, minimalist web framework.
-   **MongoDB:** NoSQL database for flexible data modeling (using Native Driver for performance).

### Security & Performance
-   **CORS:** Configured Cross-Origin Resource Sharing for secure frontend communication.
-   **Express Validator:** robust middleware for data validation.
-   **Bcrypt:** Salary for hashing sensitive data (though Firebase handles auth, this is used for specific internal logic).

### Utilities & Tools
-   **Firebase Admin SDK:** Server-side authentication and user management.
-   **Stripe SDK:** Robust payment processing.
-   **Dotenv:** Environment variable management.

---

## 🚀 Installation & Setup

Follow these steps to run the server locally.

### Prerequisites
-   Node.js (v18 or higher)
-   MongoDB Instance (Local or Atlas)
-   Firebase Service Account Credentials

### 1. Clone the Repository
```bash
git clone https://github.com/Al-Roman23/gopts-server.git
cd gopts-server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
DB_USER=your_mongodb_user
DB_PASS=your_mongodb_password
DB_NAME=garments-tracker

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

### 4. Run Development Server
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

### 5. Production Build
```bash
npm start
```

---

## 📂 Project Structure

```
src/
├── app/
│   ├── controllers/    # Request handlers (Input -> Service -> Response)
│   ├── services/       # Business logic (Calculations, logic flow)
│   ├── repositories/   # Database Access Layer (MongoDB queries)
│   ├── routes/         # API endpoint definitions
│   └── validators/     # Input validation schemas
├── config/             # Configuration (DB, Firebase, Stripe)
├── middlewares/        # Custom middleware (Auth, RBAC, ErrorHandler)
├── utils/              # Helper functions (Logger, formatting)
└── server.js           # Entry point
```

---

## 📁 Key API Endpoints

### 🔐 Authentication (Users)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/users` | Create or update user profile | Public |
| `GET` | `/users/:email` | Get user details | Auth Required |
| `PATCH` | `/users/:email/role` | Promote/Demote user role | **Admin** |

### 🛒 Product Management
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/products` | Create new product | **Manager** |
| `GET` | `/products` | Get all products | Public |
| `DELETE` | `/products/:id` | Delete product | **Admin** |

### 📦 Order & Production
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/orders` | Place a new order | **Buyer** |
| `PATCH` | `/orders/:id/status` | Update production stage | **Manager** |
| `GET` | `/orders/my-orders` | Get buyer's orders | **Buyer** |

---

## 🔗 Related Repositories

- **Client Repository:** [GitHub Link](https://github.com/Al-Roman23/gopts-client.git)
- **Live Site:** [https://mygopts.web.app/](https://mygopts.web.app/)

---

## 👨‍💻 Author

**Al-Roman Molla**  
Backend-Focused Full Stack Developer

- **Email:** alromanmolla@gmail.com
- **LinkedIn:** [Profile](https://www.linkedin.com/in/al-roman/)

---

Made with ❤️ by Al-Roman!
