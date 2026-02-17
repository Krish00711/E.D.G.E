import Grade from '../models/Grade.js'
import Attendance from '../models/Attendance.js'
import AssignmentSubmission from '../models/AssignmentSubmission.js'
import ActivityLog from '../models/ActivityLog.js'
import SelfReport from '../models/SelfReport.js'
import Session from '../models/Session.js'
import RiskPrediction from '../models/RiskPrediction.js'

export async function calculatePredictionForStudent(studentId) {
  // Gather behavioral features
  const sessions = await Session.find({ studentId })
    .sort({ createdAt: -1 })
    .limit(10)
  const avgSessionDuration = sessions.length > 0
    ? sessions.reduce((sum, s) => sum + (s.durationMin || 0), 0) / sessions.length
    : 120

  const activities = await ActivityLog.find({ studentId })
    .sort({ createdAt: -1 })
    .limit(30)
  const activityFrequency = activities.length > 0
    ? activities.length / 4
    : 5

  const lastActivity = activities[0]
  const daysSinceLastActivity = lastActivity
    ? Math.floor((Date.now() - new Date(lastActivity.createdAt)) / (1000 * 60 * 60 * 24))
    : 7

  const selfReports = await SelfReport.find({ studentId })
    .sort({ createdAt: -1 })
    .limit(5)

  const avgSleepHours = selfReports.length > 0
    ? selfReports.reduce((sum, sr) => sum + (sr.sleepHours || 7), 0) / selfReports.length
    : 7

  const avgStressScore = selfReports.length > 0
    ? selfReports.reduce((sum, sr) => sum + (sr.stressScore || 5), 0) / selfReports.length
    : 5

  const avgLoadScore = selfReports.length > 0
    ? selfReports.reduce((sum, sr) => sum + (sr.loadScore || 5), 0) / selfReports.length
    : 5

  // Academic features
  const grades = await Grade.find({ studentId })
  let gpa = 3.0
  if (grades.length > 0) {
    const totalWeightedScore = grades.reduce((sum, g) => {
      const percentage = (g.score / g.maxScore) * 100
      return sum + (percentage * (g.weight || 1))
    }, 0)
    const totalWeight = grades.reduce((sum, g) => sum + (g.weight || 1), 0)
    gpa = totalWeight > 0 ? (totalWeightedScore / totalWeight) / 25 : 3.0
  }

  const attendanceRecords = await Attendance.find({ studentId })
  let attendanceRate = 80
  if (attendanceRecords.length > 0) {
    const attended = attendanceRecords.filter(r =>
      r.status === 'present' || r.status === 'late'
    ).length
    attendanceRate = (attended / attendanceRecords.length) * 100
  }

  const submissions = await AssignmentSubmission.find({ studentId })
  let assignmentCompletionRate = 85
  let avgSubmissionLateness = 0
  if (submissions.length > 0) {
    assignmentCompletionRate = (submissions.filter(s => s.status !== 'missing').length / submissions.length) * 100
    const lateSubmissions = submissions.filter(s => s.isLate && s.daysLate > 0)
    avgSubmissionLateness = lateSubmissions.length > 0
      ? lateSubmissions.reduce((sum, s) => sum + s.daysLate, 0) / lateSubmissions.length
      : 0
  }

  let gradeTrend = 0
  if (grades.length >= 3) {
    const recentGrades = grades.slice(-5).map(g => (g.score / g.maxScore) * 100)
    if (recentGrades.length >= 3) {
      const firstHalf = recentGrades.slice(0, Math.ceil(recentGrades.length / 2))
      const secondHalf = recentGrades.slice(Math.ceil(recentGrades.length / 2))
      const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
      const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
      gradeTrend = avgSecond - avgFirst
    }
  }

  const quizGrades = grades.filter(g => g.gradeType === 'quiz')
  const avgQuizScore = quizGrades.length > 0
    ? quizGrades.reduce((sum, g) => sum + ((g.score / g.maxScore) * 100), 0) / quizGrades.length
    : 75

  const features = {
    session_duration: avgSessionDuration,
    quiz_scores: avgQuizScore,
    load_score: avgLoadScore,
    activity_frequency: activityFrequency,
    sleep_hours: avgSleepHours,
    stress_score: avgStressScore,
    submission_lateness: avgSubmissionLateness,
    gpa: gpa,
    attendance_rate: attendanceRate,
    assignment_completion_rate: assignmentCompletionRate,
    grade_trend: gradeTrend,
    days_since_last_activity: daysSinceLastActivity
  }

  const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5001'
  const mlResponse = await fetch(`${mlServiceUrl}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(features)
  })

  if (!mlResponse.ok) {
    throw new Error('ML service prediction failed')
  }

  const mlResult = await mlResponse.json()

  const prediction = await RiskPrediction.create({
    studentId,
    riskScore: mlResult.risk_score,
    riskLevel: mlResult.risk_level,
    confidence: mlResult.confidence,
    exhaustionScore: mlResult.dimension_scores?.exhaustion,
    cynicismScore: mlResult.dimension_scores?.cynicism,
    efficacyScore: mlResult.dimension_scores?.efficacy,
    featuresSnapshot: features,
    modelVersion: mlResult.model_version || '2.0'
  })

  return { prediction, features, mlResult }
}
