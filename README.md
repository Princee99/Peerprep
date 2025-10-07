# 🎓 PeerPrep – CHARUSAT Placement Preparation Platform

**PeerPrep** is a placement preparation platform built for **CHARUSAT University** to connect students and alumni.  
It simplifies placement preparation by providing dashboards, and an automated system that sends login credentials via personalized HTML emails.

---

## ✨ Overview

PeerPrep bridges the gap between **students** and **alumni** by enabling collaboration, mentorship, and interview preparation.  
It provides:
- Role-based access control (Student, Alumni, Admin)
- Bulk Excel upload for user management
- Automatic email generation with custom templates
- Secure login system using JWT
- Responsive and modern UI for dashboards

---

## 🚀 Key Features

### 📧 Automated Email System
- Sends personalized HTML emails to students and alumni when accounts are created.
- Dynamic content adjusts based on role:
  - 🎓 Student: Placement preparation guidance & connection opportunities  
  - 👨‍💼 Alumni: Mentorship invitation & contribution encouragement
- Built with **Nodemailer** and **HTML templates** for professional formatting.
- Securely includes login credentials (email and auto-generated password).

### 👥 Role-Based Access
- **Admin:** Manage users, upload Excel sheets, trigger email notifications.  
- **Student:** Access placement prep dashboard, connect with alumni, explore interview insights.  
- **Alumni:** Share experiences, answer student questions, and mentor.

### 🗂 Bulk User Management
- Import user lists via Excel.  
- Automatically assign credentials and send emails.  
- Supports validation to prevent duplicate or missing data.

### 💻 Interactive Dashboards
- Built with **React.js** and **Tailwind CSS**.  
- Displays personalized data and statistics.  
- Uses **React Context API** for global state management.

### 🔒 Secure Authentication
- Implements **JWT-based login system**.  
- Enforces password change on first login for enhanced security.

---

## 🛠️ Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend** | React.js, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **Email Service** | Nodemailer |
| **File Handling** | FS, XLSX |
| **Authentication** | JWT (JSON Web Token) |
| **Version Control** | Git & GitHub |

---

