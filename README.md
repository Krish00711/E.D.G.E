
# E.D.G.E (Early Detection & Guidance Engine)

E.D.G.E is a student wellbeing and academic performance platform that combines a React frontend, Node/Express backend, and a Python ML service to predict burnout risk and support timely interventions.

## What This Repo Contains
- Frontend (React + Vite) with role-based dashboards and feature pages.
- Backend (Node.js + Express) with 157+ REST endpoints and MongoDB models.
- ML service (Flask + scikit-learn) for burnout risk prediction.

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 5+
- Python 3.9+

### Install
```bash
npm install
cd server
npm install
cd ../ml_service
pip install -r requirements.txt
```

### Configure
Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/edge
JWT_SECRET=your-super-secret-key-change-this
ML_SERVICE_URL=http://localhost:5001
NODE_ENV=development
```

Create `.env` (frontend):
```env
VITE_API_URL=http://localhost:5000/api
VITE_ML_SERVICE_URL=http://localhost:5001
```

Create `ml_service/.env`:
```env
PORT=5001
```

### Run
```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Backend
cd server
npm run dev

# Terminal 3: ML Service
cd ml_service
python train.py
python app.py

# Terminal 4: Frontend
npm run dev
```

## Test Credentials
- Admin: admin@edge.com / Admin123456
- Mentor: prof.johnson@edge.com / Prof123456
- Student: john@student.com / John123456

## Documentation
All documentation has been consolidated into a single file:
- [SYSTEM_DOCUMENTATION.md](SYSTEM_DOCUMENTATION.md)

## Project Structure
```
src/
  components/
  pages/
  sections/
  styles/
server/
  src/
ml_service/
  models/
```
