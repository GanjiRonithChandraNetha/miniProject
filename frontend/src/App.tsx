// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/Login';
// import SignUp from './pages/SignUp';
// import Profile from './pages/Profile';
// import Chat from './pages/Chat';
// import Search from './pages/Search';
// import Dashboard from './pages/Dashboard';
// import Layout from './components/Layout';
// //freelancer
// import SeekerDashboard from './pages/freelancer/SeekerDashboard';
// //admin
// import AdminDashboard from './pages/admin/AdminDashboard';
// import ViewDisputes from './pages/admin/ViewDisputes';
// //employer
// import CreateJob from './pages/employer/CreateJob';
// import ViewApplicants from './pages/employer/ViewApplicants';
// import ViewJob from './pages/employer/ViewJob';



// function App() {
//   // Simulated authentication state - replace with actual auth logic
//   const isAuthenticated = false;

//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />
        
//         {/* Protected routes */}
//         <Route element={<Layout />}>
//           <Route 
//             path="/dashboard" 
//             element={true ? <Dashboard /> : <Navigate to="/login" />} 
//           />
//           <Route 
//             path="/profile" 
//             element={true ? <Profile /> : <Navigate to="/login" />} 
//           />
//           <Route 
//             path="/chat" 
//             element={true ? <Chat /> : <Navigate to="/login" />} 
//           />
//           <Route 
//             path="/search" 
//             element={true ? <Search /> : <Navigate to="/login" />} 
//           />
//           <Route path="/" element={<Navigate to="/dashboard" />} />
//           <Route
//             path="/admin"
//             element = {true ?<AdminDashboard/>: <Navigate to="login"/>}
//           />
//           <Route
//             path="/admin/view-disputes"
//             element = {true ?<ViewDisputes/>: <Navigate to="login"/>}
//           />
//           <Route
//             path="/employer/create-job"
//             element = {true ?<CreateJob/>: <Navigate to="login"/>}
//           />
//           <Route
//             path="/employer/viewApplicants"
//             element = {true ?<ViewApplicants/>: <Navigate to="login"/>}
//           />
//           <Route
//             path="/employer/viewJobs"
//             element = {true ?<ViewJob/>: <Navigate to="login"/>}
//           />
//           <Route
//             path="/seakerDash"
//             element = {true ?<SeekerDashboard/>: <Navigate to="login"/>}
//           />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import SeekerDashboard from './pages/freelancer/SeekerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ViewDisputes from './pages/admin/ViewDisputes';
import CreateJob from './pages/employer/CreateJob';
import ViewApplicants from './pages/employer/ViewApplicants';
import ViewJob from './pages/employer/ViewJob';
import ApplyJob from './pages/freelancer/ApplyJob';
import HiringPage from './pages/employer/HiringPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* No authentication checks for testing */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/search" element={<Search />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/view-disputes" element={<ViewDisputes />} />
          <Route path="/employer/create-job" element={<CreateJob />} />
          <Route path="/employer/view-applicants/:jobId" element={<ViewApplicants />} />
          <Route path="/employer/view-jobs" element={<ViewJob />} />
          <Route path="/seeker-dashboard" element={<SeekerDashboard />} />
          <Route path="/applyJob/:jobId" element={<ApplyJob/>}/>
          <Route path="/hire/:jobId" element={<HiringPage/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
