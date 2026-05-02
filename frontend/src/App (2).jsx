import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/layout/Layout'
import PrivateRoute from './components/common/PrivateRoute'

// Auth
import Login from './pages/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import SignupTeacher from './pages/auth/SignupTeacher'
import SignupParent from './pages/auth/SignupParent'
import VerifyOtp from './pages/auth/VerifyOtp'
import Subscription from './pages/Subscription'
import Maintenance from './pages/Maintenance'

// Student
import StudentHome from './pages/student/Home'
import StudentVideos from './pages/student/Videos'
import StudentAssignments from './pages/student/Assignments'
import StudentPractice from './pages/student/Practice'
import StudentQuizzes from './pages/student/Quizzes'
import StudentBadges from './pages/student/Badges'
import StudentProgress from './pages/student/Progress'
import StudyTime from './pages/student/StudyTime'
import StudentMessages from './pages/student/Messages'

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

// Admin
import AdminHome from './pages/admin/Home'
import AdminUsers from './pages/admin/Users'
import AdminSubscriptions from './pages/admin/Subscriptions'
import AdminLogs from './pages/admin/Logs'
import AdminSettings from './pages/admin/Settings'
import AdminShutdown from './pages/admin/Shutdown'

export default function App() {
 return (
 <ThemeProvider>
 <Toaster position="top-right" />
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
 <Route path="/student/messages" element={<StudentMessages />} />

 {/* Parent */}
 <Route path="/parent/home" element={<ParentHome />} />
 <Route path="/parent/child/:studentId/home" element={<ParentHome />} />
 <Route path="/parent/child/:studentId/progress" element={<ParentProgress />} />
 <Route path="/parent/child/:studentId/messages" element={<ParentMessages />} />
 <Route path="/parent/messages" element={<ParentMessages />} />
 <Route path="/parent/subscription" element={<ParentSubscription />} />
 <Route path="/parent/notifications" element={<ParentNotifications />} />

 {/* Teacher */}
 <Route path="/teacher/home" element={<TeacherHome />} />
 <Route path="/teacher/upload-video" element={<TeacherUploadVideo />} />
 <Route path="/teacher/create-card" element={<TeacherCreateCard />} />
 <Route path="/teacher/assignments" element={<TeacherAssignments />} />
 <Route path="/teacher/submissions" element={<TeacherSubmissions />} />
 <Route path="/teacher/class-progress" element={<TeacherClassProgress />} />
 <Route path="/teacher/messages" element={<TeacherMessages />} />

 {/* Admin */}
 <Route path="/admin/home" element={<AdminHome />} />
 <Route path="/admin/users" element={<AdminUsers />} />
 <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
 <Route path="/admin/logs" element={<AdminLogs />} />
 <Route path="/admin/system-settings" element={<AdminSettings />} />
 <Route path="/admin/shutdown" element={<AdminShutdown />} />
 </Route>
 </Route>

 <Route path="/" element={<Navigate to="/login" replace />} />
 <Route path="*" element={<Navigate to="/login" replace />} />
 </Routes>
 </ThemeProvider>
 )
}
