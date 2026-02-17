# 🧪 E.D.G.E Testing Guide

## Quick Start Testing

### ✅ **Step 1: Verify All Services Running**

```powershell
# Check Backend (Port 5000)
Get-NetTCPConnection -LocalPort 5000

# Check ML Service (Port 5001)
Get-NetTCPConnection -LocalPort 5001

# Check Frontend (Port 3001)
Get-NetTCPConnection -LocalPort 3001
```

All three should show **State: Listen**

---

### ✅ **Step 2: Test ML Service Health**

```powershell
Invoke-RestMethod -Uri "http://localhost:5001/health" -Method GET
```

**Expected Response:**
```json
{
  "status": "ok",
  "service": "edge-ml"
}
```

---

### ✅ **Step 3: Test Backend Health**

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/health" -Method GET
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "EDGE API is running"
}
```

---

### ✅ **Step 4: Login to Test Account**

1. Open browser: `http://localhost:3001`
2. Click **Login**
3. Enter credentials:
   - **Email**: `john@student.com`
   - **Password**: `John123456`
4. Click **Login**

✅ Should redirect to Dashboard

---

### ✅ **Step 5: Test Navigation**

Navigate through the dropdown menus:

#### **Analytics Dropdown:**
1. **ML Models** - Should load ML Dashboard with 5 tabs
   - Overview (8 ML features)
   - Performance (model metrics)
   - Features (importance rankings)
   - Simulator (what-if scenarios)
   - Heatmap (placeholder)

2. **Advanced Analytics** - Should load comprehensive analytics page with:
   - 4 key metric cards
   - Risk distribution doughnut chart
   - Trends line chart
   - Risk factors bar chart
   - Intervention effectiveness cards
   - Department comparison bars

3. **Insights** - Should load student insights (may need data)

#### **Dashboard:**
Should show:
- Student name and email
- Risk Alerts Panel (with sample alerts)
- Progress Tracker (with charts)
- Intervention Recommendations (with AI suggestions)

---

### ✅ **Step 6: Test ML Endpoints**

**Test Model Performance:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5001/models/performance" -Method GET
```

**Expected Response:**
```json
{
  "ensemble_models": {
    "random_forest": {},
    "gradient_boosting": {},
    "neural_network": {}
  },
  "prediction_count": 0,
  "model_version": "2.0_enhanced_academic"
}
```

**Test Feature Importance:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5001/models/feature-importance" -Method GET
```

---

### ✅ **Step 7: Test Predictions (Requires Auth)**

First, get your JWT token from browser:
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Copy value of `edge_token`

Then test prediction:
```powershell
$token = "your_jwt_token_here"
$headers = @{ "Authorization" = "Bearer $token" }
$body = @{ "studentId" = "507f1f77bcf86cd799439011" } | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/ml/predict/ensemble" -Method POST -Headers $headers -Body $body -ContentType "application/json"
```

---

## 🔍 Common Issues & Solutions

### Issue: ML Dashboard shows "Loading ML Dashboard..."
**Cause**: Frontend can't reach ML service  
**Solution**:
```powershell
# Restart ML service
cd d:\E.D.G.E\ml_service
python app.py
```

### Issue: "Network Error" on login
**Cause**: Backend not running  
**Solution**:
```powershell
cd d:\E.D.G.E\server
npm run dev
```

### Issue: Charts not rendering
**Cause**: Missing chart dependencies  
**Solution**:
```bash
npm install chart.js react-chartjs-2
```

### Issue: JWT expired errors
**Cause**: Token expired (24hr default)  
**Solution**: Logout and login again

---

## 📊 Feature Testing Checklist

### Dashboard Features:
- [ ] Risk Alerts Panel displays correctly
- [ ] Filter buttons work (All, High, Medium, Low)
- [ ] Progress Tracker shows charts
- [ ] Intervention Recommendations display
- [ ] "Take Action" buttons are clickable

### ML Dashboard:
- [ ] All 5 tabs are accessible
- [ ] Overview shows 8 feature cards
- [ ] Performance tab shows model metrics
- [ ] Features tab shows importance rankings
- [ ] Simulator tab has input fields

### Analytics:
- [ ] Time range selector works (Week, Month, Semester, Year)
- [ ] All charts render properly
- [ ] Key metric cards show correct data
- [ ] Department comparison bars are visible

### Navigation:
- [ ] All dropdown menus expand on hover
- [ ] Desktop navigation shows all items
- [ ] Mobile hamburger menu works
- [ ] Logout button works
- [ ] Protected routes redirect to login when not authenticated

---

## 🎯 Acceptance Criteria

### ✅ System is Working If:
1. All 3 services running without errors
2. Can login successfully
3. Dashboard loads with all components visible
4. ML Dashboard displays model performance data
5. Advanced Analytics shows charts
6. Navigation dropdowns work smoothly
7. No console errors in browser DevTools
8. API calls return 200 OK (check Network tab)

### ❌ System Needs Attention If:
1. Services crash or fail to start
2. Login returns 401/403 errors
3. Pages show "Loading..." indefinitely
4. Charts fail to render
5. API calls return 404/500 errors
6. Console shows React errors
7. Dropdowns don't open
8. Navigation is congested or broken

---

## 🚀 Performance Testing

### Load Time Targets:
- **Dashboard**: < 2 seconds
- **ML Dashboard**: < 3 seconds
- **Analytics Page**: < 3 seconds
- **API Response**: < 500ms

### Browser Testing:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile responsive (DevTools → Device Mode)

---

## 📝 Test Account Credentials

| Email | Password | Role | Student ID |
|-------|----------|------|------------|
| `john@student.com` | `John123456` | Student | 507f1f77bcf86cd799439011 |
| `jane@student.com` | `Jane123456` | Student | 507f1f77bcf86cd799439012 |
| `mike@student.com` | `Mike123456` | Student | 507f1f77bcf86cd799439013 |

*(Created by running `node server/src/seed.js`)*

---

## 🔧 Debug Mode

Enable detailed logging:

**Backend:**
```javascript
// server/src/index.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})
```

**ML Service:**
```python
# ml_service/app.py
app.config['DEBUG'] = True
```

**Frontend:**
```javascript
// src/services/api.js
console.log('API Request:', endpoint, options)
```

---

**Happy Testing! 🎉**
