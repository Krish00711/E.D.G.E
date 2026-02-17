# E.D.G.E Website - Complete UI/UX Walkthrough

**What You See, Where You Click, What Happens**

---

## PART 1: LANDING & AUTHENTICATION

### Home Page (/)
**URL:** `http://localhost:5173/`

**What You See:**
- Navy/orange gradient background (dark theme)
- **E.D.G.E** logo in top-left
- Large hero section: "Early Detection & Guidance Engine"
- Subtitle: "AI-powered student wellness & burnout prevention"
- Two buttons at bottom:
  - **"Sign In"** (white text, orange background)
  - **"Create Account"** (white text, orange border)
- Navbar (top-right):
  - If logged out: Sign In, Create Account links
  - If logged in: Dashboard, Profile, Logout

---

### Sign In Page (/login)
**URL:** `http://localhost:5173/login`

**What You See:**
- "Sign In" heading
- "Welcome back to E.D.G.E" subtitle
- **Form fields:**
  - Email input
  - Password input (masked • • •)
  - "Remember me" checkbox (optional)
- **"Sign In"** button (full-width, orange)
- Blue link at bottom: "Don't have an account? Sign Up"

**What Happens When You Click "Sign In":**
1. Frontend validates email/password (required)
2. Sends `POST /api/auth/login` with email/password
3. Backend returns JWT token + user object (id, email, name, role, studentId/instructorId)
4. Frontend stores token in localStorage (`edge_token`)
5. Frontend stores user in localStorage (`edge_user`)
6. **Redirects to `/dashboard`**

**Error Cases:**
- Email doesn't exist → "Invalid credentials"
- Wrong password → "Invalid credentials"
- Network error → "Login failed. Please try again."

---

### Sign Up Page (/register)
**URL:** `http://localhost:5173/register`

**What You See:**
- "Create Account" heading
- "Join E.D.G.E today" subtitle

**Form Fields (All Required):**
1. **Full Name** (text input)
2. **Email** (email input)
3. **Password** (password input, min 8 chars)
4. **Role** (dropdown):
   - Student (default selected)
   - Mentor
   - Admin

**If Role = "Student" (Additional Fields Appear):**
5. **Major** (text input, e.g., "Computer Science")
6. **Baseline Survey Section** (light border box):
   - **Load Score (1-10)** (number input, optional)
   - **Stress Score (1-10)** (number input, optional)
   - **Sleep Hours** (number input, 0-24, optional)
7. **Consent Checkbox:**
   - ☐ "I consent to use of study activity and wellness inputs to personalize insights."

**"Create Account" button** (full-width, orange)

**Blue link at bottom:** "Already have an account? Sign in"

**What Happens When You Click "Create Account":**
1. Frontend validates all required fields
2. If optional baseline fields filled, converts to numbers
3. Sends `POST /api/auth/register` with all data (including baseline + consent flag)
4. Backend creates:
   - User (name, email, password hash, role)
   - Student profile (if role=student)
   - SelfReport with baseline data (if provided, marked `isBaseline: true`)
   - ConsentRecord (if checked)
5. Backend returns JWT token + user object
6. Frontend stores token + user
7. **Redirects to `/dashboard`**

**Error Cases:**
- Email already registered → "Email already in use"
- Password < 8 chars → "Password must be at least 8 characters"
- Validation errors → Display field-specific errors

---

## PART 2: STUDENT DASHBOARD & FEATURES

### Student Dashboard (/dashboard)
**URL:** `http://localhost:5173/dashboard`

**Access:** Student role only

**Top Navbar (Fixed):**
- Left: E.D.G.E logo (clickable → /dashboard)
- Center: Breadcrumb or app title
- Right: User profile dropdown (avatar + "John Doe")

**Sidebar Navigation (Left):**
- Dashboard (active/highlighted)
- Load (→ `/cognitive-load`)
- Recovery (→ `/recovery`)
- Insights (→ `/insights`)
- Consent (→ `/consent`)
- Self Reports (→ `/self-reports`)
- Activity (→ `/activity`)
- Sessions (→ `/sessions`)
- Grades (→ `/grades`)
- Assignments (→ `/assignments`)
- Attendance (→ `/attendance`)
- Courses (→ `/courses`)
- Notifications (→ `/notifications`)
- Messages (→ `/communications`)
- Forums (→ `/forums`)
- Resources (→ `/resources`)
- Logout (red text)

**Main Content Area:**

#### Section 1: Risk Status Card
**Title:** "Your Burnout Risk"

**Large gauge/visual:**
- Color coded: 🟢 Green (low) / 🟡 Yellow (moderate) / 🔴 Red (high)
- Risk score: **0.65 / 1.0** (example)
- Risk level: **"Moderate"**

**Below gauge (3 columns):**
- 📊 **Exhaustion** | Score: 0.68 | Bar chart
- 📊 **Cynicism** | Score: 0.71 | Bar chart
- 📊 **Efficacy** | Score: 0.75 | Bar chart

**Last updated:** "2 hours ago"

#### Section 2: Quick Stats
- Total study sessions: **12**
- Average study time: **95 min**
- This week's activity: **18 entries**
- Current sleep avg: **6.5 hrs**

#### Section 3: Today's Cognitive Load
**Card title:** "Current Cognitive Load"
- Overall Load: **68 / 100** (progress bar)
- Intrinsic Load: 60
- Extraneous Load: 70
- Germane Load: 65
- Last computed: "1 hour ago"
- [**Recompute** button]

#### Section 4: Recent Self-Reports
**Table:**
| Date | Load | Stress | Sleep | Notes |
|------|------|--------|-------|-------|
| Feb 14, 2:30 PM | 7 | 6 | 6.5 | Midterm prep |
| Feb 13, 11:15 AM | 5 | 5 | 7 | Normal day |

**[View all Self-Reports]** link → `/self-reports`

#### Section 5: Recommended Recovery Actions
**Alert banner (if risk > 0.6):**
> ⚠️ Your stress levels are elevated. Consider these recovery actions:

**Action cards (3-4):**
- 🏃 **Take a 15-minute walk** | Status: Not started | [Start]
- 😴 **Take a 20-minute nap** | Status: In progress | [Mark Complete]
- 🧘 **Practice deep breathing (5 min)** | Status: Not started | [Start]

**[View all recovery actions]** → `/recovery`

#### Section 6: Consent & Privacy
**Small banner (if not consented):**
> 📋 You haven't completed consent yet. Review privacy settings → [Go to Consent]

---

### Self-Reports Page (/self-reports)
**URL:** `http://localhost:5173/self-reports`

**What You See:**

#### Top Section: "Submit New Report"
**Card with form:**
- **Load Score (1-10)** | Dropdown/slider: [5 ▼]
- **Stress Score (1-10)** | Dropdown/slider: [5 ▼]
- **Sleep Hours (0-24)** | Number input: [7]
- **Notes** | Textarea: [Type notes here...]
- **[Submit Report]** button (orange)

**Success message (if submitted):** "Report submitted! Prediction updated."

#### Bottom Section: "History"
**Table with all past self-reports:**
| Load | Stress | Sleep | Notes | Date |
|------|--------|-------|-------|------|
| 7 | 6 | 6.5 | Midterm prep | Feb 14, 2:30 PM |
| 5 | 5 | 7 | Normal day | Feb 13, 11:15 AM |
| 8 | 7 | 5.5 | Lots of assignments | Feb 12, 9:00 AM |

**Rows clickable** → Shows full details

---

### Activity Logs Page (/activity)
**URL:** `http://localhost:5173/activity`

#### Top Section: "Log Activity"
**Card with form:**
- **Type** | Dropdown: [Study ▼]
  - Options: Study, Quiz, Assignment, Page View, Login
- **Value (minutes)** | Number input: [90]
- **Score** | Number input: [blank] (optional)
- **Session ID** | Text input: [blank] (optional)
- **[Save Activity]** button (orange)

**Success:** "Activity logged! Prediction updated."

#### Bottom Section: "Recent Activity"
**Table:**
| Type | Value | Score | Date |
|------|-------|-------|------|
| Study | 120 min | — | Feb 14, 1:00 PM |
| Quiz | — | 85 | Feb 14, 12:30 PM |
| Assignment | — | 92 | Feb 14, 10:00 AM |

---

### Sessions Page (/sessions)
**URL:** `http://localhost:5173/sessions`

#### Top Section: "Log Session"
**Card with form:**
- **Course ID** | Text input: [blank] (optional)
- **Start Time** | DateTime picker: [2026-02-14 14:30]
- **End Time** | DateTime picker: [blank] (optional for ongoing)
- **[Save Session]** button (orange)

#### Bottom Section: "Recent Sessions"
**Table:**
| Session | Duration | Start | End |
|---------|----------|-------|-----|
| Session abc123 | 95 min | Feb 14, 1:00 PM | Feb 14, 2:35 PM |
| Session def456 | 120 min | Feb 13, 2:00 PM | Feb 13, 4:00 PM |

---

### Grades Page (/grades)
**URL:** `http://localhost:5173/grades`

**What You See:**

**Top: Summary Card**
- **GPA:** 3.24
- **Grades this semester:** 8 recorded
- **Grade trend:** ↑ +2.5% (green indicator)

**Table: All Grades**
| Course | Assignment/Quiz | Score | Max | Type | Grade % |
|--------|-----------------|-------|-----|------|---------|
| CS101 | Midterm | 85 | 100 | midterm | 85% |
| CS101 | Quiz 3 | 42 | 50 | quiz | 84% |
| MATH201 | HW1 | 18 | 20 | assignment | 90% |

**Filter/Sort options:**
- Sort by: Date (default), Course, Score
- Filter by: Course [All ▼], Type [All ▼]

**[Download Transcript]** button → CSV export

---

### Assignments Page (/assignments)
**URL:** `http://localhost:5173/assignments`

**What You See:**

**Top: Filter/Search**
- Search: [Type assignment name...]
- Filter by: Course [All ▼], Status [All ▼]
- Sort by: Due Date (default)

**Cards/List: Assignments**
Each card shows:
```
[Course] CS101 - Programming Project
Due: Feb 18, 5:00 PM (in 4 days)
Status: Not Submitted ⚠️
Points: 100
[View & Submit]
```

**Card colors:**
- 🟢 Green: Submitted + graded
- 🟡 Yellow: Submitted, pending grade
- 🔴 Red: Not submitted, overdue
- ⚫ Gray: Not submitted, upcoming

**Click [View & Submit]:**
- Shows assignment description
- Button: **[Submit Assignment]**
- File upload field or text area
- [Upload & Submit] button

**After submit:**
- Status changes to 🟡 Yellow "Submitted, pending grade"
- Confirmation message: "Assignment submitted!"

---

### Courses Page (/courses)
**URL:** `http://localhost:5173/courses`

**What You See:**

**Grid of course cards (2-3 columns):**
```
┌─────────────────────┐
│ CS101               │
│ Intro to CS         │
│ Instructor: Dr. Smith│
│ Credits: 3          │
│ Grade: A-           │
│ Attendance: 92%     │
│                     │
│ [View Course]       │
└─────────────────────┘
```

**Click [View Course]:**
- Course details page
- Assignments in this course
- Your grade in course
- Attendance record
- Resources

---

### Cognitive Load Page (/cognitive-load)
**URL:** `http://localhost:5173/cognitive-load`

**What You See:**

**Top: Current Load**
```
Overall Load: 68/100 ████████░░

Breakdown:
├─ Intrinsic Load (task complexity): 60/100 ██████░░░░
├─ Extraneous Load (distractions): 70/100 ███████░░░
└─ Germane Load (productive focus): 65/100 ██████░░░░

Last computed: 1 hour ago
Features snapshot:
- Heart Rate: 78 bpm
- Sleep: 6.5 hrs
- Stress: 6/10
- Study Load: 7/10

[Recompute] [View History]
```

**History Graph:**
- X-axis: Days (last 7 days)
- Y-axis: Load score (0-100)
- Line chart showing trend

**Date selector:** [All Time ▼] or [Last 7 days ▼]

---

### Recovery Page (/recovery)
**URL:** `http://localhost:5173/recovery`

**What You See:**

**Top: Recovery Actions Library**
**Cards (grid layout):**
```
🏃 Take a 15-minute walk
Description: Light exercise reduces stress immediately.
Time: 15 min | Difficulty: Easy
[Start Action]

😴 Take a 20-minute nap
Description: Power nap boosts focus and memory.
Time: 20 min | Difficulty: Easy
[Start Action]

🧘 Practice deep breathing (5 min)
Description: 4-7-8 breathing technique to calm nervous system.
Time: 5 min | Difficulty: Very Easy
[Start Action]

📚 Study with fresh mindset
Description: Take a break, then resume with renewed focus.
Time: 30 min | Difficulty: Medium
[Schedule]

💬 Call a friend or mentor
Description: Social connection reduces isolation.
Time: 15-60 min | Difficulty: Medium
[Contact]
```

**Bottom: Active Recovery Actions**
**Table:**
| Action | Recommended | Status | Started | Completed |
|--------|-------------|--------|---------|-----------|
| Take a 15-minute walk | Yes | In Progress | 2:45 PM | — |
| 4-7-8 Breathing | Yes | Not Started | — | — |
| Schedule study break | No | Completed | 1:30 PM | 2:00 PM |

**Status indicators:**
- 🔵 In Progress: [Mark Complete]
- ⚪ Not Started: [Start]
- ✅ Completed: [View]

---

### Insights Page (/insights)
**URL:** `http://localhost:5173/insights`

**What You See:**

#### Section 1: Early Warning Analysis
**Card:**
```
⚠️ Your burnout risk is MODERATE

Based on:
- Low sleep (6.5 hrs vs. recommended 8 hrs)
- High stress score (6/10)
- Heavy workload this week (18 activities)

Recommendation: Focus on sleep quality and take recovery breaks.
```

#### Section 2: Peer Comparison
**Chart: Your percentile vs cohort**
```
Your Risk Score: 0.65
Percentile: 72nd (72% of cohort has lower risk)

Your GPA: 3.24
Percentile: 65th

Your Engagement: 85%
Percentile: 78th
```

**Message:** "You're in the higher-risk group. Recovery actions recommended."

#### Section 3: Engagement Trends
**Chart: Line graph**
- X-axis: Weeks (last 4 weeks)
- Y-axis: Activity count
- Shows trend (up/down/flat)

#### Section 4: Recovery Trajectory
**Card:**
```
If you follow recommended actions, estimated recovery:

Current trajectory: ↗ IMPROVING
- Session duration increasing ✓
- Sleep improving ✓
- Stress stabilizing ✓

Estimated time to "Low Risk": 2-3 weeks
```

---

### Notifications Page (/notifications)
**URL:** `http://localhost:5173/notifications`

**What You See:**

**Tab buttons:**
- All (active/highlighted)
- Unread (badge: 3)
- Alerts
- Messages
- System

**Notification list (reverse chronological - newest first):**
```
🔴 [ALERT] High Risk Detected
Your burnout risk is now MODERATE. Consider recovery actions.
2 hours ago | [Mark Read] [Dismiss]

🟡 [INSIGHT] New Peer Comparison Available
You've improved 5% vs. last week in engagement!
Yesterday | [View] [Dismiss]

💬 [MESSAGE] Dr. Smith sent you a message
"Great work on the midterm project!"
Yesterday at 3:00 PM | [View] [Reply]

📌 [SYSTEM] Weekly Report Ready
Your progress report is available for download.
2 days ago | [View] [Dismiss]
```

**Unread count (top):** "3 unread"
**[Mark All as Read]** button

**Click notification:**
- Expands or navigates to related page (e.g., Alert → shows detail, Message → goes to chat)
- Auto-marks as read

---

### Messages Page (/communications)
**URL:** `http://localhost:5173/communications`

**Layout: Split screen**

**Left: Inbox List**
```
[Search...] [New Message]

📨 Dr. Smith
Great work on the project!
Feb 14, 2:30 PM ✓✓ (read)

📨 John (ClassMate)
Want to form a study group?
Feb 14, 10:00 AM (unread) 🔴

📨 System Notification
Your grades are available
Feb 13, 3:00 PM ✓ (read)

📨 Mentor Support
Need help with CS101?
Feb 12 (read)
```

**Right: Message Thread**
(When you click a conversation)
```
Dr. Smith

Dr. Smith (Feb 14, 2:30 PM):
"Great work on the project! Your analysis was thorough.
Keep up the good work."

You (Feb 14, 2:31 PM):
"Thank you! I really enjoyed this project."

---

[Type response...]
[Send] [Attach File]
```

**New Message button:**
- Opens modal to select recipient + compose message
- [Send] button

---

### Forums Page (/forums)
**URL:** `http://localhost:5173/forums`

**What You See:**

**Forum list:**
```
📋 General Q&A
Posts: 24 | Last: "How to submit assignments?" (2 hours ago)
[View Forum]

📋 CS101 Course Discussion
Posts: 156 | Last: "Midterm review session" (1 hour ago)
[View Forum]

📋 Study Groups
Posts: 34 | Last: "Anyone studying for finals?" (5 hours ago)
[View Forum]
```

**Click [View Forum]:**

**Forum detail:**
```
CS101 Course Discussion

[Create New Post]

📝 Thread 1: Midterm Review Session (15 replies)
Posted by Dr. Smith (Feb 14, 1:00 PM)
"Join us Thursday 3 PM in Room 101 for midterm review."
❤️ 8 likes | 15 replies | 234 views

[View Thread]

📝 Thread 2: Assignment 3 Clarification (8 replies)
Posted by Tom (Feb 13, 6:00 PM)
"Is part B optional in assignment 3?"
👍 5 likes | 8 replies | 102 views

[View Thread]
```

**Click [View Thread]:**
```
Midterm Review Session
Started by Dr. Smith (Feb 14, 1:00 PM)

Message 1 - Dr. Smith:
"Join us Thursday 3 PM in Room 101 for midterm review."
[❤️ Like] [Reply]

Message 2 - John (1:30 PM):
"Will this cover Chapter 5?"
[❤️ 2 likes] [Reply]

Message 3 - Dr. Smith (1:35 PM):
"Yes, chapters 1-5 will be covered."
[❤️ 1 like]

---
[Type reply...] [Reply]
```

---

### Resources Page (/resources)
**URL:** `http://localhost:5173/resources`

**What You See:**

**Filter/Search:**
- Search: [Type resource name...]
- Filter: Type [All ▼] (Study Guides, Videos, Tools, Tutorials)
- Sort: Popularity (default), Date, Rating

**Resource cards:**
```
📄 CS101 Midterm Study Guide
By: Dr. Smith | Feb 10
Rating: ★★★★★ (45 reviews)
"Comprehensive review of key concepts"
Views: 234 | Helpful: 89%

[View] [Mark Helpful ✓]

---

🎥 Python For Beginners (YouTube Playlist)
By: Course Materials | Feb 5
Rating: ★★★★☆ (120 reviews)
"20 short videos covering basics"
Views: 1,245 | Helpful: 92%

[View] [Mark Helpful ✓]

---

📚 The Effective Student Handbook
By: Learning Center | Jan 20
Rating: ★★★★★ (78 reviews)
"Time management, note-taking, study strategies"
Views: 567 | Helpful: 96%

[View] [Mark Helpful ✓]
```

**Click [View]:**
- Full resource details
- Description
- Download link (if PDF)
- Embedded content (if video)
- Comments/feedback section
- [Mark as Helpful / Not Helpful] buttons

---

### Attendance Page (/attendance)
**URL:** `http://localhost:5173/attendance`

**What You See:**

**Summary:**
- Overall Attendance Rate: **92%**
- Classes Attended: **23 out of 25**
- Days Absent: **2** (Feb 5, Feb 12)
- Days Late: **1** (Feb 8)

**Attendance by Course:**
| Course | Attended | Total | Rate |
|--------|----------|-------|------|
| CS101 | 15 | 16 | 94% |
| MATH201 | 8 | 9 | 89% |

**Full History:**
| Date | Course | Status | Time |
|------|--------|--------|------|
| Feb 14 | CS101 | Present | 2:00 PM |
| Feb 13 | MATH201 | Present | 10:00 AM |
| Feb 12 | CS101 | Absent | — |
| Feb 11 | MATH201 | Present (Late) | 10:08 AM |

---

### Consent Page (/consent)
**URL:** `http://localhost:5173/consent`

**What You See:**

**Title: "Privacy & Consent Management"**

#### Section 1: Consent Status
```
Your consent was accepted on Feb 14, 2026 at 2:10 PM
Version: v1

Current Scopes:
✅ Sensors - Allow sensor data ingestion
✅ LMS - Allow LMS data integration
✅ Notifications - Allow preference tracking
✅ Analytics - Allow cohort comparisons

[✏️ Update Scopes] [Revoke All Consent]
```

#### Section 2: What We Collect
```
📊 Academic Data
- Grades, assignments, attendance
- Used for: Performance analysis, predictions

🏥 Wellness Data
- Self-reports (stress, sleep, load)
- Sensor data (optional: heart rate, EEG)
- Used for: Burnout prediction, recovery recommendations

📱 Activity Data
- Study sessions, activity logs
- Used for: Engagement tracking, trend analysis
```

#### Section 3: How We Use Your Data
```
✓ Calculate burnout risk (ML prediction)
✓ Recommend recovery actions
✓ Alert instructors to high-risk students (with consent)
✓ Show peer comparisons (anonymized)
✗ Never share personal data with third parties without additional consent
```

#### Section 4: Audit Log
```
Consent changes:
Feb 14, 2:10 PM - Accepted consent (v1) [sensors, lms, notifications, analytics]
Feb 14, 1:45 PM - Skipped consent on registration
```

#### Action Button:
- If consented: **[Revoke Consent]** (red)
- If not consented: **[Accept Consent]** (orange) or **[Remind me later]**

---

## PART 3: MENTOR / INSTRUCTOR DASHBOARD

### Instructor Dashboard (/instructor-dashboard)
**URL:** `http://localhost:5173/instructor-dashboard`

**Access:** Mentor/Admin role

**Navbar:** Same as student

**Sidebar Navigation:**
- Dashboard (active)
- Students (→ `/admin/students`)
- Alerts (→ `/alerts`)
- Interventions (→ `/interventions`)
- Reports (→ `/reports`)
- Analytics (→ `/analytics`)
- Bulk Import (→ `/bulk`)
- Settings
- Logout

**Main Content:**

#### Section 1: Cohort Overview
**Large cards:**
```
Total Students: 156

Risk Distribution:
🟢 Low Risk: 78 (50%)
🟡 Moderate: 52 (33%)
🔴 High Risk: 26 (17%)

[View All High-Risk Students]
```

#### Section 2: Critical Alerts
**Alert cards (red border):**
```
🔴 CRITICAL - John Doe
Burnout Risk: 0.82 (HIGH)
Last prediction: 2 hours ago
Missed classes: 3 in a row
Grades: ↓ Declining

[View Student] [Create Intervention] [Send Message]

---

🔴 CRITICAL - Jane Smith
Burnout Risk: 0.78 (HIGH)
Last activity: 3 days ago
Sleep: 5 hrs/night (average)
Stress: 8/10

[View Student] [Create Intervention] [Send Message]
```

#### Section 3: Recent Interventions
**Table:**
| Student | Type | Status | Created | Action |
|---------|------|--------|---------|--------|
| John Doe | Tutoring | Active | Feb 13 | [View] |
| Jane Smith | Study Group | Pending | Feb 12 | [View] |
| Tom | Counseling Ref | Completed | Feb 10 | [View] |

#### Section 4: Quick Actions
**Buttons:**
- [Create New Intervention]
- [Send Bulk Message]
- [Generate Weekly Report]
- [Import Grades from CSV]

---

### Students List (/admin/students)
**URL:** `http://localhost:5173/admin/students`

**What You See:**

**Filter/Search:**
- Search: [Type name or email...]
- Filter by: Risk Level [All ▼] (Low, Moderate, High)
- Filter by: Course [All ▼]
- Sort by: Risk Score (default), Name, Last Activity

**Students table (sortable columns):**
| Student | Risk Level | Risk Score | Last Activity | GPA | Status | Action |
|---------|-----------|------------|----------------|-----|--------|--------|
| John Doe | 🔴 High | 0.82 | 3 hours ago | 2.8 | Active | [View] |
| Jane Smith | 🔴 High | 0.78 | 2 days ago | 3.1 | Active | [View] |
| Tom Johnson | 🟡 Moderate | 0.62 | 1 hour ago | 3.4 | Active | [View] |
| Sarah Lee | 🟢 Low | 0.35 | 30 min ago | 3.8 | Active | [View] |

**Row highlighting:**
- Red rows: High risk
- Yellow rows: Moderate risk
- Green rows: Low risk

**Click [View]:**
→ Navigate to student detail page

---

### Student Detail Page (/admin/students/:id)
**URL:** `http://localhost:5173/admin/students/xxxxx` (where xxxxx = studentId)

**What You See:**

**Top: Student Header**
```
John Doe
john@student.com
CS Major, 2nd Year, Cohort 2024-2026
Last Seen: 3 hours ago
```

**Section 1: Burnout Prediction (Large)**
```
Current Risk: HIGH (0.82)
🔴 Updated: 2 hours ago

Dimensions:
├─ Exhaustion: 0.78 ████████░░ (High)
├─ Cynicism: 0.85 █████████░ (Very High)
└─ Efficacy: 0.72 ███████░░░ (High)

Historical predictions (chart):
[Line graph showing trend - trending UP (red)]

[Recalculate Now] [View All Predictions]
```

**Section 2: Academic Profile**
```
GPA: 2.8 ↓ (trend down)
Grades this semester: 8 recorded
Last grade: C+ (Feb 10)

Attendance:
- Overall Rate: 78% (below class average of 92%)
- Absences: 5 in last 30 days
- Tardies: 2

Assignments:
- Submitted: 18/25 (72%)
- on time: 14/18
- Average score: 76

[View Full Academic Record]
```

**Section 3: Wellness Data**
```
Recent Self-Reports (last 5):
┌─────────────────────────────────────┐
│ Load | Stress | Sleep | Notes        │
│  8   |   8    |  5    | Exam prep    │ Feb 14
│  7   |   7    |  5.5  | Busy week    │ Feb 13
│  6   |   6    |  6    | Normal       │ Feb 12
└─────────────────────────────────────┘

Sleep Average: 5.4 hrs (Recommended: 8 hrs)
Stress Average: 7.2/10 (Elevated)

[View All Self-Reports]
```

**Section 4: Activity Overview**
```
Activity Frequency: 18 entries this week
Study Sessions: 12 hrs total
Last activity: 3 hours ago (Study - 85 min)

Activity trend (last 7 days):
[Bar chart - showing dip on Feb 12 and 13]

[View Full Activity Log]
```

**Section 5: Open Alerts**
```
🔴 CRITICAL - High risk sustained for 5 days
🟡 WARNING - Low engagement (3 days without activity)
🟡 WARNING - Declining grades (last 3 grades: A, B+, C+)

[Acknowledge Alert] [View All Alerts]
```

**Section 6: Active Interventions**
```
📋 Tutoring Session
Status: Active
Created: Feb 13
Tutor: Dr. Martinez
Session: Monday 3 PM
[View Details] [Complete] [Add Note]

---

📋 Study Group Referral
Status: In Progress
Created: Feb 10
Group: CS Study Group (5 members)
[View Details] [Follow Up]
```

**Section 7: Recommended Recovery Actions**
```
✓ Take a 15-minute walk
✓ Improve sleep to 8 hours/night
✓ Take a mental health break
✓ Schedule tutoring appointment

[Recommend to Student] [View All Actions]
```

**Bottom Buttons:**
- [Send Message]
- [Create Intervention]
- [Create Alert]
- [Generate Report]

---

### Alerts Page (/alerts)
**URL:** `http://localhost:5173/alerts`

**Access:** Admin/Mentor

**Filter:**
- Alert Type [All ▼] (High Risk, Low Engagement, Grade Drop, Attendance)
- Severity [All ▼] (Low, Medium, High, Critical)
- Status [All ▼] (Active, Acknowledged, Resolved)

**Alert cards:**
```
🔴 CRITICAL - High Risk Sustained
Students: John Doe, Jane Smith, 2 others
Duration: 5 days and counting
Message: Burnout risk > 0.75 for multiple days

Created: Feb 14, 2:00 PM
Created by: System (auto-generated)
[View All Affected Students] [Acknowledge]

---

🟡 WARNING - Low Engagement
Student: Tom Johnson
Message: No activity for 3 days (unusual pattern)

Created: Feb 13, 10:30 AM
Created by: System (auto-generated)
[View Student] [Investigate] [Mark Resolved]

---

🟡 WARNING - Grade Drop
Students: 5 students
Message: Recent grades down 10+ points vs. previous average

Created: Feb 13, 8:00 AM
Created by: System (auto-generated)
[View Students] [Create Bulk Intervention]
```

---

### Interventions Page (/interventions)
**URL:** `http://localhost:5173/interventions`

**Access:** Admin/Mentor

**Top buttons:**
- [Create New Intervention]

**Interventions table:**
| Student | Type | Status | Created | Assigned to | Effectiveness |
|---------|------|--------|---------|-------------|----------------|
| John Doe | Tutoring | Active | Feb 13 | Dr. Martinez | — |
| Jane Smith | Study Group | In Progress | Feb 12 | Course Admin | — |
| Tom | Counseling Ref | Completed | Feb 10 | Student Services | 85% |

**Click row → Intervention detail:**
```
Tutoring Session - John Doe

Status: Active ⚫
Type: Tutoring
Created: Feb 13, 2:00 PM
Assigned to: Dr. Martinez

Details:
- Frequency: 2x per week
- Focus: CS101 Exam prep
- Start Date: Feb 13
- Expected End: Mar 10

Notes:
"First session went well. John seems engaged."
- Dr. Martinez (Feb 13, 4:00 PM)

"Following up - John attended both sessions this week."
- Dr. Martinez (Feb 14, 10:00 AM)

[Add Note]

Effectiveness: Pending (intervention active)

[Edit] [Mark Complete] [Archive]
```

---

### Reports Page (/reports)
**URL:** `http://localhost:5173/reports`

**Access:** Admin/Mentor

**Report types (tabs):**

#### Tab 1: Weekly Cohort Report
**Button:** [Generate Weekly Report]

**Report section (when available):**
```
Weekly Report: Feb 10 - Feb 16, 2026

Risk Summary:
- Average cohort risk: 0.48 (Moderate)
- High-risk students: 26 (↑ from 24 last week)
- Critical alerts: 4

Top Concerns:
1. Sleep deprivation (avg 6.1 hrs, recommended 8)
2. Rising cynicism scores (↑ 5% from last week)
3. Assignment completion down 3%

Recovery Actions Recommended:
- 156 total
- Top 3: Sleep improvement, break scheduling, peer study groups

Intervention Effectiveness:
- Completed: 8 interventions this week
- Success rate: 75% (student risk reduced)

[Download PDF] [Email Report] [View Detailed Analytics]
```

#### Tab 2: Student Transcript
**Search:** [Select student...]

**Generates:**
- Academic transcript (all grades)
- GPA history
- Attendance summary
- Downloadable as PDF

#### Tab 3: Export Data (Admin only)
**Buttons:**
- [Export All Predictions (CSV)]
- [Export All Alerts (CSV)]
- [Export All Interventions (CSV)]
- [Export Grades (CSV)]
- [Export Attendance (CSV)]

---

### Analytics Page (/analytics)
**URL:** `http://localhost:5173/analytics`

**Access:** Admin/Mentor

**Dashboard panels:**

#### Section 1: Cohort Risk Distribution
**Large pie chart:**
- 🟢 Low: 50% (78 students)
- 🟡 Moderate: 33% (52 students)
- 🔴 High: 17% (26 students)

#### Section 2: Risk Trends (Time Series)
**Line chart (last 30 days):**
- Y-axis: Avg risk score (0-1)
- X-axis: Days
- Shows trend (↑ up or ↓ down)
- Annotation: "+5% increase this week"

#### Section 3: By Course
**Bar chart:**
- CS101: 0.62 avg risk
- MATH201: 0.48 avg risk
- ENG101: 0.55 avg risk
- etc.

#### Section 4: Engagement Metric
**Line chart:**
- Activity frequency per student
- Trend over time

#### Section 5: Intervention Effectiveness
**Key stat:**
- Completed interventions: 45
- Success rate (risk reduced): 73%
- Avg improvement: -0.12 risk score

---

## PART 4: ADMIN DASHBOARD

### Admin Dashboard (/admin/dashboard)
**URL:** `http://localhost:5173/admin/dashboard`

**Access:** Admin role only

**Everything from Instructor + Extra:**

#### Admin-Only Sections:

**System Configuration:**
```
Settings:
- Prediction threshold: 0.65
- Alert threshold: 0.75
- Cohort assignment rule: [Edit]
- LMS integration: [Configure Moodle/Canvas]

[Save Settings]
```

**Bulk Operations:**
```
Quick Links:
- [Import Students (CSV)]
- [Import Courses (CSV)]
- [Import Grades (CSV)]
- [Import Attendance (CSV)]
- [Bulk Create Assignments]
- [Bulk Enroll Students]

File upload → Validation → Preview → Confirm
```

**User Management:**
```
Users table:
| Name | Email | Role | Created | Status | Action |
|------|-------|------|---------|--------|--------|
| John Doe | john@s... | student | Feb 10 | Active | [Deactivate] |
| Dr. Smith | smith@... | mentor | Jan 15 | Active | [Edit] |

[Create User] [Deactivate User] [View Logs]
```

---

## PART 5: COMPLETE USER JOURNEY EXAMPLE

### Example 1: New Student Full Journey

**Step 1: Landing Page**
- User sees home page
- Clicks "Create Account"

**Step 2: Registration**
- Fills form:
  - Name: "John Doe"
  - Email: "john@student.com"
  - Password: "John123456"
  - Role: Student
  - Major: "Computer Science"
  - Load: 5, Stress: 5, Sleep: 7
  - ☑ Consent checkbox
- Clicks "Create Account"

**Backend:**
- Creates User, Student, SelfReport (baseline), ConsentRecord
- Returns JWT + user data

**Step 3: Dashboard**
- Frontend stores token & user
- Redirects to `/dashboard`
- Student sees dashboard with "Baseline self-report recorded"

**Step 4: Self-Report Activity**
- Student navigates to `/self-reports`
- Fills form: Load: 7, Stress: 6, Sleep: 6.5
- Clicks "Submit Report"

**Backend:**
- Saves SelfReport to DB
- **Auto-triggers:** Calls `calculatePredictionForStudent(studentId)`
  - Aggregates features
  - Calls ML service
  - Stores RiskPrediction (0.58, Moderate)
  - Creates Alert if risk > threshold

**Frontend:**
- Shows success: "Report submitted! Prediction updated"
- Dashboard updates to show new risk score

**Step 5: Student Sees Recommendations**
- Dashboard shows 3 recovery actions
- Student clicks "Take a 15-minute walk"
- Status changes to "In Progress"
- After completing, clicks "Mark Complete"
- Status changes to ✅ "Completed"

**Step 6: Instructor Notified**
- Instructor logs in
- Sees John Doe in moderate-risk group
- Clicks [View] on John's name
- Sees detail page with all data
- Creates intervention: "Tutoring Session"
- System sends notification to John

**Step 7: John Sees Intervention**
- Gets notification: "Dr. Martinez recommended tutoring"
- Navigates to Recovery/Interventions
- Sees tutoring recommendation
- Clicks [Accept]
- Gets meeting details

---

### Example 2: Instructor Monitoring Workflow

**Step 1: Instructor Login**
- Logs in with mentor account
- Sees `/instructor-dashboard`
- Notices 26 high-risk students (alert banner in red)

**Step 2: Check Critical Alerts**
- Clicks "Critical Alerts" section
- Sees John Doe (risk 0.82, 3 days no classes)
- Clicks [View Student]

**Step 3: Student Detail Page**
- Sees all data: predictions, grades, activity, wellness
- Notices:
  - Risk trending UP
  - Sleep declining
  - Grades declining
  - Activity dropped 3 days ago

**Step 4: Create Intervention**
- Clicks [Create Intervention]
- Modal opens:
  - Type: [Tutoring ▼]
  - Tutor: [Dr. Martinez ▼]
  - Frequency: [2x per week]
  - Duration: [4 weeks]
  - Notes: "Focus on CS101 exam prep"
  - [Create]

**Step 5: Send Message**
- Clicks [Send Message]
- Types: "Hi John, I noticed you've been struggling. I'd like to recommend tutoring sessions with Dr. Martinez. Let's meet tomorrow at 2 PM?"
- Clicks [Send]

**Step 6: Monitor Progress**
- Next day, checks dashboard again
- Sees John's prediction improved to 0.68 (down from 0.82)
- Activity picked up
- Notes improving trend

---

## SUMMARY: KEY CLICK PATTERNS

| Goal | Where to Click | What You See |
|------|-----------------|-------------|
| **Login** | Home → "Sign In" | Login form |
| **Register** | Home → "Create Account" | Registration with baseline survey |
| **Submit wellness data** | Dashboard → "Self Reports" → [Submit Report] | Success msg, data saved, prediction updated |
| **Log activity** | Dashboard → "Activity" → [Save Activity] | Auto prediction triggered |
| **Check risk** | Dashboard (top card) | Risk score + 3 dimensions |
| **View recovery** | Dashboard → "Recovery" or nav → "Recovery" | Actions library + status tracking |
| **View grades** | Nav → "Grades" | All grades + GPA + trends |
| **Message instructor** | Nav → "Messages" → [New Message] | Compose + send |
| **View notifications** | Nav → "Notifications" | All alerts, messages, system updates |
| **Instructor: See high-risk** | Instructor Dashboard | Red cards, sorted by risk |
| **Instructor: Create intervention** | Student detail → [Create Intervention] | Modal, fill type/tutor/details |
| **Instructor: View analytics** | Nav → "Analytics" | Risk distribution, trends, cohort metrics |
| **Admin: Bulk import** | Nav → "Bulk Import" | File upload, validation, import |
| **Admin: User management** | Nav → "Settings" → "Users" | User table, create/deactivate users |

---

**ALL WORKFLOWS COMPLETE. Every page, every button, every action documented.**
