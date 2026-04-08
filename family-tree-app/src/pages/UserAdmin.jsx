import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserMinus, UserPlus, Key, Edit, ShieldAlert } from 'lucide-react';
import './Members.css'; 

export default function UserAdmin() {
  const { user, isAdmin, usersDb, systemAddUser, systemEditUser, systemDeleteUser } = useAuth();
  
  if (!isAdmin) {
    return (
       <div style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0f', zIndex:50 }}>
           <h1 style={{color:'#ef4444', fontWeight:'bold'}}>LỖI 403: CẢNH BÁO. BẠN KHÔNG CÓ THẨM QUYỀN ĐỂ ĐỨNG Ở TẦNG KHÔNG GIAN NÀY!</h1>
       </div>
    );
  }

  const [formData, setFormData] = useState({ id: '', username: '', password: '', role: 'USER' });
  const [mode, setMode] = useState('ADD');

  const handleEditClick = (u) => {
    setMode('EDIT');
    setFormData({ id: u.id, username: u.username, password: u.password, role: u.role });
  }

  const handleCancel = () => {
    setMode('ADD');
    setFormData({ id: '', username: '', password: '', role: 'USER' });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.username || !formData.password) return alert('Điều Hành Viên: Không được bỏ sót dòng nào!');
    
    if (mode === 'ADD') {
      const resp = await systemAddUser({ username: formData.username, password: formData.password, role: formData.role });
      if(!resp.success) alert(resp.message);
      else handleCancel();
    } else {
      await systemEditUser(formData.id, { username: formData.username, password: formData.password, role: formData.role });
      handleCancel();
    }
  }

  const handleDelete = async (u) => {
    if (u.id === user.id) {
       alert("Lực Phản Chấn Thuật Logic: BẠN KHÔNG THỂ XÓA MẠNG MÌNH. HỆ THỐNG SẼ TỪ TRỐI CÚ KÍCH ĐIỆN NÀY ĐỂ BẢO TOÀN TRÁI ĐẤT!");
       return;
    }
    if (window.confirm(`Dán Lệnh Tử Trảm? Bạn có chắn chắn bẻ Cổ Kết Nối Của [${u.username}] mãi mãi khỏi Gia Phả?`)) {
       await systemDeleteUser(u.id);
    }
  }

  return (
    <div className="members-container animate-fade-in" style={{ gridTemplateColumns: 'minmax(0, 1.5fr) 420px' }}>
      
      {/* VÙNG TRANH NIỆM DANH SÁCH BÊN TRÁI */}
      <div className="members-list-card glass-panel" style={{border: '1px solid rgba(239, 68, 68, 0.3)', boxShadow: '0 0 30px rgba(239, 68, 68, 0.05)'}}>
        <div className="list-header flex justify-between items-center" style={{ borderBottomColor: 'rgba(239, 68, 68, 0.2)'}}>
          <div>
            <h2 className="text-gradient flex items-center gap-2" style={{backgroundImage: 'linear-gradient(135deg, #ef4444, #f59e0b)'}}><ShieldCheck size={26} /> Tổng Tham Mưu Trưởng Quyền Lực</h2>
            <p className="text-muted">Tổng dân số Server (Gồm thẻ Vô vi): {usersDb.length} Nhân Sự</p>
          </div>
        </div>
        
        <div className="list-content custom-scroll" style={{marginTop:'1rem'}}>
          {usersDb.map(u => {
            const isMe = u.id === user.id;
            const isAdminTag = u.role === 'ADMIN';

            return (
              <div key={u.id} className="member-item" style={{ borderLeft: isAdminTag ? '3px solid #ef4444' : '3px solid #8b5cf6', opacity: isMe ? 1 : 0.8, backgroundColor: isMe ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)' }}>
                <div className="member-avatar" style={{ background: isAdminTag ? 'rgba(239,68,68,0.2)' : 'rgba(139,92,246,0.2)', color: isAdminTag ? '#ef4444' : '#8b5cf6', borderColor: 'transparent', width:'45px', height:'45px', fontSize:'1rem', boxShadow: 'none' }}>
                  <UserPlus size={20} />
                </div>
                
                <div className="member-info flex-col">
                  <h4 style={{fontSize:'1.05rem', color: isMe ? '#6ee7b7' : 'white'}}>
                     {u.username} {isMe && <span style={{fontSize:'0.65rem', background: 'linear-gradient(45deg, #10b981, #059669)', color:'#fff', padding:'2px 6px', borderRadius:'10px', marginLeft:'6px', letterSpacing:'0.5px'}}>THIS IS YOU</span>}
                  </h4>
                  <div className="flex gap-2" style={{marginTop:'4px'}}>
                    <span style={{ fontSize:'0.75rem', padding:'2px 8px', borderRadius:'6px', background: isAdminTag ? 'rgba(239, 68, 68, 0.15)' : 'rgba(139, 92, 246, 0.15)', color: isAdminTag ? '#fca5a5' : '#c4b5fd', fontWeight:'bold' }}>
                      MODE: {u.role}
                    </span>
                    <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:'4px' }}>
                      <Key size={12}/> Pass: *** {u.password.substring(u.password.length - 3)}
                    </span>
                  </div>
                </div>

                {/* HÀNH ĐỘNG SINH SÁT CSS */}
                <div className="flex gap-2" style={{marginLeft:'auto'}}>
                   <button onClick={() => handleEditClick(u)} style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer', padding:'0.6rem', borderRadius:'8px', color:'#9ca3af', transition:'all 0.2s'}} 
                           onMouseOver={e => {e.currentTarget.style.background='#6366f1'; e.currentTarget.style.color='white'}}
                           onMouseOut={e => {e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#9ca3af'}}
                           title="Thay Ổ Khóa Pass Mới">
                      <Edit size={16} />
                   </button>
                   
                   <button onClick={() => handleDelete(u)} 
                           disabled={isMe}
                           style={{background: isMe ? 'transparent' : 'rgba(239,68,68,0.1)', border: isMe ? '1px dashed rgba(255,255,255,0.1)' : '1px solid rgba(239,68,68,0.2)', cursor: isMe ? 'not-allowed' : 'pointer', padding:'0.6rem', borderRadius:'8px', color: isMe ? '#4b5563' : '#ef4444', transition:'all 0.2s', opacity: isMe ? 0.3 : 1}} 
                           onMouseOver={e => {if(!isMe){ e.currentTarget.style.background='#ef4444'; e.currentTarget.style.color='white'}}}
                           onMouseOut={e => {if(!isMe){ e.currentTarget.style.background='rgba(239,68,68,0.1)'; e.currentTarget.style.color='#ef4444'}}}
                           title={isMe ? "Giới luật Bất Tự Sát!" : "Gạt Cầu Dao Vĩnh Viễn User"}>
                      <UserMinus size={16} />
                   </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CỘT QUYỀN NĂNG BÊN PHẢI (MÁY CHẾ TẠO ID MỚI) */}
      <div className="member-form-card glass-panel" style={{background: 'rgba(10, 10, 15, 0.95)', borderTop: '2px solid rgba(239, 68, 68, 0.4)'}}>
        <div className="form-header flex items-center gap-3" style={{borderBottom:'1px solid rgba(255,255,255,0.05)', paddingBottom:'1.5rem'}}>
           <div style={{background:'rgba(239,68,68,0.1)', padding:'10px', borderRadius:'12px'}}><ShieldAlert size={28} color="#ef4444" /></div>
           <div>
             <h2 style={{color:'#fca5a5', fontSize:'1.2rem'}}>{mode === 'ADD' ? 'Khởi Tạo Khắc Dấu ID' : 'Ghi Đính Chính File Gốc'}</h2>
             <p className="text-muted" style={{fontSize:'0.8rem', marginTop:'4px'}}>Kho Báu Phòng Máy Trung Tâm</p>
           </div>
        </div>

        <form className="member-form" onSubmit={handleSubmit} style={{marginTop:'1.5rem', paddingRight:0}}>
          
          <div className="form-group" style={{marginBottom:'1rem'}}>
            <label style={{color: mode==='EDIT' ? 'var(--text-muted)' : 'var(--text-primary)'}}>Bí Danh Ảo (Username)</label>
            <input type="text" name="username" value={formData.username} 
                   onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '')})} 
                   className="form-control" readOnly={mode==='EDIT'} 
                   style={{ cursor: mode==='EDIT' ? 'not-allowed' : 'text', opacity: mode==='EDIT'? 0.5:1 }} 
                   placeholder="Nhập tên dính liền (tuan.hai)" />
            {mode === 'EDIT' && <span style={{fontSize:'0.75rem', color:'#ef4444', fontStyle:'italic'}}>Nền tảng cấm Cải Đổi Nhãn Mác Gốc. Khóa vĩnh viễn tên này.</span>}
          </div>

          <div className="form-group" style={{marginBottom:'1.5rem'}}>
            <label>Mã Kim Loại Cửa Máy Chấn (Password)</label>
            <input type="text" name="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="form-control" placeholder="Tự gõ ngẫu nhiên dãy mã" />
          </div>

          <div className="form-group" style={{background:'rgba(255,255,255,0.02)', padding:'1rem', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.05)'}}>
            <label style={{marginBottom:'1rem', display:'block', color:'#fca5a5'}}>Trao Chìa Khóa Phân Cấp Thần Quyền</label>
            <select name="role" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="form-control" style={{ borderLeft: formData.role === 'ADMIN' ? '4px solid #ef4444' : '4px solid #8b5cf6', background:'rgba(0,0,0,0.5)' }}>
              <option value="USER">Công Nhân Đoàn (Chỉ Cho Phép Sửa/Xem Cây)</option>
              <option value="ADMIN">Thiên Đạo Bạo Chúa (Xóa Sạch - Cầm Đầu Tổng Bộ)</option>
            </select>
          </div>

          <div className="flex gap-4" style={{marginTop:'auto', paddingTop:'2rem'}}>
             {mode === 'EDIT' && <button type="button" onClick={handleCancel} className="cancel-btn font-medium w-full" style={{flex: 1, padding:'1rem', background:'transparent', border:'1px solid rgba(255,255,255,0.1)', color:'white', borderRadius:'8px', cursor:'pointer'}}>Khước Từ Lệnh</button>}
             
             <button type="submit" className="save-btn font-medium w-full" style={{flex: mode==='EDIT'? 1.5 : 1, padding:'1rem', background: mode === 'EDIT' ? '#f59e0b' : 'linear-gradient(135deg, #ef4444, #b91c1c)', border:'none', color:'white', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', boxShadow:'0 4px 15px rgba(239, 68, 68, 0.3)'}}>
                {mode === 'ADD' ? '+ Ban Phát Cấp Phép 1 Mã Thẻ' : '✔ Trữ Lưu Mật Thư'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
