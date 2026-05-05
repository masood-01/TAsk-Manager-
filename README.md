# Team Task Manager - Full Stack Application

A comprehensive team task management application built with Node.js, Express, React, and MongoDB. Features role-based access control, project management, and real-time task tracking.

## 🚀 Features

✅ **Authentication**
- User signup and login with JWT tokens
- Secure password hashing with bcryptjs
- Protected routes and endpoints

✅ **Project Management**
- Create and manage projects
- Add team members with different roles (Admin/Member)
- Archive/activate projects
- Project descriptions and due dates

✅ **Task Management**
- Create, update, and delete tasks
- Assign tasks to team members
- Track task status (To Do, In Progress, Completed)
- Set task priority levels (Low, Medium, High)
- Track overdue tasks

✅ **Dashboard**
- View task statistics (total, completed, in progress, overdue)
- Monitor overdue tasks
- Quick access to recent tasks
- Real-time status updates

✅ **Role-Based Access Control**
- Admin: Full project and task management
- Member: Limited task operations
- Project-level role management

## 📋 Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** Custom middleware

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Styling:** CSS3

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

5. Start the server:
   ```bash
   npm run dev    # Development with nodemon
   npm start      # Production
   ```

The backend will be running at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` (optional - defaults are already set):
   ```env
   VITE_API_URL=http://localhost:5000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be running at `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/signup      - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user (protected)
```

### Project Endpoints

```
GET    /api/projects         - Get all user's projects (protected)
POST   /api/projects         - Create new project (protected)
GET    /api/projects/:id     - Get project details (protected)
PATCH  /api/projects/:id     - Update project (protected)
DELETE /api/projects/:id     - Delete project (protected)
POST   /api/projects/:id/members     - Add member (protected)
DELETE /api/projects/:id/members     - Remove member (protected)
```

### Task Endpoints

```
POST   /api/tasks/:projectId              - Create task (protected)
GET    /api/tasks/project/:projectId      - Get project tasks (protected)
GET    /api/tasks/:taskId                 - Get task details (protected)
PATCH  /api/tasks/:taskId                 - Update task (protected)
DELETE /api/tasks/:taskId                 - Delete task (protected)
PATCH  /api/tasks/:taskId/assign          - Assign task (protected)
GET    /api/tasks/dashboard/stats         - Get dashboard stats (protected)
```

## 🗄️ Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'member',
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Project
```javascript
{
  name: String,
  description: String,
  owner: ObjectId (User),
  members: [{
    user: ObjectId (User),
    role: 'admin' | 'member'
  }],
  status: 'active' | 'archived',
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Task
```javascript
{
  title: String,
  description: String,
  project: ObjectId (Project),
  assignee: ObjectId (User),
  creator: ObjectId (User),
  status: 'todo' | 'in-progress' | 'completed',
  priority: 'low' | 'medium' | 'high',
  dueDate: Date,
  isOverdue: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚢 Deployment on Railway

### Prerequisites
- Railway account (sign up at https://railway.app)
- GitHub repository with your code

### Step-by-step Deployment

#### 1. **Backend Deployment**

1. Create a new Railway project
2. Connect your GitHub repository
3. Set environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong secret key
   - `NODE_ENV`: Set to `production`
   - `FRONTEND_URL`: Your deployed frontend URL

4. Configure the start command in `railway.toml`:
   ```toml
   [build]
   builder = "nixpacks"

   [deploy]
   startCommand = "cd backend && npm start"
   ```

5. Railway will automatically detect and deploy from the backend directory

#### 2. **Frontend Deployment**

1. Create another Railway project for frontend
2. Connect the same GitHub repository
3. Set environment variables:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://your-backend.railway.app`)

4. Configure the start command in `railway.toml`:
   ```toml
   [build]
   builder = "nixpacks"

   [build.buildInputs]
   node = "18"

   [deploy]
   startCommand = "cd frontend && npm run build && npm install -g serve && serve -s dist -l 3000"
   ```

5. Railway will automatically deploy and provide a public URL

### Alternative: Docker Deployment

Create `Dockerfile` for backend:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/ .

EXPOSE 5000

CMD ["node", "index.js"]
```

Create `Dockerfile` for frontend:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ Role-based access control
- ✅ Project membership verification
- ✅ CORS enabled and configurable
- ✅ Environment variables for sensitive data
- ✅ Input validation on all endpoints

## 🧪 Testing

### Manual API Testing
Use Postman or curl to test endpoints:

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"123456","confirmPassword":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'

# Create Project (with token)
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"My Project","description":"A great project"}'
```

## 📁 Project Structure

```
Task/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── .env.example
│   ├── .gitignore
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProjectForm.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── MemberList.jsx
│   │   │   └── *.css
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectDetail.jsx
│   │   │   └── *.css
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── .env.example
│   ├── .gitignore
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
- Verify your MongoDB URI in `.env`
- Check if MongoDB Atlas IP whitelist includes your IP
- Ensure database name exists in the URI

**JWT Token Invalid**
- Regenerate JWT_SECRET in `.env`
- Clear browser localStorage and re-login
- Check token expiration (set to 7 days)

### Frontend Issues

**API Calls Returning 404**
- Verify backend is running on correct port
- Check `VITE_API_URL` environment variable
- Ensure CORS is enabled in backend

**Blank Page**
- Check browser console for errors
- Verify React components are loading
- Check network tab for failed requests

## 🤝 Contributing

1. Create feature branches
2. Make your changes
3. Test thoroughly
4. Create pull requests

## 📄 License

MIT License - feel free to use this project as a template

## 👨‍💻 Author

Built with ❤️ for team collaboration

## 📞 Support

For issues and questions, please refer to the troubleshooting section or check the codebase comments.

---

**Happy Task Managing! 🎯**
