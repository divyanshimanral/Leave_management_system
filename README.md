# 📌 Smart Leave Management System (LMS)

A full-stack web application developed using the **MERN stack (MongoDB, Express.js, React.js, Node.js)** to automate and streamline the employee leave management process.

This project is developed as part of the **IGNOU MCA Project (MCSP-232)** and demonstrates the practical application of software engineering principles, RBAC (Role-Based Access Control), and modern web technologies.

---

## 🚀 Project Overview

The Smart Leave Management System replaces traditional manual leave processes with a centralized, digital solution. It enables employees to apply for leave, managers to approve or reject requests, and administrators to manage users and analyze leave data.

---

## 🎯 Key Features

- 🔐 JWT-based Authentication
- 🧠 Role-Based Access Control (RBAC)
- 📝 Leave Application & Tracking
- ✅ Approval/Rejection Workflow
- 📊 Analytics & Reporting Module
- 📦 MongoDB Aggregation Pipelines for insights
- 📱 Responsive UI using Vite + Tailwind + shadcn/ui

---

## 👥 Role-Based Functionality

| Feature         | Role     |
| --------------- | -------- |
| Apply Leave     | Employee |
| View Own Leaves | Employee |
| Approve Leave   | Manager  |
| Manage Users    | Admin    |
| Reports         | Admin    |

---

## 🧠 Analytics Module

This project includes an advanced analytics module using **MongoDB Aggregation Pipelines**, which provides:

- 📈 Leave trends over time
- 👤 User-wise leave reports
- 📊 Monthly and yearly analytics
- 📤 Exportable datasets for admin decision-making

---

## 🏗️ Tech Stack

### Frontend

- React.js (Vite)
- Tailwind CSS
- shadcn/ui
- Axios

### Backend

- Node.js
- Express.js

### Database

- MongoDB (Mongoose ORM)

### Security

- JSON Web Token (JWT)
- bcrypt password hashing
- Role-Based Access Control (RBAC)

---

## 📁 Project Structure

```
LMS/
│
├── client/        # Frontend (React + Vite)
├── server/        # Backend (Node + Express)
├── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```
git clone https://github.com/divyanshimanral/Leave_management_system.gits
cd LMS
```

---

### 2️⃣ Setup Backend

```
cd server
npm install
```

Create `.env` file:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run server:

```
npm run dev
```

---

### 3️⃣ Setup Frontend

```
cd client
npm install
npm run dev
```

---

## 🔗 API Endpoints (Sample)

| Method | Endpoint           | Description    |
| ------ | ------------------ | -------------- |
| POST   | /api/auth/register | Register user  |
| POST   | /api/auth/login    | Login          |
| POST   | /api/leave/apply   | Apply leave    |
| GET    | /api/leave         | Get leaves     |
| PUT    | /api/leave/:id     | Approve/Reject |

---

## 🔐 Security Features

- Secure authentication using JWT
- Role-based authorization middleware
- Password hashing using bcrypt
- Protected API routes

---

## 🧪 Testing

- Unit Testing for individual modules
- System Testing for end-to-end workflows
- Input validation and error handling

---

## 📈 Future Enhancements

- Multi-level approval system
- Mobile application (React Native)
- Payroll integration
- AI-based leave prediction

---

## 📚 References

- MongoDB Documentation
- React.js Documentation
- Node.js Documentation

---

## 👨‍💻 Author

Developed as part of MCA Project Submission (IGNOU)

---

## 📌 Conclusion

The Smart Leave Management System successfully digitizes the leave process, improves efficiency, ensures transparency, and provides valuable insights through analytics. The system is scalable, secure, and aligned with modern software development practices.
