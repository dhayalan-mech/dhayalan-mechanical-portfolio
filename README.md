# Dhayalan R - Mechanical Engineering Portfolio Website

A professional, full-stack Mechanical Engineering portfolio website built for **Dhayalan R** (3rd Year Student & SolidWorks Learner at Alagappa Chettiar Government College of Engineering and Technology).

## Tech Stack
- **Frontend**: React + Vite + Custom CAD/Engineering CSS Design System
- **Backend**: Node.js + Express
- **Database**: SQLite (automatically initialized & seeded)
- **File Uploads**: Multer local storage (`server/uploads/`)
- **Icons**: Lucide React

---

## Quick Start Commands

### 1. Installation
Install dependencies for both client and server:
```bash
npm run setup
```
*(Or run `npm install` inside `server/` and `client/` manually)*

### 2. Development Mode
Start both client and server concurrently:
```bash
npm run dev
```

### 3. Production Build
Build React assets for production:
```bash
npm run build
```

### 4. Production Start
Run full-stack application on a single port (5000):
```bash
npm start
```

---

## Public Routes
- `/` - Home
- `/about` - About Me
- `/education` - Education
- `/skills` - Technical & CAD Skills
- `/projects` - Projects Portfolio
- `/certificates` - Certificates & Certifications
- `/achievements` - Achievements & Awards
- `/internship` - Internship & Industrial Training
- `/resume` - Resume View & Download
- `/contact` - Contact Form

---

## Admin Portal
- **URL**: `http://localhost:5000/admin` (or `/admin/login`)
- **Default Username**: `admin`
- **Default Password**: `admin123`
- Manage all content dynamically (Profile, Photo, Education, Skills, Projects, File Uploads, Resume PDF, and Contact Inbox).
