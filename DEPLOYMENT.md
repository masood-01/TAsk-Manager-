# Team Task Manager - Deployment Guide

## Quick Start with Docker Compose

```bash
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Backend API on port 5000
- Frontend on port 5173

## Deployment Strategies

### Option 1: Railway (Recommended)

#### Backend Setup
1. Create a new Railway project
2. Connect GitHub repo
3. Configure environment variables:
   - `MONGODB_URI=mongodb+srv://...`
   - `JWT_SECRET=your_secret_here`
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-frontend.railway.app`

4. Set Root Directory: `backend`

#### Frontend Setup
1. Create another Railway project
2. Connect same GitHub repo
3. Configure environment variables:
   - `VITE_API_URL=https://your-backend.railway.app`

4. Set Root Directory: `frontend`
5. Build command: `npm run build`
6. Start command: `npm run preview`

### Option 2: Heroku

```bash
# Backend
heroku create your-app-backend
git push heroku main:main

# Frontend
heroku create your-app-frontend
heroku config:set VITE_API_URL=https://your-app-backend.herokuapp.com
git push heroku main:main
```

### Option 3: Vercel (Frontend Only)

```bash
npm install -g vercel
cd frontend
vercel --env VITE_API_URL=https://your-backend.app
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager
JWT_SECRET=your_very_secure_secret_key_at_least_32_characters_long
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-api.com
```

## Pre-deployment Checklist

- [ ] Update CORS origin in backend
- [ ] Set strong JWT_SECRET
- [ ] Configure MongoDB Atlas IP whitelist
- [ ] Test all API endpoints
- [ ] Verify environment variables
- [ ] Build frontend production build
- [ ] Test error handling and edge cases
- [ ] Setup CI/CD pipeline (optional)

## Monitoring

### Application Health
- Backend health check: `GET /health`
- Frontend loads without errors
- Database connectivity verified

### Logging
- Monitor application logs in Railway dashboard
- Check MongoDB Atlas activity logs
- Review error reports

## Troubleshooting

**CORS Errors**
- Update FRONTEND_URL in backend .env
- Restart backend service

**MongoDB Connection Issues**
- Verify IP whitelist in MongoDB Atlas
- Check connection string format
- Test connection with MongoDB compass

**Build Failures**
- Check logs in Railway/Heroku dashboard
- Verify all dependencies in package.json
- Test locally with `npm install && npm run build`

## Scaling

For production with high traffic:
- Enable MongoDB Atlas autoscaling
- Configure Railway resource allocation
- Add caching layer (Redis optional)
- Consider load balancing

## Security Recommendations

1. Use strong JWT_SECRET (minimum 32 characters)
2. Enable MongoDB encryption at rest
3. Use HTTPS everywhere
4. Implement rate limiting
5. Add request validation
6. Regular security audits
7. Keep dependencies updated
