# 🌍 Travel Bucket List — MERN App

An interactive **Travel Bucket List** web app built with the **MERN stack** (MongoDB, Express, React, Node.js).  
Users can **pin dream destinations on a map**, add notes, photos, and track visited places — all in one clean, responsive dashboard.  

> ✨ _Plan, Pin, and Share your travel goals with the world._

---

## 🚀 Features

✅ **User Authentication** – Secure signup/login with JWT.  
✅ **Interactive Map** – Add & view places on a live map (Leaflet / Mapbox).  
✅ **Add Places** – Title, description, tags, photos, and priority.  
✅ **Geo-Coordinates & Addresses** – Uses MongoDB GeoJSON (2dsphere index).  
✅ **Cloud Image Uploads** – Store images on Cloudinary.  
✅ **Public / Private Lists** – Share your travel goals or keep them personal.  
✅ **Filters & Search** – Filter by tags, countries, or visited status.  
✅ **Responsive UI** – Optimized for desktop and mobile.  
✅ **Deployed Full-Stack** – Backend (Render/Railway) + Frontend (Vercel/Netlify).

---

## 🧱 Tech Stack

| Layer | Technologies |
|:------|:--------------|
| **Frontend** | React (Vite), React Router, TailwindCSS, Axios, React-Leaflet |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (GeoJSON indexing) |
| **Auth** | JWT (JSON Web Token) |
| **Storage** | Cloudinary (for image uploads) |
| **Hosting** | Vercel (frontend) & Render / Railway (backend) |

---
travel-bucketlist/
│
├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # MapView, PlaceForm, PlaceCard
│ │ ├── pages/ # Home, Profile, Auth, MapPage
│ │ ├── api/ # Axios setup
│ │ └── main.jsx
│ └── package.json
│
├── server/ # Express backend
│ ├── config/ # Database connection
│ ├── controllers/ # Logic for places/auth
│ ├── models/ # Mongoose schemas (User, Place)
│ ├── routes/ # API routes
│ ├── middleware/ # Auth middleware, upload handler
│ └── index.js
│
├── .env # Environment variables (not committed)
├── README.md
└── package.json


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/travel-bucketlist.git
cd travel-bucketlist

2️⃣ Install Dependencies
Backend
cd server
npm install

Frontend
cd ../client
npm install

3️⃣ Environment Variables

Create .env inside /server:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


Create .env.local inside /client:

VITE_API_URL=http://localhost:5000/api

🧑‍💻 Development Scripts
Command	Description
npm run dev (in /server)	Start backend with Nodemon
npm run dev (in /client)	Start frontend (Vite)
npm run seed (in /server)	Optional: seed demo data
npm run build (in /client)	Build React app for production
🌐 Deployment

Frontend → Vercel
 or Netlify

Backend → Render
 or Railway

Database → MongoDB Atlas

Images → Cloudinary

Make sure to set all environment variables on the hosting platforms.

🗺️ API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login user
GET	/api/places	Get all public places
POST	/api/places	Create a new place (auth required)
PUT	/api/places/:id	Update a place
DELETE	/api/places/:id	Delete a place
🧠 Learning Highlights

Implemented GeoJSON with MongoDB for map coordinates.

Learned React Leaflet integration with Express APIs.

Gained experience deploying full-stack apps with Render + Vercel.

Practiced Cloudinary image upload and secure token-based authentication.


## 📁 Folder Structure

