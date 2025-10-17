# 🔐 Auth Pages

A full-featured authentication system built with **Next.js** and **TypeScript**, including **Login**, **Register**, and **Dashboard** pages.  
Unlike a simple UI project, this app communicates with a real **API** to register users, authenticate logins, and display user data dynamically.

---

## 🚀 Features

- 🧾 **User Registration & Login** connected to backend API  
- 🔑 **token-based Authentication**  
- 🧠 **React Hook Form** for form validation and input handling  
- 🔔 **React Hot Toast** for interactive feedback and notifications  
- 🎨 **SCSS Modules** for modular, scalable styling  
- 📊 **Dashboard page** showing user information fetched from API  
- ⚡ **Next.js (App Router)** with **TypeScript (.tsx)** support  
- 📱 Fully responsive and mobile-friendly layout  

---

## 🌐 API Integration

This project is connected to a live API for authentication.  
You can set your own API endpoint in the `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=https://share.apidog.com/4b7ea7f3-044c-4fa5-934b-3ad39e0f9619/user-info-20619547e0
```
---

## Tech Stack

| Category      | Technologies                                    |
| ------------- | ----------------------------------------------- |
| Framework     | [Next.js](https://nextjs.org/)                  |
| Language      | [TypeScript](https://www.typescriptlang.org/)   |
| Forms         | [React Hook Form](https://react-hook-form.com/) |
| Notifications | [React Hot Toast](https://react-hot-toast.com/) |
| Styling       | [SCSS Modules](https://sass-lang.com/)          |
| HTTP Client   | [Axios](https://axios-http.com/)                |
| Deployment    | [Vercel](https://vercel.com/)                   |

---

## 🧰 Tech Stack

| Category | Technologies |
|-----------|--------------|
| Framework | [Next.js](https://nextjs.org/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Forms | [React Hook Form](https://react-hook-form.com/) |
| Notifications | [React Hot Toast](https://react-hot-toast.com/) |
| Styling | [SCSS Modules](https://sass-lang.com/) |
| Build Tool | [Vite](https://vitejs.dev/) (if used locally) |

## ⚙️ Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/sadeghdev1/auth-pages.git

# 2. Navigate to the project directory
cd auth-pages

# 3. Install dependencies
npm install

# 4. Run the development server
npm run dev

# 5. Open the app
# Visit http://localhost:3000
```

---

## 🧑‍💻 How It Works

### 1. Register:

• User submits credentials to the /register API endpoint.

• Backend creates a new user and returns a token.

### 2. Login:

• User submits login credentials to /login.

• If valid, receives a token stored in cookies for session management.

### 3. Dashboard:

• Accessed only after authentication.

• Displays user data fetched securely from /user or /profile endpoint.

---

## 📦 Deployment

Deployed with Vercel:

👉 Live Demo: https://auth-pages1.vercel.app
