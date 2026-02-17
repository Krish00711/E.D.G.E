import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roles.js'
import RiskPrediction from '../models/RiskPrediction.js'
import { calculatePredictionForStudent } from '../services/predictionService.js'

const router = Router()

const createPredictionSchema = z.object({
  studentId: z.string(),
  sessionId: z.string().optional(),
  riskScore: z.number().min(0).max(1),
  riskLevel: z.enum(['low', 'moderate', 'high']),
  exhaustionScore: z.number().min(0).max(1).optional(),
  cynicismScore: z.number().min(0).max(1).optional(),
  efficacyScore: z.number().min(0).max(1).optional(),
  featuresSnapshot: z.record(z.any()).optional(),
  modelVersion: z.string().optional()
})

// POST /api/predictions - create risk prediction (admin/system)
router.post('/', requireAuth, requireRole('admin', 'mentor'), async (req, res) => {
  const parsed = createPredictionSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  const prediction = await RiskPrediction.create(parsed.data)
  return res.status(201).json(prediction)
})

// GET /api/predictions/:id
router.get('/:id', requireAuth, async (req, res) => {
  const prediction = await RiskPrediction.findById(req.params.id)
  if (!prediction) {
    return res.status(404).json({ error: 'Prediction not found' })
  }

  if (req.user.role === 'student' && prediction.studentId.toString() !== req.user.sub) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  return res.json(prediction)
})

// GET /api/predictions - list predictions
router.get('/', requireAuth, async (req, res) => {
  let filter = {}
  if (req.user.role === 'student') {
    filter.studentId = req.user.sub
  } else if (req.query.studentId) {
    filter.studentId = req.query.studentId
  }

  const predictions = await RiskPrediction.find(filter)
    .sort({ timestamp: -1 })
    .limit(50)
  return res.json(predictions)
})

// GET /api/predictions/latest/:studentId - get latest prediction for a student
router.get('/latest/:studentId', requireAuth, async (req, res) => {
  const prediction = await RiskPrediction.findOne({ studentId: req.params.studentId })
    .sort({ timestamp: -1 })
  
  if (!prediction) {
    return res.status(404).json({ error: 'No prediction found' })
  }

  if (req.user.role === 'student' && req.params.studentId !== req.user.sub) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  return res.json(prediction)
})

// POST /api/predictions/calculate/:studentId - Calculate prediction with enhanced academic features
router.post('/calculate/:studentId', requireAuth, async (req, res) => {
  try {
    const studentId = req.params.studentId

    if (req.user.role === 'student' && studentId !== req.user.sub) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const { prediction, features, mlResult } = await calculatePredictionForStudent(studentId)

    return res.status(201).json({
      prediction,
      features,
      mlResult
    })
  } catch (error) {
    console.error('[Predictions] Error calculating prediction:', error)
    return res.status(500).json({ error: error.message })
  }
})

export default router
