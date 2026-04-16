import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Tree from './pages/Tree';
import Login from './pages/Login';
import UserAdmin from './pages/UserAdmin';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Funds from './pages/Funds';
import News from './pages/News';
import './App.css';

// Tường Thành Lắp Ghép: Bảo Vệ Không Cho Kẻ Xâm Nhập Không Hợp Pháp Đi Lướt Dây Mạng
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    // Ăn Trộm! Trục Xuất Bay Về Màn Hình Login Lập Tức
    return <Navigate to="/login" replace />;
  }
  // Vượt Qua Bài Test Thì Khai Mở Giao Diện Sidebar + Content
  return (
    <div className="app-container flex">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Cổng Public ai cũng vào được */}
          <Route path="/login" element={<Login />} />
          
          {/* Vùng Zone Kín của Dòng Họ - Bắt buộc Đưa Thẻ Thành Viên! */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
          <Route path="/tree" element={<ProtectedRoute><Tree /></ProtectedRoute>} />
          <Route path="/gallery" element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
          <Route path="/funds" element={<ProtectedRoute><Funds /></ProtectedRoute>} />
          <Route path="/admin-users" element={<ProtectedRoute><UserAdmin /></ProtectedRoute>} />
          
          {/* Rác dạt đánh dạt về nhà */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
