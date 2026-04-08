import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Network, Lock, User } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth(); // Gọi Sức mạnh Xác thực Lõi
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(username, password);
    if(res.success) {
      navigate('/'); // Được Phép Thông Chốt! Bay thẳng vô Dashboard
    } else {
      setError(res.message); // Hệ thống báo động
    }
  }

  return (
    <div className="login-container">
      {/* Vành Cầu Bảo Vệ Hư Ảo */}
      <div className="login-box glass-panel animate-fade-in">
        <div className="login-header flex flex-col items-center justify-center">
           <div className="logo-icon glass-panel flex items-center justify-center mb-4" style={{width:'70px', height:'70px', borderRadius:'16px'}}>
             <Network size={36} color="var(--accent-primary)" />
           </div>
           <h2 className="logo-text text-gradient" style={{fontSize: '2rem'}}>GiaPhả<span>Pro</span></h2>
           <p className="text-muted" style={{marginTop:'0.8rem', textAlign: 'center', letterSpacing:'1px', textTransform:'uppercase', fontSize:'0.85rem'}}>
              Cổng Không Gian Điện Tử Nội Bộ
           </p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && <div className="error-msg">{error}</div>}
          
          <div className="form-group flex flex-col mb-4">
            <span style={{color: 'var(--text-secondary)', fontSize:'0.9rem', marginBottom:'0.5rem', fontWeight:'500'}}>Bí danh / Username định danh</span>
            <div className="input-with-icon">
              <User size={20} className="input-icon"/>
              <input type="text" value={username} onChange={e=>setUsername(e.target.value)} required placeholder="Ví dụ: cuong.pham"/>
            </div>
          </div>
          
          <div className="form-group flex flex-col mb-4">
             <span style={{color: 'var(--text-secondary)', fontSize:'0.9rem', marginBottom:'0.5rem', fontWeight:'500'}}>Khóa Truy Cập (Password)</span>
             <div className="input-with-icon">
              <Lock size={20} className="input-icon"/>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••"/>
             </div>
          </div>

          <button type="submit" className="login-submit-btn"><Lock size={18} style={{marginRight:'8px', display:'inline-block', verticalAlign:'sub'}}/> KÍCH HOẠT HỆ ĐIỀU HÀNH</button>
        </form>
        
        <div className="text-muted flex justify-center" style={{marginTop:'2.5rem', fontSize:'0.85rem', textAlign:'center', borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'1.5rem', lineHeight:'1.5'}}>
           <p>Ghi chú Test App: Nhập <strong className="text-gradient">cuong.pham</strong> để cấp quyền Quản Trị Tổ Tiên.</p>
           <p>Nhập <strong style={{color:'#6ee7b7'}}>van.pham</strong> để lấy quyền Cháu Chắt (Xem/Sửa thẻ bài).</p>
           <p>Mã hóa hệ thống mặc định: <b>123456</b></p>
        </div>
      </div>
    </div>
  )
}
