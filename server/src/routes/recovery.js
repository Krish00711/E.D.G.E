import { Router } from 'express'
import { z } from 'zod'
import mongoose from 'mongoose'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roles.js'
import RecoveryAction from '../models/RecoveryAction.js'
import SessionAction from '../models/SessionAction.js'
import Recommendation from '../models/Recommendation.js'
import Alert from '../models/Alert.js'
import RiskPrediction from '../models/RiskPrediction.js'
import CognitiveLoadRecord from '../models/CognitiveLoadRecord.js'

const router = Router()

// Validation schemas
const querySchema = z.object({
  page: z.string().optional().transform(val => val ? Math.max(1, parseInt(val)) : 1),
  limit: z.string().optional().transform(val => val ? Math.max(1, Math.min(100, parseInt(val))) : 50),
  status: z.enum(['recommended', 'taken', 'ignored']).optional(),
  source: z.enum(['session', 'recommendation']).optional()
})

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id)
}

function handleError(error, defaultMessage = 'Operation failed') {
  console.error('[Recovery Error]', error)
  return {
    error: defaultMessage,
    message: error.message,
    type: error.name,
    timestamp: new Date().toISOString()
  }
}

const createActionSchema = z.object({
  type: z.enum(['break', 'counseling', 'support', 'mindfulness', 'exercise', 'schedule', 'peer']),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  durationMin: z.number().min(1).max(480).optional(),
  tags: z.array(z.string()).max(10).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional()
})

router.get('/actions', requireAuth, async (req, res) => {
  try {
    const { type, priority, page, limit } = querySchema.parse(req.query)
    
    const filter = { isActive: true }
    if (req.query.type) filter.type = req.query.type
    if (req.query.priority) filter.priority = req.query.priority

    const skip = (page - 1) * limit

    const [actions, total] = await Promise.all([
      RecoveryAction.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      RecoveryAction.countDocuments(filter)
    ])

    return res.json({ 
      actions, 
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      metadata: {
        generatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('[Get Actions Error]', error)
    return res.status(error.name === 'ZodError' ? 400 : 500).json(handleError(error, 'Failed to fetch actions'))
  }
})

router.post('/actions', requireAuth, requireRole('admin', 'mentor'), async (req, res) => {
  try {
    const parsed = createActionSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ 
        error: 'Invalid payload', 
        details: parsed.error.flatten(),
        timestamp: new Date().toISOString()
      })
    }

    const action = await RecoveryAction.create({
      ...parsed.data,
      createdBy: req.user.id
    })

    return res.status(201).json({
      action,
      message: 'Recovery action created successfully',
      metadata: {
        createdAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('[Create Action Error]', error)
    return res.status(500).json(handleError(error, 'Failed to create action'))
  }
})

router.get('/session-actions', requireAuth, async (req, res) => {
  try {
    const { studentId, status, source, page, limit } = querySchema.parse(req.query)
    
    const filter = {}
    if (req.user.role === 'student') {
      filter.studentId = req.user.sub
    } else if (studentId) {
      if (!isValidObjectId(studentId)) {
        return res.status(400).json({ error: 'Invalid student ID format', id: studentId })
      }
      filter.studentId = studentId
    }

    if (status) filter.status = status
    if (source) filter.source = source

    const skip = (page - 1) * limit

    const [actions, total, statusCounts] = await Promise.all([
      SessionAction.find(filter)
        .populate('actionId')
        .populate('studentId', 'name email')
        .sort({ recommendedAt: -1 })
        .skip(skip)
        .limit(limit),
      SessionAction.countDocuments(filter),
      SessionAction.aggregate([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ])

    const counts = {
      recommended: 0,
      taken: 0,
      ignored: 0
    }
    statusCounts.forEach(item => {
      if (item._id) counts[item._id] = item.count
    })

    return res.json({ 
      actions, 
      statusCounts: counts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      metadata: {
        generatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('[Get Session Actions Error]', error)
    return res.status(error.name === 'ZodError' ? 400 : 500).json(handleError(error, 'Failed to fetch session actions'))
  }
})

router.patch('/session-actions/:id', requireAuth, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid action ID format', id: req.params.id })
    }

    const parsed = z.object({ 
      status: z.enum(['taken', 'ignored']),
      notes: z.string().max(500).optional()
    }).safeParse(req.body)
    
    if (!parsed.success) {
      return res.status(400).json({ 
        error: 'Invalid payload', 
        details: parsed.error.flatten()
      })
    }

    const action = await SessionAction.findById(req.params.id)
    if (!action) {
      return res.status(404).json({ error: 'Action not found', actionId: req.params.id })
    }

    if (req.user.role === 'student' && action.studentId.toString() !== req.user.sub) {
      return res.status(403).json({ error: 'Forbidden: Not your action' })
    }

    action.status = parsed.data.status
    if (parsed.data.notes) action.notes = parsed.data.notes
    if (parsed.data.status === 'taken') {
      action.takenAt = new Date()
    }
    await action.save()

    return res.json({
      action,
      message: `Action marked as ${parsed.data.status}`
    })
  } catch (error) {
    console.error('[Update Session Action Error]', error)
    return res.status(500).json(handleError(error, 'Failed to update action'))
  }
})

router.post('/recommend/:studentId', requireAuth, requireRole('admin', 'mentor'), async (req, res) => {
  const { studentId } = req.params

  const [latestPrediction, latestLoad, actions] = await Promise.all([
    RiskPrediction.findOne({ studentId }).sort({ timestamp: -1 }),
    CognitiveLoadRecord.findOne({ studentId }).sort({ recordedAt: -1 }),
    RecoveryAction.find({ isActive: true })
  ])

  if (!latestPrediction && !latestLoad) {
    return res.status(400).json({ error: 'No prediction or load data available' })
  }

  const recommended = []
  const highRisk = latestPrediction?.riskLevel === 'high' || (latestLoad?.overallLoad || 0) > 75

  const pickAction = (type) => actions.find((action) => action.type === type)

  if (highRisk) {
    const action = pickAction('break') || pickAction('mindfulness') || actions[0]
    if (action) recommended.push(action)
  }

  if ((latestPrediction?.cynicismScore || 0) > 0.6) {
    const action = pickAction('peer') || pickAction('support')
    if (action) recommended.push(action)
  }

  if ((latestPrediction?.efficacyScore || 0) > 0.6) {
    const action = pickAction('schedule') || pickAction('support')
    if (action) recommended.push(action)
  }

  const created = []
  for (const action of recommended) {
    const sessionAction = await SessionAction.create({
      studentId,
      actionId: action._id,
      status: 'recommended'
    })

    await Recommendation.create({
      studentId,
      predictionId: latestPrediction?._id,
      type: 'support',
      message: action.description
    })

    created.push(sessionAction)
  }

  if (highRisk) {
    await Alert.create({
      studentId,
      predictionId: latestPrediction?._id,
      severity: 'critical',
      message: 'High cognitive load detected. A recovery action was recommended.'
    })
  }

  return res.json({ actions: created, total: created.length })
})

export default router
