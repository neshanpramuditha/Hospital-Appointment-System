# 🩺 CLINEXA - Hospital Appointment Management System

### SSWST 32043 - Software Architecture and Concepts (Mini Group Project)
---
## 📖 Project Description

The **Hospital Appointment Management System** is a web-based application developed to simplify hospital appointment scheduling and healthcare management. The system provides separate portals for **Patients, Doctors, and Administrators**, enabling secure authentication, role-based access control, appointment booking, doctor schedule management, and patient record management.

The application improves the efficiency of hospital operations by reducing manual work while providing an intuitive and responsive user experience.

---

## 👥 Group Members

| Student ID  | Full Name | Responsibilities                                                                                                                      |
| ----------- | --------------------| ----------------------------------------------------------------------------------------------------------------------------|
| CT/2021/009 | PREMARATHNA A.H.N.P | System Architecture, Database Design, Supabase Integration, Authentication and Rollbase access control, Home, About and Contact pages, UI and Prototyping, Integrate all basic functionalities  |
| CT/2021/010 | CHAMARA B.P         | Appointment & Schedule Management Module                                                                                    |
| CT/2021/027 | ERANDA K.K.D.J      | Patient Management Module, Functional support for managing databases, Supervise modules developments - Admin dashboard, Doctor management, Appointment management, and Schedule management. |                                                        
| CT/2021/063 | DILSARA S.A.K.N     | Doctor Management Module, Reports                                                                                           |
| CT/2021/083 | A ASWINI            | Admin Dashboard, Reports, Testing & Presentation                                                                            |

---

# 🛠 Technologies Used

### Frontend

* React.js
* Vite
* JavaScript
* Tailwind CSS
* React Router DOM
* React Hot Toast
* React Icons
* Google OAuth

### Backend

* Supabase Authentication
* Supabase Database (PostgreSQL)

### Database

* PostgreSQL (Supabase)

### Development Tools

* Visual Studio Code
* Git
* GitHub
* npm
* Google Cloud Console (OAuth)
* Figma (UI Design)

---

# ⚙️ Installation / Setup

## 1. Clone the repository

```bash
git clone https://github.com/neshanpramuditha/Hospital-Appointment-System.git
```

---

## 2. Navigate to the project

```bash
cd Hospital-Appointment-System
```

---

## 3. Install dependencies

```bash
npm install
```

---

## 4. Configure Environment Variables

Create a **.env** file in the project root.

```env
VITE_SUPABASE_URL=SUPABASE_PROJECT_URL

VITE_SUPABASE_ANON_KEY=SUPABASE_ANON_KEY

VITE_GOOGLE_CLIENT_ID=GOOGLE_CLIENT_ID
```

It should replace the above values with real Supabase and Google OAuth credentials.👆
(We can't reveal it in the public repository for security reasons)

---

## 5. Configure Supabase

Create the required database tables:

* admins
* users
* patients
* doctors
* appointments
* schedules
* specializations

Enable:

* Email Authentication
* Google Authentication
* Row Level Security (RLS) Policies

---

# ▶️ Running the Project

Start the development server.

```bash
npm run dev
```

The application will be available at

```
http://localhost:5173
```

---

# ✨ Main Features

| Feature                    | Description                                                   | Responsible Member                                  |
| -------------------------- | ------------------------------------------------------------- | --------------------------------------------------- |
| Role-Based Access Control  | Admin, Doctor and Patient authorization                       | Member 1 (CT/2021/009)                              |
| Patient Management         | Update Profile, View Personal Information, Add an appointment | Member 2 (CT/2021/027)                              |
| Doctor Management          | Manage Doctors and Specializations                            | Member 3 (CT/2021/063)                              |
| Appointment Management     | Book, Update and Cancel Appointments                          | Member 4 (CT/2021/010)                              |
| Doctor Schedule Management | Manage Available Time Slots                                   | Member 4 (CT/2021/010)                              |
| Dashboard                  | Personalized Dashboard for each User Role                     | Member 2, Member 3                                  |
| Admin Dashboard            | Hospital Statistics and System Management                     | Member 5 (CT/2021/083)                              |
| Responsive UI              | Mobile Friendly Interface                                     | All group members separately related to their parts |
| Testing & Bug Fixing       | Functional Testing and Improvements                           | All group members                                   |

---

# 🔐 User Roles

### 👨‍💼 Administrator

* Manage Doctors
* Manage Patients
* Manage Appointments
* Manage System Data

### 👨‍⚕️ Doctor

* View Assigned Appointments
* Manage Schedule
* View Patient Information
* Update Profile

### 🧑‍⚕️ Patient

* Register/Login
* Book Appointments
* View Appointment History
* Update Profile

---

# 📂 Basic Project Structure

```
src/
│
├── assets/
├── components/
├── context/
├── layouts/
├── pages/
├── routes/
├── services/
├── utils/
└── App.jsx
```

---

# 🔑 Authentication

* Email & Password Authentication
* Google OAuth Login
* Forgot Password
* OTP Email Verification
* Secure Session Management

---

# 📊 Database

Main Tables

* admins
* users
* patients
* doctors
* appointments
* schedules
* specializations

---

# 🚀 Future Improvements

* Email Notifications
* SMS Appointment Reminders
* Doctor Availability Calendar
* Online Payments
* Admin Reports & Analytics

---

# 📈 GitHub Contribution Summary

GitHub Insights can be used to view:

* Number of commits
* Lines of code contributed
* Pull Requests
* Issues
* Repository activity

---

# 📄 License

This project was developed solely for academic purposes as part of the **SWST 32043 - Software Architecture and Concepts** module.

---
**Group No 01** 💁‍♂️🙋🙎‍♂️🙅‍♂️🙍‍♀️
