import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Users from './Users';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/users" />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  );
}

export default App;