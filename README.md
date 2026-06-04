# Mini Social Post Application (TaskPlanet Inspired)

This is a MERN stack application built for the 3W Full-Stack Internship Assignment. It mimics the user flow and structure of the **Social Page** of the TaskPlanet mobile application, featuring a clean, responsive web interface, paginated feed updates, email/password authentication, and instant likes and comments.

---

## 🚀 Tech Stack

### Backend
* **Node.js** & **Express** for building RESTful APIs.
* **Mongoose** & **MongoDB Atlas** for database mapping.
* **JSON Web Tokens (JWT)** & **bcryptjs** for secure user login/signup.

### Frontend
* **React.js** (scaffolded via **Vite** + **TypeScript**).
* **Material UI (MUI)** for structured UI wrappers & loaders.
* **Basic CSS (Vanilla CSS)** for custom aesthetics, variables, and dark/light modes.
* **Axios** for API integrations.
* **Lucide React** for icons.

---

## 🗄️ Database Design (Strictly 2 Collections)

### 1. `users` Collection
Stores user registration profiles and hashed credentials.
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
Stores all post details. Includes embedded likes and comments arrays to keep query execution speeds high without requiring joins.
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (ref User)",
  "username": "String",
  "content": "String (optional if image present)",
  "imageUrl": "String (Base64 file or raw URL, optional if content present)",
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

## ⚙️ Installation & Running Locally

### Prerequisites
* **Node.js** (v18+)
* **MongoDB Atlas** database connection string.

### 🟢 Running the Backend
1. Open terminal and navigate to `/backend`:
   ```bash
   cd backend
   ```
2. Open the `.env` file in the `backend/` directory. Fill in your MongoDB Atlas connection string and your JWT secret:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
3. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```
   The backend will start running on `http://localhost:5000`.

---

### 🔵 Running the Frontend
1. Open another terminal and navigate to `/frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:5173`. Open this URL in your browser.

---

## 🎯 Key Features Implemented

* **Strict 2 Collections Rule:** Respects the database constraints exactly as instructed.
* **Instant Engagement UI:** Likes toggle instantly (using Optimistic UI state updates) and comment submissions show up immediately in the comments drawer.
* **Double Image Posting:** Users can post images by pasting direct image links (URLs) or by uploading local images (converts automatically to direct Base64 inline strings, which avoids needing external upload integrations like AWS S3 or Cloudinary).
* **Robust Authentication Flow:** Sign Up $\rightarrow$ Login $\rightarrow$ Feed $\rightarrow$ Create Post/Like/Comment. Guest users can browse the feed, but must log in to create posts, like, or comment.
* **Bonus - Efficient Pagination:** The Feed list page loads posts in batches of 5 posts at a time with a "Load More" button, reducing initial database query size.
* **Bonus - Light/Dark Theme Switcher:** Integrated with CSS custom variables, matching the dark/light mode toggle from the TaskPlanet reference screenshot.
