import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { checkAuth } from './store/slices/authSlice'
import Layout from './components/common/Layout'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import AdminDashboard from './pages/AdminDashboard'
import SalesDashboard from './pages/SalesDashboard'
import TrainerDashboard from './pages/TrainerDashboard'
import StudentDashboard from './pages/StudentDashboard'
import StudentList from './components/students/StudentList'
import StudentForm from './components/students/StudentForm'
import StudentDetail from './components/students/StudentDetail'
import CourseList from './components/courses/CourseList'
import CourseForm from './components/courses/CourseForm'
import CourseDetail from './components/courses/CourseDetail'
import AttendanceList from './components/attendance/AttendanceList'
import AttendanceForm from './components/attendance/AttendanceForm'
import FeeList from './components/fees/FeeList'
import FeeForm from './components/fees/FeeForm'
import PaymentForm from './components/fees/PaymentForm'
import UserList from './components/users/UserList'
import UserForm from './components/users/UserForm'
import Profile from './components/users/Profile'
import NotFound from './pages/NotFound'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
         
            {/* Super Admin Routes */}
            
              <Route path="/super-admin" element={<SuperAdminDashboard />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/users/new" element={<UserForm />} />
              <Route path="/users/:id" element={<UserForm />} />
              <Route path='/trainers' element={<UserList role="trainer" />} />
              <Route path='/trainers/new' element={<UserForm role="trainer" />} />
              <Route path='/trainers/:id' element={<UserForm role="trainer" />} />
              <Route path="/students" element={<StudentList />} />
              <Route path="/students/new" element={<StudentForm />} />
              <Route path="/students/:id" element={<StudentDetail />} />
              <Route path="/attendance" element={<AttendanceList />} />
              <Route path="/attendance/new" element={<AttendanceForm />} />
              <Route path="/attendance/bulk" element={<AttendanceForm bulk />} />
              <Route path="/fees" element={<FeeList />} />
              <Route path="/fees/new" element={<FeeForm />} />
              <Route path="/fees/:id/pay" element={<PaymentForm />} />
              <Route path="/courses" element={<CourseList />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/courses" element={<CourseList />} />
              <Route path="/courses/new" element={<CourseForm />} />
              <Route path="/courses/:id" element={<CourseForm />} />
            
            {/* Sales Person Routes */}
              <Route path="/sales" element={<SalesDashboard />} />
              <Route path="/students" element={<StudentList />} />
              <Route path="/students/new" element={<StudentForm />} />
              <Route path="/students/:id" element={<StudentDetail />} />
              <Route path="/fees" element={<FeeList />} />
              <Route path="/fees/new" element={<FeeForm />} />
              <Route path="/fees/:id/pay" element={<PaymentForm />} />
            
            {/* Trainer Routes */}
              <Route path="/trainer" element={<TrainerDashboard />} />
              <Route path="/attendance" element={<AttendanceList />} />
              <Route path="/attendance/new" element={<AttendanceForm />} />
              <Route path="/attendance/bulk" element={<AttendanceForm bulk />} />
            
            {/* Student Routes */}
              
              <Route path="/profile" element={<Profile />} />
          </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
  )
}

export default App;