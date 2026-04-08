import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Calendar, Activity, Ghost } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const [members, setMembers] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/members')
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(err => console.error("Database connection lost:", err));
  }, []);

  const totalMembers = members.length;
  const aliveMembers = members.filter(m => m.status === 'Alive').length;
  const deceasedMembers = members.filter(m => m.status === 'Deceased').length;
  const maleMembers = members.filter(m => m.gender === 'Male').length;

  const stats = [
    { title: 'Tổng Nhân Khẩu (Gốc)', value: totalMembers, icon: <Users size={24} color="#6366f1" />, trend: 'Ghi danh trên Server CSQL' },
    { title: 'Số Mệnh Vẫn Tiếp Diễn', value: aliveMembers, icon: <Activity size={24} color="#10b981" />, trend: 'Đang Giao Tranh Sự Sống' },
    { title: 'Tiền Nhân Nghĩa Trủng', value: deceasedMembers, icon: <Ghost size={24} color="#fca5a5" />, trend: 'Theo Thời Gian Cát Bụi' },
    { title: 'Ngạo Khí (Nam Nhân)', value: maleMembers, icon: <UserPlus size={24} color="#69b4ff" />, trend: 'Trường Tồn Rường Cột' },
  ];

  return (
    <div className="dashboard animate-fade-in">
      <header className="dashboard-header flex justify-between items-center">
        <div>
          <h1 className="text-gradient">Tổng quan Dòng họ</h1>
          <p className="text-muted">Chào mừng trưởng họ quay trở lại. Đây là tình hình hiện tại.</p>
        </div>
        
        <div className="user-profile flex items-center gap-4">
          <div className="search-bar glass-panel flex items-center">
             <input type="text" placeholder="Tìm kiếm thành viên..." />
          </div>
          <div className="avatar glass-panel">
            <Users size={20}/>
          </div>
        </div>
      </header>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card glass-panel flex-col gap-2">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-muted">{stat.title}</h3>
              <div className="icon-wrapper glass-panel">
                {stat.icon}
              </div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-trend text-gradient">{stat.trend}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-content grid">
        <div className="recent-activity glass-panel flex-col">
          <h2 className="mb-4">Hoạt động tiếp theo</h2>
          <div className="activity-list flex-col gap-4">
             {members.length === 0 ? <p className="text-muted">Chưa có giao dịch Dữ Liệu Tín Hiện Nào Truyền Tới</p> : null}
             {[...members].reverse().slice(0, 4).map((m, idx) => (
               <div key={idx} className="activity-item flex items-center gap-4 animate-fade-in" style={{animationDelay: `${idx*0.1}s`}}>
                 <div className="dot" style={{backgroundColor: idx % 2 === 0 ? '#10b981' : '#6366f1'}}></div>
                 <div>Đã tải thành công Luồng Đứt Gãy Mã Máu của Nhánh: <b className="text-gradient hover:opacity-80 transition">{m.fullName}</b> từ File DB</div>
                 <div className="text-muted ml-auto text-sm">System Fetch Async</div>
               </div>
             ))}
          </div>
        </div>

        <div className="upcoming-birthdays glass-panel flex-col items-center justify-center p-8">
           <h2 className="mb-4 w-full">Sự kiện đến gần</h2>
           <div className="empty-state text-muted flex-col items-center justify-center w-full h-full gap-4 pt-8">
              <Calendar size={48} opacity={0.5} />
              <p>Chưa có sự kiện nào gần đây</p>
           </div>
        </div>
      </div>
    </div>
  );
}
