import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Calendar, Activity, Ghost, Wallet, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const formatVND = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function Dashboard() {
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [fundData, setFundData] = useState({ totalFund: 0, transactions: [] });

  useEffect(() => {
    fetch('http://localhost:5000/api/members')
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(err => console.error(err));

    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));

    fetch('http://localhost:5000/api/funds')
      .then(res => res.json())
      .then(data => setFundData({ totalFund: data.totalFund || 0, transactions: data.transactions || [] }))
      .catch(err => console.error(err));
  }, []);

  const totalMembers = members.length;
  const aliveMembers = members.filter(m => m.status === 'Alive').length;
  const deceasedMembers = members.filter(m => m.status === 'Deceased').length;
  const maleMembers = members.filter(m => m.gender === 'Male').length;

  const stats = [
    { title: 'Tổng Nhân Khẩu', value: totalMembers, icon: <Users size={22} color="#0071ff" />, trend: 'thành viên trong tộc' },
    { title: 'Đang sinh sống', value: aliveMembers, icon: <Activity size={22} color="#16a34a" />, trend: 'trong tổng số' },
    { title: 'Đã khuất', value: deceasedMembers, icon: <Ghost size={22} color="#94a3b8" />, trend: 'lưu danh muôn đời' },
    { title: 'Nam giới', value: maleMembers, icon: <UserPlus size={22} color="#6366f1" />, trend: 'trong gia phả' },
  ];

  // Upcoming events sorted
  const upcomingEvents = [...events]
    .filter(e => e.eventDate >= new Date().toISOString().split('T')[0])
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
    .slice(0, 3);

  const recentTransactions = (fundData.transactions || []).slice(0, 3);

  return (
    <div className="dashboard animate-fade-in">
      <header className="dashboard-header">
        <div>
          <h1>Tổng Quan Gia Phả</h1>
          <p className="text-muted" style={{fontSize: '0.9rem', marginTop: '0.25rem'}}>Cập nhật tình hình dòng Họ Phạm mới nhất.</p>
        </div>
        <div className="header-search">
          <input type="text" placeholder="🔍  Tìm kiếm thành viên..." className="search-input" />
        </div>
      </header>

      {/* Stat Cards */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-top">
              <span className="stat-title">{stat.title}</span>
              <div className="icon-wrapper">{stat.icon}</div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-trend">{stat.trend}</div>
          </div>
        ))}
      </div>

      {/* Fund Summary Banner */}
      <div className={`fund-banner ${fundData.totalFund >= 0 ? 'fund-positive' : 'fund-negative'}`}>
        <div className="fund-banner-left">
          <Wallet size={28} />
          <div>
            <p className="fund-banner-label">Số dư Quỹ Dòng Họ</p>
            <p className="fund-banner-amount">{formatVND(fundData.totalFund)}</p>
          </div>
        </div>
        <Link to="/funds" className="fund-banner-link">
          Xem chi tiết <ArrowRight size={16} />
        </Link>
      </div>

      <div className="dashboard-content">
        {/* Recent Members */}
        <div className="recent-activity">
          <div className="section-header">
            <h2 className="section-title">Thành viên mới nhất</h2>
            <Link to="/members" className="section-link">Xem tất cả <ArrowRight size={14}/></Link>
          </div>
          <div className="activity-list">
            {members.length === 0
              ? <p className="text-muted" style={{padding:'1rem'}}>Chưa có thành viên nào.</p>
              : [...members].reverse().slice(0, 5).map((m, idx) => (
                <div key={idx} className="activity-item" style={{animationDelay: `${idx*0.05}s`}}>
                  <div className="member-dot" style={{background: m.gender === 'Male' ? '#dbeafe' : '#fce7f3', color: m.gender === 'Male' ? '#2563eb' : '#db2777'}}>
                    {m.fullName?.charAt(0)}
                  </div>
                  <div className="activity-text">
                    <strong>{m.fullName}</strong>
                    <span className="activity-meta">{m.status === 'Alive' ? '🟢 Đang sống' : '⚫ Đã mất'} · {m.gender === 'Male' ? 'Nam' : 'Nữ'}</span>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Upcoming Events */}
          <div className="upcoming-events">
            <div className="section-header">
              <h2 className="section-title">Sự kiện sắp tới</h2>
              <Link to="/events" className="section-link">Xem tất cả <ArrowRight size={14}/></Link>
            </div>
            <div className="events-list">
              {upcomingEvents.length === 0
                ? <p className="text-muted" style={{padding:'1rem 0', fontSize:'0.875rem'}}>Không có sự kiện sắp tới.</p>
                : upcomingEvents.map((evt, i) => {
                    const d = new Date(evt.eventDate);
                    return (
                      <div key={i} className="event-item">
                        <div className="event-date-block">
                          <span className="event-month">{d.toLocaleString('vi-VN', {month: 'short'})}</span>
                          <span className="event-day">{String(d.getDate()).padStart(2, '0')}</span>
                        </div>
                        <div className="event-details-col">
                          <span className="event-name">{evt.title}</span>
                          <span className="event-meta">{evt.location || 'Chưa có địa điểm'}</span>
                        </div>
                      </div>
                    );
                  })
              }
            </div>
          </div>

          {/* Recent Fund Transactions */}
          <div className="upcoming-events" style={{marginTop: '1.5rem'}}>
            <div className="section-header">
              <h2 className="section-title">Giao dịch quỹ gần đây</h2>
              <Link to="/funds" className="section-link">Xem tất cả <ArrowRight size={14}/></Link>
            </div>
            <div className="events-list">
              {recentTransactions.length === 0
                ? <p className="text-muted" style={{padding:'1rem 0', fontSize:'0.875rem'}}>Chưa có giao dịch nào.</p>
                : recentTransactions.map((tx, i) => (
                  <div key={i} className="event-item">
                    <div className="event-date-block" style={{background: tx.type === 'IN' ? '#dcfce7' : '#fee2e2'}}>
                      {tx.type === 'IN'
                        ? <TrendingUp size={18} color="#16a34a" />
                        : <TrendingDown size={18} color="#dc2626" />
                      }
                    </div>
                    <div className="event-details-col">
                      <span className="event-name" style={{fontSize:'0.875rem'}}>{tx.description}</span>
                      <span className="event-meta" style={{color: tx.type === 'IN' ? '#16a34a' : '#dc2626', fontWeight: 600}}>
                        {tx.type === 'IN' ? '+' : '-'}{formatVND(tx.amount)}
                      </span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
