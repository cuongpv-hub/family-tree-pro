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
    { title: 'Tổng Nhân Khẩu', value: totalMembers, icon: <Users size={24} color="#0071ff" />, trend: 'Trên hệ thống gốc' },
    { title: 'Đang sinh sống', value: aliveMembers, icon: <Activity size={24} color="#16a34a" />, trend: 'Phát triển bền vững' },
    { title: 'Đã khuất', value: deceasedMembers, icon: <Ghost size={24} color="#e11d48" />, trend: 'Lưu danh muôn đời' },
    { title: 'Nam nhân', value: maleMembers, icon: <UserPlus size={24} color="#0071ff" />, trend: 'Con số tham khảo' },
  ];

  return (
    <div className="dashboard animate-fade-in">
      <header className="dashboard-header flex justify-between items-center">
        <div>
          <h1>Tổng Quan Gia Phả</h1>
          <p className="text-muted" style={{fontSize: '0.95rem'}}>Cập nhật thông tin và tình hình dòng họ mới nhất.</p>
        </div>
        
        <div className="user-profile">
          <div className="search-bar flex items-center">
             <input type="text" placeholder="Tìm kiếm thành viên..." />
          </div>
          <div className="avatar">
            <Users size={20}/>
          </div>
        </div>
      </header>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card flex-col">
            <div className="flex justify-between items-center w-full">
              <h3>{stat.title}</h3>
              <div className="icon-wrapper">
                {stat.icon}
              </div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-trend">{stat.trend}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="recent-activity">
          <h2 className="section-title">Hoạt động gần đây</h2>
          <div className="activity-list">
             {members.length === 0 ? <p className="text-muted">Chưa có hoạt động nào được ghi nhận.</p> : null}
             {[...members].reverse().slice(0, 5).map((m, idx) => (
               <div key={idx} className="activity-item animate-fade-in" style={{animationDelay: `${idx*0.05}s`}}>
                 <div className="dot" style={{backgroundColor: idx % 2 === 0 ? '#16a34a' : '#0071ff'}}></div>
                 <div className="activity-text">Thành viên <strong>{m.fullName}</strong> vừa được thêm vào bản ghi gia phả.</div>
                 <div className="activity-time">Mới đây</div>
               </div>
             ))}
          </div>
        </div>

        <div className="upcoming-events">
           <h2 className="section-title">Sự kiện sắp tới</h2>
           <div className="events-list">
             {/* Mock Event data for presentation since actual events are fetched in Events.jsx but we want it looking good here */}
             <div className="event-item">
                <div className="event-date-block">
                  <span className="event-month">Thg 4</span>
                  <span className="event-day">15</span>
                </div>
                <div className="event-details-col">
                  <span className="event-name">Giỗ Tổ Mẫu</span>
                  <span className="event-meta">Nhà Thờ Tổ Danh Hương</span>
                </div>
             </div>
             
             <div className="event-item">
                <div className="event-date-block">
                  <span className="event-month">Thg 5</span>
                  <span className="event-day">02</span>
                </div>
                <div className="event-details-col">
                  <span className="event-name">Họp mặt con cháu</span>
                  <span className="event-meta">Quê Nội</span>
                </div>
             </div>
           </div>
           {/* If no events: 
             <div className="empty-state">
                <Calendar size={48} opacity={0.3} color="var(--text-muted)" />
                <p>Không có sự kiện sắp tới</p>
             </div> 
           */}
        </div>
      </div>
    </div>
  );
}
