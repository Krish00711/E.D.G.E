import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'

import User from './models/User.js'
import Student from './models/Student.js'
import Instructor from './models/Instructor.js'
import Course from './models/Course.js'
import Enrollment from './models/Enrollment.js'
import Grade from './models/Grade.js'
import Attendance from './models/Attendance.js'
import Assignment from './models/Assignment.js'
import AssignmentSubmission from './models/AssignmentSubmission.js'
import Notification from './models/Notification.js'
import DiscussionForum from './models/DiscussionForum.js'
import Resource from './models/Resource.js'
import ResourceUsage from './models/ResourceUsage.js'
import RiskPrediction from './models/RiskPrediction.js'
import Recommendation from './models/Recommendation.js'
import Alert from './models/Alert.js'
import Communication from './models/Communication.js'
import Session from './models/Session.js'
import ActivityLog from './models/ActivityLog.js'
import SelfReport from './models/SelfReport.js'
import SensorData from './models/SensorData.js'
import CognitiveLoadRecord from './models/CognitiveLoadRecord.js'
import RecoveryAction from './models/RecoveryAction.js'
import SessionAction from './models/SessionAction.js'
import ConsentRecord from './models/ConsentRecord.js'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/edge'

const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)]
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB')

    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      Instructor.deleteMany({}),
      Course.deleteMany({}),
      Enrollment.deleteMany({}),
      Grade.deleteMany({}),
      Attendance.deleteMany({}),
      Assignment.deleteMany({}),
      AssignmentSubmission.deleteMany({}),
      Notification.deleteMany({}),
      DiscussionForum.deleteMany({}),
      Resource.deleteMany({}),
      ResourceUsage.deleteMany({}),
      RiskPrediction.deleteMany({}),
      Recommendation.deleteMany({}),
      Alert.deleteMany({}),
      Communication.deleteMany({}),
      Session.deleteMany({}),
      ActivityLog.deleteMany({}),
      SelfReport.deleteMany({}),
      SensorData.deleteMany({}),
      CognitiveLoadRecord.deleteMany({}),
      RecoveryAction.deleteMany({}),
      SessionAction.deleteMany({}),
      ConsentRecord.deleteMany({})
    ])
    console.log('Cleared existing data')

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@edge.com',
      passwordHash: await bcrypt.hash('Admin123456', 10),
      role: 'admin'
    })

    const mentorUser = await User.create({
      name: 'Prof. Johnson',
      email: 'prof.johnson@edge.com',
      passwordHash: await bcrypt.hash('Prof123456', 10),
      role: 'mentor'
    })

    const instructor = await Instructor.create({
      userId: mentorUser._id,
      department: 'Computer Science'
    })

    const courses = await Course.insertMany([
      {
        code: 'CS301',
        title: 'Data Structures and Algorithms',
        description: 'Core data structures, complexity analysis, and algorithms.',
        credits: 3,
        department: 'Computer Science',
        difficultyLevel: 'intermediate',
        instructorId: instructor._id,
        maxEnrollment: 50,
        semester: 'Spring',
        year: 2024,
        schedule: { days: ['Monday', 'Wednesday', 'Friday'], startTime: '10:00', endTime: '11:00', location: 'Room 204' }
      },
      {
        code: 'MATH201',
        title: 'Calculus II',
        description: 'Integration techniques, sequences, and series.',
        credits: 4,
        department: 'Mathematics',
        difficultyLevel: 'intermediate',
        instructorId: instructor._id,
        maxEnrollment: 40,
        semester: 'Spring',
        year: 2024,
        schedule: { days: ['Tuesday', 'Thursday'], startTime: '14:00', endTime: '15:30', location: 'Room 110' }
      },
      {
        code: 'PHY101',
        title: 'Physics I',
        description: 'Classical mechanics with lab.',
        credits: 4,
        department: 'Physics',
        difficultyLevel: 'beginner',
        instructorId: instructor._id,
        maxEnrollment: 60,
        semester: 'Spring',
        year: 2024,
        schedule: { days: ['Monday', 'Wednesday'], startTime: '09:00', endTime: '10:30', location: 'Lab A' }
      },
      {
        code: 'CS401',
        title: 'Machine Learning',
        description: 'Supervised and unsupervised learning techniques.',
        credits: 3,
        department: 'Computer Science',
        difficultyLevel: 'advanced',
        instructorId: instructor._id,
        maxEnrollment: 35,
        semester: 'Spring',
        year: 2024,
        schedule: { days: ['Tuesday', 'Thursday'], startTime: '16:00', endTime: '17:30', location: 'Room 310' }
      }
    ])

    const studentSeed = [
      { name: 'John Smith', email: 'john@student.com', password: 'John123456', major: 'Computer Science', program: 'undergraduate', year: 3, cohort: 'cohort-2024' },
      { name: 'Sarah Johnson', email: 'sarah@student.com', password: 'Sarah123456', major: 'Mathematics', program: 'undergraduate', year: 4, cohort: 'cohort-2024' },
      { name: 'Mike Davis', email: 'mike@student.com', password: 'Mike123456', major: 'Physics', program: 'undergraduate', year: 2, cohort: 'cohort-2024' },
      { name: 'Alice Chen', email: 'alice@student.com', password: 'Alice123456', major: 'Computer Science', program: 'graduate', year: 1, cohort: 'cohort-2024' },
      { name: 'Robert Wilson', email: 'robert@student.com', password: 'Robert123456', major: 'Engineering', program: 'graduate', year: 2, cohort: 'cohort-2024' },
      { name: 'Emma Brown', email: 'emma@student.com', password: 'Emma123456', major: 'Computer Science', program: 'undergraduate', year: 1, cohort: 'cohort-2024' }
    ]

    const students = []
    for (const data of studentSeed) {
      const user = await User.create({
        name: data.name,
        email: data.email,
        passwordHash: await bcrypt.hash(data.password, 10),
        role: 'student'
      })

      const student = await Student.create({
        _id: user._id,
        userId: user._id,
        name: data.name,
        email: data.email,
        major: data.major,
        program: data.program,
        year: data.year,
        cohortId: data.cohort
      })

      students.push({ user, student })
    }

    const enrollments = []
    for (const { student } of students) {
      const courseCount = randomInt(2, 3)
      const enrolledCourses = courses.slice(0, courseCount)
      for (const course of enrolledCourses) {
        const enrollment = await Enrollment.create({
          studentId: student._id,
          courseId: course._id,
          enrollmentDate: new Date(2024, 0, 15)
        })
        enrollments.push(enrollment)
      }
    }

    const assignments = []
    for (const course of courses) {
      for (let i = 0; i < 4; i++) {
        const assignment = await Assignment.create({
          courseId: course._id,
          title: `Assignment ${i + 1}`,
          description: `Complete assignment ${i + 1} for ${course.code}.`,
          dueDate: new Date(2024, 1, 5 + i * 7),
          maxScore: 100
        })
        assignments.push(assignment)
      }
    }

    const gradeTypes = ['assignment', 'quiz', 'exam', 'project']
    for (const enrollment of enrollments) {
      for (let i = 0; i < 3; i++) {
        await Grade.create({
          studentId: enrollment.studentId,
          courseId: enrollment.courseId,
          score: randomInt(65, 98),
          maxScore: 100,
          weight: i === 2 ? 2 : 1,
          gradeType: randomChoice(gradeTypes),
          feedback: randomChoice(['Great work', 'Good improvement', 'Needs focus on fundamentals'])
        })
      }
    }

    for (const enrollment of enrollments) {
      for (let i = 0; i < 12; i++) {
        const date = new Date(2024, 0, 8 + i * 3)
        const statusRoll = Math.random()
        const status = statusRoll > 0.85 ? 'absent' : statusRoll > 0.7 ? 'late' : 'present'
        await Attendance.create({
          studentId: enrollment.studentId,
          courseId: enrollment.courseId,
          date,
          status,
          notes: status === 'late' ? 'Traffic delay' : status === 'absent' ? 'Medical appointment' : ''
        })
      }
    }

    let submissionCount = 0
    for (const { student } of students) {
      const studentAssignments = assignments.filter(a =>
        enrollments.some(e => e.studentId.equals(student._id) && e.courseId.equals(a.courseId))
      )

      for (const assignment of studentAssignments) {
        if (Math.random() > 0.2) {
          await AssignmentSubmission.create({
            assignmentId: assignment._id,
            studentId: student._id,
            submittedAt: new Date(Date.now() - randomInt(1, 8) * 86400000),
            status: 'graded',
            content: 'Submitted solution and notes.',
            timeSpent: randomInt(60, 240),
            score: randomInt(65, 100),
            maxScore: assignment.maxScore
          })
          submissionCount++
        }
      }
    }

    for (const { user } of students) {
      await Notification.insertMany([
        {
          userId: user._id,
          title: 'Grade Posted',
          message: 'Your latest grade has been posted.',
          type: 'grade',
          priority: 'medium',
          isRead: false
        },
        {
          userId: user._id,
          title: 'Assignment Due Soon',
          message: 'Assignment due in 48 hours.',
          type: 'assignment',
          priority: 'high',
          isRead: false
        },
        {
          userId: user._id,
          title: 'Attendance Update',
          message: 'Your attendance rate has been updated.',
          type: 'attendance',
          priority: 'low',
          isRead: true
        }
      ])
    }

    const resources = await Resource.insertMany([
      {
        title: 'Linear Algebra Guide',
        description: 'Comprehensive guide to linear algebra concepts.',
        type: 'document',
        category: 'academic',
        url: 'https://example.com/linear-algebra-guide.pdf',
        uploadedBy: mentorUser._id,
        usefulCount: randomInt(40, 120)
      },
      {
        title: 'Python Advanced Techniques',
        description: 'Video series on advanced Python programming.',
        type: 'video',
        category: 'academic',
        url: 'https://example.com/python-advanced',
        uploadedBy: mentorUser._id,
        usefulCount: randomInt(50, 140)
      },
      {
        title: 'Study Planning Tutorial',
        description: 'Tutorial on effective study planning.',
        type: 'tutorial',
        category: 'academic',
        url: 'https://example.com/study-planning',
        uploadedBy: mentorUser._id,
        usefulCount: randomInt(30, 90)
      }
    ])

    for (const { student } of students) {
      await ResourceUsage.create({
        studentId: student._id,
        resourceId: randomChoice(resources)._id,
        durationMinutes: randomInt(10, 90),
        wasHelpful: true
      })
    }

    for (const course of courses) {
      const forum = await DiscussionForum.create({
        courseId: course._id,
        title: `${course.code} Discussion`,
        description: `Discussion forum for ${course.title}`,
        createdBy: mentorUser._id,
        posts: []
      })

      for (let i = 0; i < 4; i++) {
        const author = randomChoice(students)
        forum.posts.push({
          userId: author.user._id,
          content: `Question about ${course.code} topic ${i + 1}.`,
          createdAt: new Date(Date.now() - randomInt(1, 10) * 86400000),
          likes: [],
          replies: []
        })
      }

      await forum.save()
    }

    for (const { student } of students) {
      const riskScore = Math.random()
      const riskLevel = riskScore > 0.7 ? 'high' : riskScore > 0.4 ? 'moderate' : 'low'
      const exhaustionScore = Math.min(1, Math.max(0, riskScore + (Math.random() - 0.5) * 0.2))
      const cynicismScore = Math.min(1, Math.max(0, riskScore + (Math.random() - 0.5) * 0.2))
      const efficacyScore = Math.min(1, Math.max(0, riskScore + (Math.random() - 0.5) * 0.2))

      const prediction = await RiskPrediction.create({
        studentId: student._id,
        riskScore,
        riskLevel,
        exhaustionScore,
        cynicismScore,
        efficacyScore,
        featuresSnapshot: {
          gpa: randomInt(20, 40) / 10,
          attendanceRate: randomInt(65, 98),
          assignmentCompletionRate: randomInt(70, 100)
        },
        modelVersion: 'v1'
      })

      if (riskLevel !== 'low') {
        await Alert.create({
          studentId: student._id,
          predictionId: prediction._id,
          severity: riskLevel === 'high' ? 'critical' : 'warning',
          message: 'We noticed a risk pattern. Consider meeting your advisor.'
        })

        await Recommendation.create({
          studentId: student._id,
          predictionId: prediction._id,
          type: 'support',
          message: 'Schedule a study session and review your workload.'
        })
      }
    }

    for (const { student } of students) {
      const session = await Session.create({
        studentId: student._id,
        courseId: randomChoice(courses)._id,
        startAt: new Date(Date.now() - 7 * 86400000),
        endAt: new Date(Date.now() - 7 * 86400000 + 90 * 60000),
        durationMin: 90,
        context: { examWeek: false }
      })

      await ActivityLog.insertMany([
        { studentId: student._id, sessionId: session._id, type: 'login', score: 1 },
        { studentId: student._id, sessionId: session._id, type: 'study', value: randomInt(30, 120) },
        { studentId: student._id, sessionId: session._id, type: 'quiz', score: randomInt(60, 95) }
      ])

      await SelfReport.create({
        studentId: student._id,
        loadScore: randomInt(4, 9),
        stressScore: randomInt(3, 8),
        sleepHours: randomInt(5, 8),
        notes: 'Weekly self-report.'
      })

      await SensorData.insertMany([
        { studentId: student._id, sessionId: session._id, type: 'heartRate', value: randomInt(65, 95), unit: 'bpm' },
        { studentId: student._id, sessionId: session._id, type: 'hrv', value: randomInt(35, 70), unit: 'ms' },
        { studentId: student._id, sessionId: session._id, type: 'eegTheta', value: Math.random() * 0.5, unit: 'ratio' },
        { studentId: student._id, sessionId: session._id, type: 'eegAlpha', value: Math.random() * 0.5, unit: 'ratio' },
        { studentId: student._id, sessionId: session._id, type: 'blinkRate', value: randomInt(8, 18), unit: 'per_min' }
      ])

      await CognitiveLoadRecord.create({
        studentId: student._id,
        sessionId: session._id,
        overallLoad: randomInt(40, 85),
        intrinsicLoad: randomInt(35, 80),
        extraneousLoad: randomInt(30, 75),
        germaneLoad: randomInt(25, 70),
        featuresSnapshot: { simulated: true }
      })
    }

    const recoveryActions = await RecoveryAction.insertMany([
      { type: 'break', title: 'Short Break', description: 'Take a 10-minute walk or stretch.', durationMin: 10 },
      { type: 'mindfulness', title: 'Breathing Exercise', description: 'Try a 5-minute breathing exercise.', durationMin: 5 },
      { type: 'support', title: 'Advisor Check-in', description: 'Schedule a quick advisor check-in.', durationMin: 15 },
      { type: 'schedule', title: 'Study Planning', description: 'Review and rebalance your study plan.', durationMin: 20 },
      { type: 'peer', title: 'Peer Support', description: 'Join a peer study group session.', durationMin: 30 }
    ])

    for (const { student } of students) {
      await ConsentRecord.create({
        studentId: student._id,
        scopes: ['sensors', 'lms', 'notifications'],
        version: 'v1'
      })

      await SessionAction.create({
        studentId: student._id,
        actionId: randomChoice(recoveryActions)._id,
        status: 'recommended'
      })
    }

    for (let i = 0; i < 6; i++) {
      await Communication.create({
        fromUserId: mentorUser._id,
        toUserId: students[i % students.length].user._id,
        subject: 'Check-in on progress',
        message: 'Let me know if you need any help with coursework.',
        type: 'message',
        status: 'sent'
      })
    }

    console.log('\nDatabase seeded successfully.')
    console.log('\nTest Credentials:')
    console.log('Admin: admin@edge.com / Admin123456')
    console.log('Mentor: prof.johnson@edge.com / Prof123456')
    console.log('Student: john@student.com / John123456')

    process.exit(0)
  } catch (error) {
    console.error('Seeding error:', error)
    process.exit(1)
  }
}

seedDatabase()
