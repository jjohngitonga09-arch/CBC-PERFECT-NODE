import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext'
import { useEffect } from 'react'
import Layout from './components/layout/Layout'
import PrivateRoute from './components/common/PrivateRoute'
import Maintenance from './pages/Maintenance'

// Auth
import Login from './pages/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import SignupTeacher from './pages/auth/SignupTeacher'
import SignupParent from './pages/auth/SignupParent'
import VerifyOtp from './pages/auth/VerifyOtp'
import Subscription from './pages/Subscription'

// Student
import StudentHome from './pages/student/Home'
import StudentVideos from './pages/student/Videos'
import StudentAssignments from './pages/student/Assignments'
import StudentPractice from './pages/student/Practice'
import StudentQuizzes from './pages/student/Quizzes'
import StudentBadges from './pages/student/Badges'
import StudentProgress from './pages/student/Progress'
import StudyTime from './pages/student/StudyTime'
import Stories from './pages/student/Stories'
import BibleStories from './pages/student/BibleStories'
import Writing from './pages/student/Writing'
import MathKnowledge from './pages/student/MathKnowledge'
import WorldExplorer from './pages/student/WorldExplorer'
import StudentMessages from './pages/student/Messages'
import StudentSubscription from './pages/student/Subscription'
import StudentSettings from './pages/student/Settings'
import GuardianChildren from './pages/guardian/Children'
import Profile from './pages/shared/Profile'
import Notifications from './pages/shared/Notifications'
import PaymentHistory from './pages/guardian/PaymentHistory'
import AdminPayments from './pages/admin/Payments'
import TeacherStudents from './pages/teacher/Students'
import Leaderboard from './pages/student/Leaderboard'
import StudentNotes from './pages/student/Notes'
import JuniorBasics from './pages/student/JuniorBasics'
// Parent
import ParentHome from './pages/parent/Home'
import ParentProgress from './pages/parent/Progress'
import ParentMessages from './pages/parent/Messages'
import ParentSubscription from './pages/parent/Subscription'
import ParentNotifications from './pages/parent/Notifications'

// Teacher
import TeacherHome from './pages/teacher/Home'
import TeacherUploadVideo from './pages/teacher/UploadVideo'
import TeacherCreateCard from './pages/teacher/CreateCard'
import TeacherAssignments from './pages/teacher/Assignments'
import TeacherSubmissions from './pages/teacher/Submissions'
import TeacherClassProgress from './pages/teacher/ClassProgress'
import TeacherMessages from './pages/teacher/Messages'
import AdminMessages from './pages/admin/Messages'

// Admin
import AdminHome from './pages/admin/Home'
import AdminUsers from './pages/admin/Users'
import AdminSubscriptions from './pages/admin/Subscriptions'
import AdminLogs from './pages/admin/Logs'
import AdminSettings from './pages/admin/Settings'
import AdminShutdown from './pages/admin/Shutdown'
import LockedAccounts from './pages/admin/LockedAccounts'

function AppRoutes() {
 const navigate = useNavigate()

 useEffect(() => {
 const handler = (e) => navigate(e.detail.path, { replace: true })
 window.addEventListener('app:redirect', handler)
 return () => window.removeEventListener('app:redirect', handler)
 }, [navigate])

 return (
 <Routes>
 {/* Public */}
 <Route path="/login" element={<Login />} />
 <Route path="/signup" element={<Signup />} />
 <Route path="/signup/teacher" element={<SignupTeacher />} />
 <Route path="/signup/parent" element={<SignupParent />} />
 <Route path="/forgot-password" element={<ForgotPassword />} />
 <Route path="/verify-otp" element={<VerifyOtp />} />
 <Route path="/subscribe" element={<Subscription />} />
 <Route path="/maintenance" element={<Maintenance />} />

 {/* Protected - all wrapped in Layout */}
 <Route element={<PrivateRoute />}>
 <Route element={<Layout />}>
 {/* Student */}
 <Route path="/student/home" element={<StudentHome />} />
 <Route path="/student/videos" element={<StudentVideos />} />
 <Route path="/student/assignments" element={<StudentAssignments />} />
 <Route path="/student/practice/:cardId" element={<StudentPractice />} />
 <Route path="/student/quizzes" element={<StudentQuizzes />} />
 <Route path="/student/badges" element={<StudentBadges />} />
 <Route path="/student/progress" element={<StudentProgress />} />
 <Route path="/student/study-time" element={<StudyTime />} />
 <Route path="/student/stories" element={<Stories />} />
 <Route path="/student/bible-stories" element={<BibleStories />} />
 <Route path="/student/writing" element={<Writing />} />
 <Route path="/student/math-knowledge" element={<MathKnowledge />} />
 <Route path="/student/world-explorer" element={<WorldExplorer />} />
 <Route path="/student/messages" element={<StudentMessages />} />
 <Route path="/student/subscription" element={<StudentSubscription />} />
 <Route path="/student/settings" element={<StudentSettings />} />
 <Route path="/student/notifications" element={<Notifications />} />
 <Route path="/student/leaderboard" element={<Leaderboard />} />
                <Route path="/student/notes" element={<StudentNotes />} />
                <Route path="/student/junior-basics" element={<JuniorBasics />} />
 <Route path="/student/profile" element={<Profile />} />
 {/* Parent */}
 <Route path="/parent/home" element={<ParentHome />} />
 <Route path="/parent/child/:studentId/home" element={<ParentHome />} />
 <Route path="/parent/child/:studentId/progress" element={<ParentProgress />} />
 <Route path="/parent/child/:studentId/messages" element={<ParentMessages />} />
 <Route path="/parent/messages" element={<ParentMessages />} />
 <Route path="/parent/subscription" element={<ParentSubscription />} />
 <Route path="/parent/notifications" element={<ParentNotifications />} />
 <Route path="/guardian/children" element={<GuardianChildren />} />
 <Route path="/guardian/notifications" element={<Notifications />} />
 <Route path="/guardian/payment-history" element={<PaymentHistory />} />
 <Route path="/parent/settings" element={<Profile />} />
 <Route path="/guardian/profile" element={<Profile />} />
 {/* Teacher */}
 <Route path="/teacher/home" element={<TeacherHome />} />
 <Route path="/teacher/upload-video" element={<TeacherUploadVideo />} />
 <Route path="/teacher/create-card" element={<TeacherCreateCard />} />
 <Route path="/teacher/assignments" element={<TeacherAssignments />} />
 <Route path="/teacher/submissions" element={<TeacherSubmissions />} />
 <Route path="/teacher/class-progress" element={<TeacherClassProgress />} />
 <Route path="/teacher/messages" element={<TeacherMessages />} />
 <Route path="/teacher/students" element={<TeacherStudents />} />
 <Route path="/teacher/notifications" element={<Notifications />} />
 <Route path="/teacher/settings" element={<Profile />} />
 <Route path="/teacher/profile" element={<Profile />} /> <Route path="/admin/messages" element={<AdminMessages />} />

 {/* Admin */}
 <Route path="/admin/home" element={<AdminHome />} />
 <Route path="/admin/users" element={<AdminUsers />} />
 <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
 <Route path="/admin/logs" element={<AdminLogs />} />
 <Route path="/admin/system-settings" element={<AdminSettings />} />
 <Route path="/admin/shutdown" element={<AdminShutdown />} />
 <Route path="/admin/payments" element={<AdminPayments />} />
 <Route path="/admin/notifications" element={<Notifications />} />
 <Route path="/admin/locked" element={<LockedAccounts />} />
 <Route path="/admin/profile" element={<Profile />} /> </Route>
 </Route>

 <Route path="/" element={<Navigate to="/login" replace />} />
 <Route path="*" element={<Navigate to="/login" replace />} />
 </Routes>
 )
}

export default function App() {
 return (
 <ThemeProvider>
 <Toaster position="top-right" />
 <AppRoutes />
 </ThemeProvider>
 )
}










