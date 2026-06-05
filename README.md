# 📱 Mini Social App (MERN Stack)

This is a premium MERN stack social feed application built for the **3W Full-Stack Internship Assignment**. The application mimics the user flow, styling, and design system of the **Social Page** of the TaskPlanet mobile application. It features a clean, responsive interface, touch-swipable auto-rotating onboarding welcome screen, credential error validations, paginated feed updates, email/password JWT authentication, and interactive likes and comments.

---

## 🔗 Live Deployments

* **Frontend (Vercel):** [https://3w-mini-social-app.vercel.app/](https://3w-mini-social-app.vercel.app/)
* **Backend (Render):** [https://threew-mini-social-backend.onrender.com/](https://threew-mini-social-backend.onrender.com/)

---

## 🛠️ Project Directory Structure

```
Mini-Social-App/
│
├── frontend/                     # React + TypeScript + Vite Client
│   ├── public/                   # Static public assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx        # Navigation bar (First-letter avatars)
│   │   │   ├── PostCard.tsx      # Social post element (Likes, comments, metadata)
│   │   │   └── ProtectedRoute.tsx # Route guard wrapper for auth
│   │   ├── context/
│   │   │   └── AuthContext.tsx   # Auth state, login/signup handlers
│   │   ├── pages/
│   │   │   ├── Welcome.tsx       # Onboarding carousel (Touch swipe + Auto loop)
│   │   │   ├── Login.tsx         # User login (Dynamic inline error displays)
│   │   │   ├── Signup.tsx        # User registration
│   │   │   └── Feed.tsx          # Paginated feed, Create post dialog
│   │   ├── App.tsx               # Client router & Layout config
│   │   ├── index.css             # Unified light design stylesheet
│   │   └── main.tsx              # React mounting root
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                      # Node.js + Express + Mongoose Server
│   ├── config/
│   │   └── db.js                 # MongoDB connection setup
│   ├── middleware/
│   │   └── auth.js               # JWT validation route guard
│   ├── models/
│   │   ├── User.js               # User collection database schema
│   │   └── Post.js               # Post collection database schema (Embedded document model)
│   ├── routes/
│   │   ├── auth.js               # Auth routes (Signup, Login, Get logged user)
│   │   └── posts.js              # Post actions (Create, Get paginated, Like, Comment)
│   ├── .env                      # Local server configuration parameters
│   ├── package.json
│   └── server.js                 # Application entry file
│
└── README.md                     # Documentation file
```

---

## 🚀 Key Features

* **Strict 2 Collections Constraint:** Database design respects the assignment criteria strictly by keeping only `users` and `posts` collections (comments and likes arrays are embedded inside the `posts` document).
* **Touch-Swipable Welcome Onboarding Carousel:** Welcome screen onboarding supports mobile touch swipe gestures (`onTouchStart`, `onTouchMove`, `onTouchEnd`) along with automatic image slide loops every `2.5 seconds` with a spring-bounce motion transition.
* **Instant Engagement UI:** Toggling likes uses Optimistic UI updates. Comment counts and content update immediately on submit.
* **Dynamic Inline Error Displays:** Handled state updates correctly without triggering page reloads/unmounts during failed login or registration requests.
* **Unified Light Design System:** Applied a clean, polished, state-of-the-art interface matching the TaskPlanet design palette.
* **Efficient Feed Pagination:** Fetches feed posts in batches of 5 posts with a "Load More" button to minimize server load.
* **Double Image Posting Mode:** Supports copy-pasting direct image URLs or uploading local files (automatically converted into Base64 strings for DB storage).

---

## 🗄️ Database Design (Strictly 2 Collections)

### 1. `users` Collection
Stores hashed login credentials and details.
```json
{
  "_id": "ObjectId",
  "username": "String (required, unique)",
  "email": "String (required, unique, lowercase)",
  "password": "String (hashed)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 2. `posts` Collection
Stores post entries. Likes and comments are embedded directly within each post document to ensure high query speeds.
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (ref User)",
  "username": "String",
  "content": "String (optional if image present)",
  "imageUrl": "String (Base64 file or raw URL, optional)",
  "likes": [
    {
      "user": "ObjectId (ref User)",
      "username": "String"
    }
  ],
  "comments": [
    {
      "_id": "ObjectId",
      "user": "ObjectId (ref User)",
      "username": "String",
      "text": "String",
      "createdAt": "Date"
    }
  ],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## ⚙️ Local Installation & Setup

### Prerequisites
* **Node.js** (v18+)
* **MongoDB Atlas** Cluster

### 1. Setup & Run Backend
1. Navigate to `/backend`:
   ```bash
   cd backend
   ```
2. Create/edit `backend/.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_signing_secret
   NODE_ENV=development
   ```
3. Install dependencies and start the hot-reload nodemon server:
   ```bash
   npm install
   npm run dev
   ```
   The backend will start running on `http://localhost:5000`.

### 2. Setup & Run Frontend
1. Open another terminal and navigate to `/frontend`:
   ```bash
   cd frontend
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will open on `http://localhost:5173`.

---

## ☁️ Deployment Configurations

### Backend (Render)
* **Build Command:** `npm install`
* **Start Command:** `npm start`
* Set the environment variables `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production` inside the Render dashboard configuration settings.

### Frontend (Vercel)
* **Build Command:** `npm run build`
* **Output Directory:** `dist`
* **Environment Variable:** Add key `VITE_API_URL` pointing to your Render deployment URL (e.g., `https://threew-mini-social-backend.onrender.com/api`).
