import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import JobDetails from "./pages/JobDetails";
import JobForm from "./pages/JobForm";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar"; 
import "./App.css";

function App() {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  return (
    <Router>
      {isAuthenticated && <Navbar />}

      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/job/:id"
          element={isAuthenticated ? <JobDetails /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/job/create"
          element={isAuthenticated ? <JobForm /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
