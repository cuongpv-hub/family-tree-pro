import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Network, Calendar, Settings, LogOut, ShieldAlert, UserCog } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth(); // Nội Tiếp Sợi Dây Mật Thư Auth
  
  const menuItems = [
    { name: 'Tổng quan', path: '/', icon: <Home size={20} /> },
    { name: 'Thành viên', path: '/members', icon: <Users size={20} /> },
    { name: 'Khảo sát Gia phả', path: '/tree', icon: <Network size={20} /> },
    { name: 'Sự kiện Truyền thống', path: '/events', icon: <Calendar size={20} /> },
    { name: 'Tùy chỉnh Hệ thống', path: '/settings', icon: <Settings size={20} /> },
  ];

  if (isAdmin) {
    menuItems.push({ name: 'Quản Lý Quyền Acc', path: '/admin-users', icon: <UserCog size={20} color="#fca5a5" /> });
  }

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-icon glass-panel flex items-center justify-center">
           <Network size={24} color="var(--accent-primary)" />
        </div>
        <h2 className="logo-text text-gradient">GiaPhả<span>Pro</span></h2>
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
        {/* LƯỢI GIỚI THIỆU KHÁCH KHỨA ROLE USER */}
        <div className="flex-col gap-2" style={{marginBottom:'1rem', padding:'1rem', background:'rgba(0,0,0,0.2)', borderRadius:'var(--radius-sm)'}}>
          <span style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>Giám Sát Viên:</span>
          <div className="flex items-center gap-2">
            <strong className="text-gradient" style={{fontSize:'1.1rem'}}>{user?.username}</strong>
            {isAdmin && <ShieldAlert size={14} color="#f59e0b" title="Quyền Lập Pháp Thượng Cổ" />}
          </div>
          <span style={{fontSize:'0.75rem', padding:'2px 8px', background: isAdmin ? 'rgba(245, 158, 11, 0.1)' : 'rgba(99, 102, 241, 0.1)', color: isAdmin ? '#f59e0b' : '#8b5cf6', borderRadius:'12px', width:'max-content'}}>
            Module: {user?.role}
          </span>
        </div>

        {/* Nút Phân Lý Kết Nối Logout */}
        <button className="logout-btn" onClick={logout}>
          <LogOut size={20} />
          <span>Ngắt Kết Nối Nguồn</span>
        </button>
      </div>
    </aside>
  );
}
