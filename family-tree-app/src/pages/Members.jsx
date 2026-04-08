import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Members.css';

export default function Members() {
  const { isAdmin } = useAuth();
  
  // NẠP LINH KHÍ ĐỘNG: API JSON Data
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/members')
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(e => console.error("Database Gãy Mạch", e));
  }, []);

  const [formData, setFormData] = useState({
    fullName: '', gender: 'Male', birthDate: '', status: 'Alive',
    parentId: '', idCard: '', hometown: '', currentAddress: '', biography: '', avatar: ''
  });

  const handleAddMember = async (e) => {
    e.preventDefault();
    const newMember = { ...formData, id: 'm_' + Date.now().toString() };
    
    // FETCH POST VÀO DATABASE BACKEND
    try {
      const res = await fetch('http://localhost:5000/api/members', {
         method: 'POST', 
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify(newMember)
      });
      const data = await res.json();
      if(data.success) {
         setMembers([...members, data.member]);
      }
    } catch(e) { alert("Core Server Bất Lực"); }

    setFormData({
      fullName: '', gender: 'Male', birthDate: '', status: 'Alive', 
      parentId: '', idCard: '', hometown: '', currentAddress: '', biography: '', avatar: ''
    });
  };

  const deleteMember = async (id) => {
    if (window.confirm('Cảnh Báo: Hủy bỏ tư cách của người này trong Gia phả mãi mãi?')) {
      try {
         await fetch(`http://localhost:5000/api/members/${id}`, { method: 'DELETE' });
         setMembers(members.filter(m => m.id !== id));
      } catch(e) {
         alert("Xóa không thành công, Trạm Ngầm Gặp Sự Cố");
      }
    }
  };

  return (
    <div className="members-container animate-fade-in">
      {/* KHỐI TRÁI: HIỂN THỊ DANH SÁCH */}
      <div className="members-list-card glass-panel">
        <div className="list-header flex justify-between items-center">
          <div>
            <h2 className="text-gradient">Danh Mục Đời Hệ</h2>
            <p className="text-muted">Đang theo dõi {members.length} người</p>
          </div>
          <div className="search-box">
             <Search size={18} color="var(--text-muted)"/>
             <input type="text" placeholder="Thấu kính Truy Hồn..." />
          </div>
        </div>
        
        <div className="list-content custom-scroll">
          {members.map(member => (
            <div key={member.id} className="member-item">
              <div className="member-avatar">
                {member.avatar ? <img src={member.avatar} alt="avatar" style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}}/> : member.fullName.charAt(0)}
              </div>
              <div className="member-info flex-col">
                <h4 style={{fontSize: '1.1rem'}}>{member.fullName}</h4>
                <div className="flex gap-2 text-muted" style={{fontSize: '0.8.5rem', marginTop: '4px'}}>
                  <span style={{color: member.gender === 'Male' ? '#93c5fd' : '#fbcfe8'}}>{member.gender === 'Male' ? 'Nam Nhân' : 'Nữ Vương'}</span>
                  <span>| {member.birthDate || 'Chưa rõ năm'}</span>
                  <span style={{color: member.status === 'Alive' ? '#6ee7b7' : '#fca5a5'}}>| {member.status === 'Alive' ? 'Đang sống' : 'Đã khuất'}</span>
                </div>
                <p className="text-muted" style={{fontSize: '0.8rem', marginTop: '4px'}}>
                   Quê gốc: {member.hometown || 'Chưa cập nhật'} | Chỗ ở: {member.currentAddress || 'Chưa cập nhật'}
                </p>
              </div>
              {isAdmin && (
                <button onClick={() => deleteMember(member.id)} style={{background:'transparent', border:'none', cursor:'pointer', padding:'0.5rem'}} title="Loại Bỏ">
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
           <h2 className="text-gradient">Chạm Cột Khai Sinh Cây</h2>
        </div>

        <form className="member-form" onSubmit={handleAddMember}>
          <div className="form-row">
            <div className="form-group">
              <label>Tên Điển (Họ Tên Cúng Cơm)</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="form-control" placeholder="Trần Văn A" required />
            </div>
            <div className="form-group">
              <label>Dây Máu (Nối vào Cụ/Ông/Cha nào)</label>
              <select name="parentId" value={formData.parentId} onChange={(e) => setFormData({...formData, parentId: e.target.value})} className="form-control">
                <option value="">[Khởi Tạo Tổ Tiên]</option>
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
            </div>
            <div className="form-group">
              <label>CCCD / Định Danh</label>
              <input type="text" name="idCard" value={formData.idCard} onChange={(e) => setFormData({...formData, idCard: e.target.value})} className="form-control" placeholder="0010..." />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Mệnh Số</label>
              <select name="status" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="form-control">
                <option value="Alive">Vẫn Đang Bán Mạng Sống Nhiệt</option>
                <option value="Deceased">Đã Phi Thăng Tiên Giới</option>
              </select>
            </div>
            <div className="form-group">
              <label>Giới Tính</label>
              <select name="gender" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="form-control">
                <option value="Male">Ngạo Cốt (Nam)</option>
                <option value="Female">Nhu Tình (Nữ)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Nơi Chôn Rau / Quê Quán</label>
            <input type="text" name="hometown" value={formData.hometown} onChange={(e) => setFormData({...formData, hometown: e.target.value})} className="form-control" />
          </div>

          <button type="submit" className="save-btn font-medium w-full mt-4">Pha Trộn Sinh Mệnh -{'>'} Đẩy Lên Khung Cây</button>
        </form>
      </div>
    </div>
  );
}
