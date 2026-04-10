import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Network, Calendar, LogOut, ShieldAlert, UserCog, Image, Wallet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  
  const baseMenu = [
    { name: 'Tổng quan', path: '/', icon: <Home size={20} /> },
    { name: 'Thành viên', path: '/members', icon: <Users size={20} /> },
    { name: 'Sơ đồ gia phả', path: '/tree', icon: <Network size={20} /> },
    { name: 'Thư viện ảnh', path: '/gallery', icon: <Image size={20} /> },
    { name: 'Lịch sự kiện', path: '/events', icon: <Calendar size={20} /> },
    { name: 'Tài chính quỹ', path: '/funds', icon: <Wallet size={20} /> },
  ];

  const adminMenu = isAdmin ? [
    { name: 'Quản lý tài khoản', path: '/admin-users', icon: <UserCog size={20} color="#fca5a5" /> }
  ] : [];

  const menuItems = [...baseMenu, ...adminMenu];

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-icon glass-panel flex items-center justify-center" style={{padding: '4px', overflow: 'hidden'}}>
           <img src="/logo.png" alt="Phạm Gia" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}} />
        </div>
        <h2 className="logo-text text-gradient">Gia phả <span>Họ Phạm</span></h2>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link to={item.path} className={`nav-link ${isActive ? 'active' : ''}`}>
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        {/* Thông tin tài khoản */}
        <div className="flex-col gap-2" style={{marginBottom:'1rem', padding:'1rem', background:'var(--bg-primary)', borderRadius:'var(--radius-sm)', border: '1px solid var(--border-color)'}}>
          <span style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>Người dùng:</span>
          <div className="flex items-center gap-2">
            <strong className="text-gradient" style={{fontSize:'1.1rem'}}>{user?.username}</strong>
            {isAdmin && <ShieldAlert size={14} color="#f59e0b" title="Quản trị viên" />}
          </div>
          <span style={{fontSize:'0.75rem', padding:'2px 8px', background: isAdmin ? 'rgba(245, 158, 11, 0.1)' : 'rgba(99, 102, 241, 0.1)', color: isAdmin ? '#f59e0b' : '#8b5cf6', borderRadius:'12px', width:'max-content'}}>
            Vai trò: {user?.role}
          </span>
        </div>

        {/* Nút Đăng xuất */}
        <button className="logout-btn" onClick={logout}>
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
