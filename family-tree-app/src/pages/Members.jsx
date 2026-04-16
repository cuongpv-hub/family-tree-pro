import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getLunarDateString, calculateAgeDifference } from '../utils/dateHelpers';
import LocationSelect from '../components/LocationSelect';
import './Members.css';

export default function Members() {
  const { isAdmin } = useAuth();
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/members`)
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(e => console.error("Database Gãy Mạch", e));
  }, []);

  const [formData, setFormData] = useState({
    fullName: '', gender: 'Male', birthDate: '', deathDate: '', status: 'Alive',
    parentId: '', idCard: '', hometown: '', currentAddress: '', biography: '', avatar: ''
  });
  
  const [createUser, setCreateUser] = useState(false);
  const [accountInfo, setAccountInfo] = useState({ username: '', password: '', role: 'USER' });

  const handleAddMember = async (e) => {
    e.preventDefault();

    // KIỂM TRA LOGIC HUYẾT THỐNG
    if (formData.parentId && formData.birthDate) {
      const parent = members.find(m => String(m.id) === String(formData.parentId));
      if (parent && parent.birthDate) {
        const diff = calculateAgeDifference(parent.birthDate, formData.birthDate);
        if (diff !== null && diff < 15) {
          alert(`[LỖI HUYẾT THỐNG] Khoảng cách tuổi giữa cha/mẹ và con là ${diff.toFixed(1)} năm. Khoảng cách an toàn phải trên 15 năm. Vui lòng kiểm tra lại!`);
          return;
        }
      }
    }

    const newMember = { ...formData, id: 'm_' + Date.now().toString() };
    
    // FETCH POST VÀO DATABASE BACKEND
    const payload = { ...newMember };
    if (createUser) {
      payload.accountDetails = accountInfo;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/members`, {
         method: 'POST', 
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify(payload)
      });
      const data = await res.json();
      if(data.success) {
         setMembers([...members, data.member]);
         
         if (createUser) {
            alert(`Thêm thành viên thành công! Tài khoản đăng nhập đã được khởi tạo: ${accountInfo.username}`);
         } else {
            alert('Thêm thành viên thành công!');
         }
      } else {
         alert("Lỗi: " + data.message);
      }
    } catch(e) { alert("Lỗi hệ thống khi thêm thành viên"); }

    setFormData({
      fullName: '', gender: 'Male', birthDate: '', deathDate: '', status: 'Alive', 
      parentId: '', idCard: '', hometown: '', currentAddress: '', biography: '', avatar: ''
    });
    setCreateUser(false);
    setAccountInfo({ username: '', password: '', role: 'USER' });
  };

  const deleteMember = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      try {
         await fetch(`http://localhost:5000/api/members/${id}`, { method: 'DELETE' });
         setMembers(members.filter(m => m.id !== id));
      } catch(e) {
         alert("Xóa không thành công");
      }
    }
  };

  return (
    <div className="members-container animate-fade-in">
      {/* KHỐI TRÁI: HIỂN THỊ DANH SÁCH */}
      <div className="members-list-card glass-panel">
        <div className="list-header flex justify-between items-center">
          <div>
            <h2 className="text-gradient">Danh sách thành viên</h2>
            <p className="text-muted">Tổng số: {members.length} người</p>
          </div>
          <div className="search-box">
             <Search size={18} color="var(--text-muted)"/>
             <input
               type="text"
               placeholder="Tìm kiếm theo tên..."
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
             />
          </div>
        </div>
        
        <div className="list-content custom-scroll">
          {members
            .filter(m => m.fullName?.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(member => (
            <div key={member.id} className="member-item">
              <div className="member-avatar">
                {member.avatar ? <img src={member.avatar} alt="avatar" style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}}/> : member.fullName.charAt(0)}
              </div>
              <div className="member-info flex-col">
                <h4 style={{fontSize: '1.1rem'}}>{member.fullName}</h4>
                <div className="flex gap-2 text-muted" style={{fontSize: '0.85rem', marginTop: '4px', flexWrap: 'wrap'}}>
                  <span style={{color: member.gender === 'Male' ? '#0071ff' : '#e11d48'}}>{member.gender === 'Male' ? 'Nam' : 'Nữ'}</span>
                  <span>| {member.birthDate ? `${member.birthDate} ${getLunarDateString(member.birthDate)}` : 'Chưa rõ năm'}</span>
                  <span style={{color: member.status === 'Alive' ? '#16a34a' : '#dc2626'}}>| {member.status === 'Alive' ? 'Đang sống' : 'Đã khuất'}</span>
                  {member.status === 'Deceased' && member.deathDate && (
                    <span style={{display: 'inline-block', width: '100%', color: '#94a3b8', marginTop: '2px'}}>Mất: {member.deathDate} <span style={{color: '#64748b'}}>{getLunarDateString(member.deathDate)}</span></span>
                  )}
                </div>
                <p className="text-muted" style={{fontSize: '0.8rem', marginTop: '4px'}}>
                   Quê gốc: {member.hometown || 'Chưa cập nhật'} | Chỗ ở: {member.currentAddress || 'Chưa cập nhật'}
                </p>
              </div>
              {isAdmin && (
                <button onClick={() => deleteMember(member.id)} style={{background:'transparent', border:'none', cursor:'pointer', padding:'0.5rem'}} title="Xóa">
                   <Trash2 size={20} color="#ef4444" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* KHỐI PHẢI: FORM THÊM MỚI */}
      <div className="member-form-card glass-panel">
        <div className="form-header flex items-center gap-2">
           <UserPlus size={24} color="var(--accent-primary)" />
           <h2 className="text-gradient">Thêm Mới Thành Viên</h2>
        </div>

        <form className="member-form" onSubmit={handleAddMember}>
          <div className="form-row">
            <div className="form-group">
              <label>Họ và tên</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="form-control" placeholder="Trần Văn A" required />
            </div>
            <div className="form-group">
              <label>Quan hệ (Con của ai)</label>
              <select name="parentId" value={formData.parentId} onChange={(e) => setFormData({...formData, parentId: e.target.value})} className="form-control">
                <option value="">[Không có / Vị trí Gốc]</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.fullName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ngày Sinh</label>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} className="form-control" />
              {formData.birthDate && <small style={{color: 'var(--accent-primary)', marginTop: '4px', display: 'block'}}>{getLunarDateString(formData.birthDate)}</small>}
            </div>
            <div className="form-group">
              <label>Sổ CCCD / CMND</label>
              <input type="text" name="idCard" value={formData.idCard} onChange={(e) => setFormData({...formData, idCard: e.target.value})} className="form-control" placeholder="Nhập số CCCD..." />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tình trạng</label>
              <select name="status" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="form-control">
                <option value="Alive">Đang sống</option>
                <option value="Deceased">Đã mất</option>
              </select>
            </div>
            {formData.status === 'Deceased' && (
              <div className="form-group">
                <label>Ngày Mất</label>
                <input type="date" name="deathDate" value={formData.deathDate} onChange={(e) => setFormData({...formData, deathDate: e.target.value})} className="form-control" />
                {formData.deathDate && <small style={{color: 'var(--text-muted)', marginTop: '4px', display: 'block'}}>{getLunarDateString(formData.deathDate)}</small>}
              </div>
            )}
            <div className="form-group">
              <label>Giới tính</label>
              <select name="gender" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="form-control">
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <LocationSelect 
              label="Quê quán" 
              value={formData.hometown}
              onChange={(val) => setFormData({...formData, hometown: val})}
            />
          </div>
          <div className="form-group">
            <LocationSelect 
              label="Chỗ ở hiện tại" 
              value={formData.currentAddress}
              onChange={(val) => setFormData({...formData, currentAddress: val})}
            />
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500, color: 'var(--text-primary)' }}>
              <input type="checkbox" checked={createUser} onChange={(e) => setCreateUser(e.target.checked)} style={{ width: '18px', height: '18px' }} />
              Tạo tài khoản đăng nhập cho Thành viên này
            </label>

            {createUser && (
              <div className="form-row" style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label>Tên đăng nhập</label>
                  <input type="text" className="form-control" placeholder="vd: nguyen.a" value={accountInfo.username} onChange={(e) => setAccountInfo({...accountInfo, username: e.target.value})} required={createUser} />
                </div>
                <div className="form-group">
                  <label>Mật khẩu</label>
                  <input type="text" className="form-control" placeholder="Tối thiểu 6 ký tự" value={accountInfo.password} onChange={(e) => setAccountInfo({...accountInfo, password: e.target.value})} required={createUser} />
                </div>
                <div className="form-group" style={{ flex: 0.5 }}>
                  <label>Quyền hạn</label>
                  <select className="form-control" value={accountInfo.role} onChange={(e) => setAccountInfo({...accountInfo, role: e.target.value})}>
                    <option value="USER">Thành viên</option>
                    <option value="ADMIN">Quản trị (Admin)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="save-btn font-medium w-full mt-4">Thêm Thành Viên</button>
        </form>
      </div>
    </div>
  );
}
