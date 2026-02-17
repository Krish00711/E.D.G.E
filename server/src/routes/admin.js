import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roles.js'
import Student from '../models/Student.js'
import User from '../models/User.js'
import RiskPrediction from '../models/RiskPrediction.js'
import Alert from '../models/Alert.js'
import Intervention from '../models/Intervention.js'

const router = Router()

/**
 * ADMIN DASHBOARD ENDPOINTS
 */

// GET /api/admin/students?risk=high&cohort=...&page=1&limit=20
router.get('/students', requireAuth, requireRole('admin', 'mentor'), async (req, res) => {
  try {
    const { risk, cohort, page = 1, limit = 20, search } = req.query
    
    // Build filter
    const filter = {}
    if (cohort) filter.cohortId = cohort
    if (search) filter.$or = [
      { email: { $regex: search, $options: 'i' } },
      { name: { $regex: search, $options: 'i' } }
    ]
    
    // Get students
    let students = await Student.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean()
    
    // Enhance with risk data
    const enhancedStudents = await Promise.all(students.map(async (student) => {
      const pred = await RiskPrediction.findOne({ studentId: student._id }).sort({ createdAt: -1 }).lean()
      const alertCount = await Alert.countDocuments({ studentId: student._id, status: 'active' })
      return {
        ...student,
        currentRisk: pred?.riskScore,
        riskLevel: pred?.riskLevel,
        activeAlerts: alertCount
      }
    }))
    
    // Filter by risk level if specified
    let filtered = enhancedStudents
    if (risk) {
      filtered = enhancedStudents.filter(s => s.riskLevel === risk)
    }
    
    const total = await Student.countDocuments(filter)
    
    return res.json({
      students: filtered,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

// GET /api/admin/students/critical - High risk students requiring immediate attention
router.get('/students/critical', requireAuth, requireRole('admin', 'mentor'), async (req, res) => {
  try {
    const students = await Student.find().lean()
    
    const criticalStudents = await Promise.all(students.map(async (student) => {
      const pred = await RiskPrediction.findOne({ studentId: student._id }).sort({ createdAt: -1 }).lean()
      const alerts = await Alert.find({ studentId: student._id, status: 'active' }).lean()
      
      if (pred?.riskLevel === 'high' || alerts.length > 2) {
        return {
          _id: student._id,
          email: student.email,
          name: student.name,
          riskScore: pred?.riskScore,
          riskLevel: pred?.riskLevel,
          criticalAlerts: alerts.length,
          needsIntervention: pred?.riskScore > 0.7
        }
      }
      return null
    }))
    
    return res.json({
      critical: criticalStudents.filter(s => s !== null).sort((a, b) => b.riskScore - a.riskScore)
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

// GET /api/admin/students/:id - Detailed student view
router.get('/students/:id', requireAuth, requireRole('admin', 'mentor'), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('cohortId', 'name')
      .lean()
    
    if (!student) return res.status(404).json({ error: 'Student not found' })
    
    // Get all predictions
    const predictions = await RiskPrediction.find({ studentId: student._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean()
    
    // Get all active alerts
    const alerts = await Alert.find({ studentId: student._id })
      .sort({ createdAt: -1 })
      .lean()
    
    // Get all interventions
    const interventions = await Intervention.find({ studentId: student._id })
      .populate('mentorId', 'email name')
      .sort({ createdAt: -1 })
      .lean()
    
    return res.json({
      student,
      predictions: predictions.slice(0, 10),
      alerts,
      interventions
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

// GET /api/admin/alerts/critical - All critical alerts
router.get('/alerts/critical', requireAuth, requireRole('admin', 'mentor'), async (req, res) => {
  try {
    const alerts = await Alert.find({ status: 'active', severity: 'critical' })
      .populate('studentId', 'email name')
      .sort({ createdAt: -1 })
      .lean()
    
    return res.json({ alerts })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

// GET /api/admin/alerts - All active alerts with pagination
router.get('/alerts', requireAuth, requireRole('admin', 'mentor'), async (req, res) => {
  try {
    const { page = 1, limit = 20, severity } = req.query
    
    const filter = { status: 'active' }
    if (severity) filter.severity = severity
    
    const alerts = await Alert.find(filter)
      .populate('studentId', 'email name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean()
    
    const total = await Alert.countDocuments(filter)
    
    return res.json({
      alerts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

// GET /api/admin/cohorts - All cohorts with metrics
router.get('/cohorts', requireAuth, requireRole('admin', 'mentor'), async (req, res) => {
  try {
    const cohorts = await Student.collection.aggregate([
      { $group: { _id: '$cohortId', count: { $sum: 1 } } }
    ]).toArray()
    
    const enriched = await Promise.all(cohorts.map(async (cohort) => {
      const students = await Student.find({ cohortId: cohort._id }).select('_id').lean()
      const studentIds = students.map(s => s._id)
      
      const preds = await RiskPrediction.find({ studentId: { $in: studentIds } })
        .sort({ createdAt: -1 })
        .lean()
      
      const latest = {}
      preds.forEach(p => {
        if (!latest[p.studentId]) latest[p.studentId] = p
      })
      
      const risks = Object.values(latest).map(p => p.riskScore)
      
      return {
        cohortId: cohort._id,
        studentCount: cohort.count,
        avgRisk: risks.length > 0 ? risks.reduce((a, b) => a + b) / risks.length : 0,
        highRiskCount: Object.values(latest).filter(p => p.riskLevel === 'high').length
      }
    }))
    
    return res.json({ cohorts: enriched })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

// GET /api/admin/dashboard/overview - Admin dashboard overview
router.get('/dashboard/overview', requireAuth, requireRole('admin', 'mentor'), async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments()
    const totalAlerts = await Alert.countDocuments({ status: 'active' })
    const criticalAlerts = await Alert.countDocuments({ status: 'active', severity: 'critical' })
    const activeInterventions = await Intervention.countDocuments({ status: 'in-progress' })
    
    // Get all students and their risks
    const students = await Student.find().select('_id').lean()
    const studentIds = students.map(s => s._id)
    
    const predictions = await RiskPrediction.find({ studentId: { $in: studentIds } })
      .sort({ createdAt: -1 })
      .lean()
    
    const latest = {}
    predictions.forEach(p => {
      if (!latest[p.studentId]) latest[p.studentId] = p
    })
    
    const riskLevels = Object.values(latest).map(p => p.riskLevel)
    
    return res.json({
      summary: {
        totalStudents,
        totalAlerts,
        criticalAlerts,
        activeInterventions
      },
      riskDistribution: {
        low: riskLevels.filter(r => r === 'low').length,
        moderate: riskLevels.filter(r => r === 'moderate').length,
        high: riskLevels.filter(r => r === 'high').length
      },
      avgRisk: Object.values(latest).length > 0
        ? Object.values(latest).reduce((sum, p) => sum + p.riskScore, 0) / Object.values(latest).length
        : 0
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

export default router
