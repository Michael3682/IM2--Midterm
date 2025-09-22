# IM2--Midterm Project Setup Guide

This guide will help you set up and run both the client (Next.js) and server (Express) for your project.

---

## Prerequisites
- **Node.js** (v18 or later recommended)
- **npm** (comes with Node.js)
- **MySQL** (or compatible database)

---

## 1. Clone the Repository
```
git clone <your-repo-url>
cd IM2--Midterm
```

---

## 2. Server Setup

### a. Install dependencies
```
cd server
npm install
```

### b. Configure Environment Variables
Create a `.env` file in the `server` directory with the following (edit values as needed):
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=yourdbname
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

### c. Start the Server
```
npm run dev
```
The server will run on `http://localhost:5000` by default.

---

## 3. Client Setup

### a. Install dependencies
```
cd client
npm install
```

### b. Configure Environment Variables
Create a `.env.local` file in the `client` directory with:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
```

### c. Start the Client
```
npm run dev
```
The client will run on `http://localhost:3000` by default.

---

## 4. Usage
- Register a new user or sign in with Google.
- Use the main, profile, onboarding, and change password features as needed.
- For password reset, use the "Forgot Password?" link on the login page.

---

## 5. Troubleshooting
- Ensure both client and server are running.
- Check your `.env` files for correct values.
- Make sure your MySQL server is running and accessible.
- For Google OAuth, set up credentials at https://console.developers.google.com and use the correct callback URL (`http://localhost:3000/api/auth/callback/google`).

---

## 6. Scripts
- `npm run dev` (client): Start Next.js in development mode
- `npm run dev` (server): Start Express server

---

## 7. Folder Structure
- `client/` - Next.js frontend
- `server/` - Express backend

---

## 8. Contact
For issues, please open an issue on the repository or contact the maintainer.
