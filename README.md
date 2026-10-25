# CareerConnect — ICTAK Capstone Internship & Job Portal
### Full Stack Application Development with MERN Stack
**Information & Communication Technology Academy of Kerala (ICTAK)**  
*Summer Internship & Final Capstone Evaluation*

---

## 🌟 Project Overview

**CareerConnect** is a full-featured, production-ready MERN Stack (MongoDB, Express.js, React.js, Node.js) web platform engineered to bridge the gap between fresh engineering graduates and tech employers. Designed especially for academia and career development centers like **ICT Academy of Kerala**, CareerConnect facilitates verified internship placements, real-time application tracking, multi-role authentication, and seamless employer recruiting.

- **Developer:** Fayiz Mohammed (`fayiz225027`)
- **Institution:** Sahrdaya College of Engineering and Technology
- **Training Partner:** ICT Academy of Kerala (ICTAK)
- **Repository URL:** [https://github.com/fayiz225027/careerconnect-capstone-mern](https://github.com/fayiz225027/careerconnect-capstone-mern)
- **Live Deployment URL:** [https://careerconnect-capstone-mern.onrender.com](https://careerconnect-capstone-mern.onrender.com) (or local `http://localhost:5000`)

---

## 📌 Problem Statement & Target Users

### The Problem
Fresh technical graduates and interns frequently encounter fragmented job listing platforms with unverified listings, absent application feedback, and cumbersome communication channels. Recruiter portals are often disconnected from academic tracking.

### The Solution
CareerConnect offers a centralized, role-based ecosystem where:
1. **Students** can discover verified opportunities filtered by tech stack domain, bookmark favorites, apply with one-click resume attachments, and track candidate progression in real-time.
2. **Recruiters** can post opportunities, review candidate portfolios, evaluate applicants, update application status (`Reviewed`, `Shortlisted`, `Accepted`, `Rejected`), and deliver constructive feedback.
3. **Academic Administrators** can oversee platform-wide metrics, monitor company activity, and moderate user registries.

---

## 🏗️ System Architecture & MERN Stack Flow

CareerConnect strictly follows the separation of concerns outlined in the **ICTAK MERN Reference Guide**:

```
+-------------------------------------------------------------------------+
|                               Client-Side                               |
|       React 18 (Vite SPA) + React Router v6 + Context API + Axios       |
+-------------------------------------------------------------------------+
                                    │  ▲
              JSON HTTP Requests    │  │  JSON API Responses
       (JWT Authorization Bearer)   ▼  │
+-------------------------------------------------------------------------+
|                               Server-Side                               |
|    Node.js + Express.js REST API + Route Controllers + JWT Middleware    |
+-------------------------------------------------------------------------+
                                    │  ▲
                Mongoose ODM Models │  │  Query Results
                & Validations       ▼  │
+-------------------------------------------------------------------------+
|                             Database Tier                               |
|             MongoDB Atlas Cloud Database (Document Storage)             |
+-------------------------------------------------------------------------+
```

---

## 🚀 Key Features

### 1. Robust Authentication & Role-Based Access Control (RBAC)
- Secure registration and login powered by **JSON Web Tokens (JWT)** and **bcryptjs** (salted password hashing).
- Granular permissions based on user roles: `student`, `recruiter`, and `admin`.
- Route guards on both React client-side (`ProtectedRoute`) and Express backend (`protect`, `authorize`).

### 2. Job & Internship Management (CRUD)
- Full CRUD operations on job postings: Create, Read (single & paginated list), Update, and Delete.
- Dynamic full-text search across position titles, companies, and descriptions.
- Multi-parameter filtering by **Category** (MERN, React, Node.js, AI, DevOps, UI/UX), **Employment Type** (Internship, Full-time, Remote), and **Location**.

### 3. Student Application & Tracking Engine
- Prevent duplicate applications via MongoDB compound indexing (`job + applicant`).
- One-click application submission with resume/portfolio URL and custom cover letters.
- Real-time status badges: `Pending` ➔ `Reviewed` ➔ `Shortlisted` ➔ `Accepted` / `Rejected`.
- Candidate ability to withdraw pending applications.

### 4. Recruiter Evaluation Suite
- Dedicated recruiter portal listing all company openings with live applicant counts.
- Candidate evaluation interface allowing recruiters to inspect resumes, technical skills, and cover notes.
- In-place application status toggling with personalized recruiter feedback notes.

### 5. Platform Administrator Console
- Platform health analytics: active users, student/recruiter breakdowns, open positions, and total applications.
- User management registry with moderation and account removal capabilities.

### 6. Bookmarking & Personalized Student Profiles
- Ability for students to save listings to their personal watchlist.
- Comprehensive user profile management with bio, tech skills tags, portfolio link, and contact details.

---

## 🔑 Fast Evaluation Credentials (1-Click Login)

For immediate testing, pre-seeded accounts are active in the database:

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Student** | `fayiz225027@sahrdaya.ac.in` | `Password@123` | Browse jobs, apply, track status, bookmark, update profile |
| **Recruiter** | `recruiter@techverve.com` | `Password@123` | Post opportunities, manage listings, evaluate applicants, give feedback |
| **Admin** | `admin@ictkerala.org` | `Password@123` | Full system access, platform analytics, user registry moderation |

*(Quick 1-click fill buttons are also embedded directly on the Login page!)*

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router DOM v6, Axios, Lucide React Icons, Responsive Modern CSS |
| **Backend** | Node.js, Express.js, JSON Web Tokens (JWT), bcryptjs, CORS, Morgan, dotenv |
| **Database** | MongoDB Atlas (Cloud Cluster), Mongoose ODM (Schemas, Middleware, Compound Indexes) |
| **Tooling & CI** | Git, GitHub, Puppeteer-Core (Automated Visual QA), npm |

---

## 📡 API Contract Specification

| Method | Endpoint | Access | Purpose | Success Code |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new student or recruiter | `201 Created` |
| `POST` | `/api/auth/login` | Public | Authenticate user and issue JWT token | `200 OK` |
| `GET` | `/api/auth/me` | Private | Get profile of logged-in user | `200 OK` |
| `PUT` | `/api/auth/profile` | Private | Update user profile, skills, and bio | `200 OK` |
| `POST` | `/api/auth/save-job/:id` | Private (Student) | Toggle bookmark on an opportunity | `200 OK` |
| `GET` | `/api/jobs` | Public | Search, filter, and paginate active jobs | `200 OK` |
| `GET` | `/api/jobs/:id` | Public | Get full details of a specific job | `200 OK` |
| `POST` | `/api/jobs` | Private (Recruiter/Admin) | Create a new job listing | `201 Created` |
| `PUT` | `/api/jobs/:id` | Private (Creator/Admin) | Update an existing job listing | `200 OK` |
| `DELETE`| `/api/jobs/:id` | Private (Creator/Admin) | Delete a job and related applications | `200 OK` |
| `POST` | `/api/applications/:jobId` | Private (Student) | Submit application with resume link | `201 Created` |
| `GET` | `/api/applications/my` | Private (Student) | Retrieve user's submitted applications | `200 OK` |
| `GET` | `/api/applications/job/:id`| Private (Recruiter) | View applicants for a specific job | `200 OK` |
| `PUT` | `/api/applications/:id/status`| Private (Recruiter) | Update candidate status & feedback | `200 OK` |
| `DELETE`| `/api/applications/:id` | Private (Student) | Withdraw a pending application | `200 OK` |
| `GET` | `/api/admin/overview` | Private (Admin) | Retrieve platform-wide metrics | `200 OK` |
| `GET` | `/api/admin/users` | Private (Admin) | Retrieve system user registry | `200 OK` |
| `DELETE`| `/api/admin/users/:id` | Private (Admin) | Remove a user and associated records | `200 OK` |
| `GET` | `/api/health` | Public | Health check ping for monitoring | `200 OK` |

---

## 💻 Local Installation & Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/fayiz225027/careerconnect-capstone-mern.git
cd careerconnect-capstone-mern
```

### 2. Configure Environment Variables
Create a `.env` file in the `server` directory (refer to `server/.env.example`):
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 4. Seed Database with Initial Data
From the `server` folder, execute the seed script:
```bash
node src/seed.js
```

### 5. Run the Application
In terminal 1 (Backend API server):
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

In terminal 2 (Frontend Client):
```bash
cd client
npm run dev
# Frontend starts on http://localhost:5173
```

---

## 📸 Screenshots Gallery

| Screen | Description |
| :--- | :--- |
| **01. Homepage** | Hero section, live platform statistics, and featured opportunities |
| **02. Opportunities Catalog** | Multi-attribute search, category filtering, and responsive grid |
| **03. Job Details** | Detailed requirements, compensation, and application trigger |
| **04. Login Portal** | Secure JWT authentication with 1-click evaluation shortcuts |
| **05. Student Dashboard** | Metrics on applications, bookmarked jobs, and recent activity |
| **06. My Applications** | Real-time candidate tracking with official recruiter feedback notes |
| **07. Student Profile** | Skill tags, bio, portfolio, and resume management |
| **08. Recruiter Dashboard** | Active job listings and candidate submission counters |
| **09. Recruiter Job Management** | Status toggles (Active/Closed) and job actions |
| **10. Post Opportunity** | Comprehensive job creation form |
| **11. Applicant Evaluation** | Candidate inspection, resume links, feedback notes, and status updates |
| **12. ICTAK Admin Console** | Platform analytics and user registry moderation |

*(High-resolution images are located in the `/screenshots` directory).*

---

## 📄 Submission Documents

All formal project artifacts required by ICT Academy of Kerala are prepared in the `/docs` folder:
1. **Software Requirements Specification (SRS)**: [`docs/SRS_CareerConnect.docx`](./docs/SRS_CareerConnect.docx) & [`docs/SRS_CareerConnect.md`](./docs/SRS_CareerConnect.md)
2. **Final Internship & Capstone Project Report**: [`docs/CareerConnect_Project_Report_ICTAK.docx`](./docs/CareerConnect_Project_Report_ICTAK.docx) & [`docs/CareerConnect_Project_Report_ICTAK.md`](./docs/CareerConnect_Project_Report_ICTAK.md)

---

## ⚖️ Self-Review & Defense Checklist (ICTAK Guidelines)

- [x] **Does the MVP work end-to-end without workarounds?** Yes. A candidate can register, search, apply, and receive an evaluation from a recruiter in real-time.
- [x] **Are environment secrets protected?** Yes. All connection strings and JWT secrets reside in `.env` (gitignored), with `.env.example` provided.
- [x] **Is validation enforced on both ends?** Yes. Controlled forms validate in React, while Express middleware and Mongoose schema rules validate on the backend.
- [x] **Is Role-Based Access Control verified?** Yes. Unauthorized access to recruiter or admin routes is blocked with HTTP 401/403 and client-side redirects.
- [x] **Are all UI states handled?** Yes. Loading skeletons, friendly empty states, error banners, and success feedback are present across all views.
