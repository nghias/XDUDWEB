import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/user/Home';
function App() {
  return (
    <Router>
      <Routes>
              {/* Định nghĩa trang của Nghĩa tại "/user" */}
      <Route path="/" element={<Navigate to="/user" />} />
      <Route path="/user" element={<Home />} />
       
      </Routes>
    </Router>
  );
}

export default App;