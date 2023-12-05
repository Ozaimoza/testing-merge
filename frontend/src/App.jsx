// App.jsx
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import AdminRouter from './routers/AdminRouter';
import UserRouter from './routers/UserRouter';
// import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute default atau rute awal */}
        <Route
          path="/"
          element={<Navigate to="/admin/login" />}
        />
        <Route path="/admin/*" element={<AdminRouter />} />
        <Route path="/user/*" element={<UserRouter />} />
      </Routes>
    </Router>
  );
}

export default App;
