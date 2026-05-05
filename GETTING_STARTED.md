# Getting Started - Team Task Manager

## 🚀 Quick Start (5 minutes)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

**Update `.env` file:**
```
PORT=5000
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster.mongodb.net/task-manager
JWT_SECRET=your_super_secret_key_change_this
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Get MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Create a database user
4. Get connection string
5. Replace `<username>`, `<password>`, and database name

**Start backend:**
```bash
npm run dev
```
✅ Backend running at `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend running at `http://localhost:5173`

---

## 📝 First Steps in the App

### 1. Create Account
1. Click "Sign up" link
2. Enter name, email, password
3. Click "Sign Up" button
4. You're logged in! 🎉

### 2. Create a Project
1. Go to "Projects" page
2. Click "+ New Project"
3. Enter project name and description
4. Click "Create Project"

### 3. Add Team Members
1. Open a project
2. Go to "Members" tab
3. Click "+ Add Member"
4. Enter team member's User ID
5. Select role (Admin/Member)
6. Click "Add Member"

### 4. Create Tasks
1. In project, go to "Tasks" tab
2. Click "+ New Task"
3. Enter task title
4. Set priority and due date
5. Click "Create Task"

### 5. Track Progress
1. Go to "Dashboard"
2. View task statistics
3. See overdue tasks
4. Update task status by clicking the status dropdown

---

## 🔧 API Testing

### Using cURL

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Create Project (replace TOKEN):**
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name": "My Project",
    "description": "A great project"
  }'
```

---

## 🐳 Using Docker

### Start Everything with One Command

```bash
docker-compose up -d
```

Access:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- MongoDB: localhost:27017

Stop containers:
```bash
docker-compose down
```

---

## 🌐 Deploy on Railway

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/task-manager.git
git push -u origin main
```

### Step 2: Deploy Backend
1. Go to [Railway.app](https://railway.app)
2. New Project → GitHub Repo
3. Select your repository
4. Configure:
   - Root Directory: `backend`
   - Environment Variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A strong secret key
     - `NODE_ENV`: `production`

5. Click Deploy 🚀

### Step 3: Deploy Frontend
1. New Project → GitHub Repo
2. Select same repository
3. Configure:
   - Root Directory: `frontend`
   - Environment Variables:
     - `VITE_API_URL`: Your deployed backend URL

4. Click Deploy 🚀

### Step 4: Connect Frontend to Backend
- Copy your backend URL from Railway
- Update frontend `VITE_API_URL` environment variable
- Frontend will automatically rebuild

---

## 🧪 Testing Checklist

- [ ] Can sign up new user
- [ ] Can login with credentials
- [ ] Can create project
- [ ] Can add team member
- [ ] Can create task
- [ ] Can assign task
- [ ] Can change task status
- [ ] Can mark task as complete
- [ ] Dashboard shows correct stats
- [ ] Overdue tasks display correctly
- [ ] Can delete task
- [ ] Can delete project
- [ ] Can logout
- [ ] Redirects to login when not authenticated

---

## 🐛 Common Issues & Solutions

### "Cannot connect to MongoDB"
- ✅ Check MongoDB URI in `.env`
- ✅ Verify credentials are correct
- ✅ Check IP whitelist in MongoDB Atlas
- ✅ Ensure database exists

### "CORS error in frontend"
- ✅ Update `FRONTEND_URL` in backend `.env`
- ✅ Restart backend server
- ✅ Clear browser cache

### "Port already in use"
```bash
# Find process using port 5000
lsof -i :5000
# Kill it
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

### "npm install fails"
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Project Structure

```
Task/
├── backend/                 # Express API server
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── package.json
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── docker-compose.yml      # Docker configuration
├── README.md              # Full documentation
├── DEPLOYMENT.md          # Deployment guide
└── GETTING_STARTED.md     # This file
```

---

## 🚀 Next Steps

1. **Customize UI:** Modify styles in `/src/components/*.css`
2. **Add Features:** Extend API endpoints and React components
3. **Deploy:** Follow DEPLOYMENT.md guide
4. **Scale:** Add caching, load balancing, monitoring

---

## 💡 Key Features to Try

✅ **Authentication**
- Sign up with new account
- Login/Logout
- Protected routes

✅ **Projects**
- Create unlimited projects
- Invite team members
- Assign roles

✅ **Tasks**
- Create tasks within projects
- Assign to team members
- Track status (To Do, In Progress, Done)
- Set priority levels
- Mark as overdue

✅ **Dashboard**
- View all your tasks
- See statistics
- Monitor overdue items
- Quick task overview

---

## 📞 Support & Resources

- **MongoDB Docs:** https://docs.mongodb.com
- **Express Docs:** https://expressjs.com
- **React Docs:** https://react.dev
- **Railway Docs:** https://docs.railway.app

---

## 🎯 Success Criteria

Your app is working correctly when:
1. ✅ You can sign up and login
2. ✅ You can create a project
3. ✅ You can add team members
4. ✅ You can create and assign tasks
5. ✅ Dashboard shows task stats
6. ✅ You can change task status
7. ✅ Deployed on Railway works

---

**Happy building! 🚀**

Questions? Check the README.md or DEPLOYMENT.md for more details.
