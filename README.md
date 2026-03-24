# Job Application Portal

A full-stack web application designed to help users track job listings and manage job applications. The platform connects job seekers with employers, providing a seamless interface for browsing, applying, and managing job postings.

## 🚀 Live Links

* **Frontend (Render Static Site):** [https://your-frontend-app-name.onrender.com](https://your-frontend-app-name.onrender.com)
* **Backend (Render Web Service):** [https://your-backend-app-name.onrender.com](https://your-backend-app-name.onrender.com)

## 🛠️ Tech Stack

**Frontend:**
* React.js (Bootstrapped with Vite)
* CSS for styling
* Redux Toolkit (State Management)

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose (Database)
* JSON Web Tokens (JWT) for Authentication

---

## 💻 Local Setup & Installation

### Prerequisites
Before you begin, ensure you have the following installed on your local machine:
* [Node.js](https://nodejs.org/) (v16 or higher recommended)
* [MongoDB](https://www.mongodb.com/try/download/community) (running locally, or an Atlas URI)
* Git

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/job-app.git](https://github.com/your-username/job-app.git)
cd job-app
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory and add the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

Start the backend development server:
```bash
npm run dev
# or: node server.js
```
*The backend server should now be running on `http://localhost:5000`.*

### 3. Frontend Setup
Open a new terminal window/tab, ensure you are in the root directory of the project, and install frontend dependencies:
```bash
# From the root directory (job-app)
npm install
```

Create a `.env` file in the root directory for Vite environment variables:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```
*The frontend should now be running on `http://localhost:5173` (or the port Vite assigns).*

---

## 📁 Project Structure

```text
job-app/
├── backend/                  # Node.js/Express backend server
│   ├── config/               # Database configuration
│   ├── controllers/          # Route logic
│   ├── middleware/           # Custom middleware (Auth, Roles, Errors)
│   ├── models/               # Mongoose schemas (User, Job, Application)
│   ├── routes/               # API route definitions
│   └── server.js             # Entry point for backend
├── src/                      # React frontend application
│   ├── app/                  # Redux store setup
│   ├── components/           # Reusable UI components
│   ├── features/             # Redux slices and page views (auth, jobs, etc.)
│   ├── routes/               # Frontend routing configuration
│   ├── services/             # API call handlers
│   └── main.jsx              # Entry point for frontend
├── index.html                # Vite HTML template
├── package.json              # Frontend dependencies and scripts
└── vite.config.js            # Vite bundler configuration
```

## 🚀 Deployment Instructions (Render)

### Backend (Render Web Service)
1. Create a new **Web Service** on Render connected to your repository.
2. Set the **Root Directory** to `backend`.
3. Set the **Build Command** to `npm install`.
4. Set the **Start Command** to `node server.js`.
5. Add all your Environment Variables (from your backend `.env` file) in the Render dashboard.

### Frontend (Render Static Site)
1. Create a new **Static Site** on Render connected to your repository.
2. Leave the **Root Directory** blank (or set to your repo root).
3. Set the **Build Command** to `npm install && npm run build`.
4. Set the **Publish Directory** to `dist`.
5. Add the Environment Variable `VITE_API_URL` pointing to your deployed backend Render URL.
6. **Important for React Router:** In Render's redirect/rewrite rules for the static site, add a rule to catch all routes and send them to `index.html` (Source: `/*`, Destination: `/index.html`, Action: `Rewrite`).

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/job-app/issues).

## 📝 License
This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
```
