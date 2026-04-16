import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, Wallet, Trash2, X, Paperclip, Tag, BarChart2, List } from 'lucide-react';
import './Funds.css';

const formatVND = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const CATEGORIES_IN  = ['Đóng quỹ đinh', 'Quyên góp', 'Cung tiến giỗ', 'Tài trợ', 'Khác'];
const CATEGORIES_OUT = ['Giỗ chạp', 'Xây dựng / Sửa sang', 'Khuyến học', 'Thăm hỏi / Hiếu hỉ', 'Chi phí hành chính', 'Khác'];

const CAT_COLORS = {
  'Đóng quỹ đinh': '#2563eb', 'Quyên góp': '#16a34a', 'Cung tiến giỗ': '#d97706',
  'Tài trợ': '#7c3aed', 'Giỗ chạp': '#dc2626', 'Xây dựng / Sửa sang': '#ea580c',
  'Khuyến học': '#0891b2', 'Thăm hỏi / Hiếu hỉ': '#be185d',
  'Chi phí hành chính': '#64748b', 'Khác': '#94a3b8',
};

export default function Funds() {
  const { user, isAdmin } = useAuth();
  const [data, setData] = useState({ totalFund: 0, transactions: [], monthlyChart: [], categorySummary: [] });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' | 'chart'
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('IN');
  const [form, setForm] = useState({ description: '', amount: '', transactionDate: new Date().toISOString().split('T')[0], category: '' });
  const [receiptFile, setReceiptFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/funds`);
      setData(res.data);
      setLoading(false);
    } catch (e) { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (type) => {
    setModalType(type);
    setForm({ description: '', amount: '', transactionDate: new Date().toISOString().split('T')[0], category: type === 'IN' ? CATEGORIES_IN[0] : CATEGORIES_OUT[0] });
    setReceiptFile(null);
    setPreviewUrl(null);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setReceiptFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('type', modalType);
      fd.append('amount', form.amount);
      fd.append('description', form.description);
      fd.append('transactionDate', form.transactionDate);
      fd.append('recorderName', user?.username || 'Hệ thống');
      fd.append('category', form.category);
      if (receiptFile) fd.append('receiptImage', receiptFile);

      await axios.post(`${import.meta.env.VITE_API_URL}/api/funds`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setShowModal(false);
      fetchData();
    } catch (e) { alert('Lỗi lập phiếu!'); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận hủy biên lai này?')) return;
    await axios.delete(`http://localhost:5000/api/funds/${id}`);
    fetchData();
  };

  const categories = modalType === 'IN' ? CATEGORIES_IN : CATEGORIES_OUT;

  // Simple bar chart max value
  const maxMonthly = Math.max(...(data.monthlyChart || []).map(m => Math.max(m.totalIn, m.totalOut)), 1);

  return (
    <div className="funds-container animate-fade-in">

      {/* Header */}
      <div className="funds-header">
        <div>
          <h1 className="funds-title">Quỹ Dòng Họ</h1>
          <p className="funds-subtitle">Minh bạch tài chính — mọi đồng tiền đều có dấu vết</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* View toggle */}
          <div className="view-toggle">
            <button className={`vt-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}><List size={16} /></button>
            <button className={`vt-btn ${view === 'chart' ? 'active' : ''}`} onClick={() => setView('chart')}><BarChart2 size={16} /></button>
          </div>
          {isAdmin && (
            <>
              <button className="btn-fund btn-in" onClick={() => openModal('IN')}><TrendingUp size={16} />Lập Phiếu Thu</button>
              <button className="btn-fund btn-out" onClick={() => openModal('OUT')}><TrendingDown size={16} />Lập Phiếu Chi</button>
            </>
          )}
        </div>
      </div>

      {/* Balance Card */}
      <div className={`fund-balance-card ${data.totalFund >= 0 ? 'positive' : 'negative'}`}>
        <Wallet size={32} className="balance-icon" />
        <div>
          <p className="balance-label">Số dư Quỹ hiện tại</p>
          <p className="balance-amount">{formatVND(data.totalFund)}</p>
        </div>
        <div className="balance-stats">
          <div className="bs-item">
            <span className="bs-label">Tổng Thu</span>
            <span className="bs-value in">+{formatVND(data.transactions?.filter(t => t.type==='IN').reduce((s,t)=>s+t.amount,0) || 0)}</span>
          </div>
          <div className="bs-item">
            <span className="bs-label">Tổng Chi</span>
            <span className="bs-value out">-{formatVND(data.transactions?.filter(t => t.type==='OUT').reduce((s,t)=>s+t.amount,0) || 0)}</span>
          </div>
        </div>
      </div>

      {/* Chart View */}
      {view === 'chart' && (
        <div className="chart-section">
          <h3 className="chart-title">Thu chi theo tháng</h3>
          <div className="bar-chart">
            {(data.monthlyChart || []).length === 0
              ? <p className="funds-empty">Chưa có dữ liệu để vẽ biểu đồ.</p>
              : data.monthlyChart.map((m, i) => (
                <div key={i} className="bar-group">
                  <div className="bars">
                    <div className="bar bar-in" style={{ height: `${(m.totalIn / maxMonthly) * 120}px` }} title={`Thu: ${formatVND(m.totalIn)}`} />
                    <div className="bar bar-out" style={{ height: `${(m.totalOut / maxMonthly) * 120}px` }} title={`Chi: ${formatVND(m.totalOut)}`} />
                  </div>
                  <span className="bar-label">{m.month?.substring(5)}/{m.month?.substring(2,4)}</span>
                </div>
              ))
            }
          </div>
          <div className="chart-legend">
            <span><span className="legend-dot in" />Thu vào</span>
            <span><span className="legend-dot out" />Chi ra</span>
          </div>

          {/* Category breakdown */}
          {(data.categorySummary || []).length > 0 && (
            <div className="category-breakdown">
              <h3 className="chart-title" style={{marginBottom:'1rem'}}>Phân tích theo danh mục</h3>
              {data.categorySummary.map((c, i) => (
                <div key={i} className="cat-row">
                  <span className="cat-dot" style={{background: CAT_COLORS[c.category] || '#94a3b8'}} />
                  <span className="cat-name">{c.category}</span>
                  <span className="cat-count">{c.count} giao dịch</span>
                  <span className="cat-total">{formatVND(c.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        loading ? <div className="funds-empty">Đang tải dữ liệu...</div>
        : (data.transactions || []).length === 0
          ? <div className="funds-empty">Chưa có giao dịch nào được ghi nhận.</div>
          : <div className="transactions-list">
              {data.transactions.map(tx => (
                <div key={tx.id} className={`transaction-item ${tx.type === 'IN' ? 'tx-in' : 'tx-out'}`}>
                  <div className="tx-icon">
                    {tx.type === 'IN' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                  </div>
                  <div className="tx-info">
                    <p className="tx-desc">{tx.description}</p>
                    <div className="tx-tags">
                      {tx.category && (
                        <span className="tx-tag" style={{ background: (CAT_COLORS[tx.category] || '#94a3b8') + '18', color: CAT_COLORS[tx.category] || '#64748b' }}>
                          <Tag size={11} /> {tx.category}
                        </span>
                      )}
                      <span className="tx-meta-date">{tx.transactionDate} · {tx.recorderName || '—'}</span>
                    </div>
                  </div>
                  {tx.receiptImage && (
                    <a href={`http://localhost:5000${tx.receiptImage}`} target="_blank" rel="noreferrer" className="tx-receipt-thumb">
                      <img src={`http://localhost:5000${tx.receiptImage}`} alt="Biên lai" />
                    </a>
                  )}
                  <div className={`tx-amount ${tx.type === 'IN' ? 'amount-in' : 'amount-out'}`}>
                    {tx.type === 'IN' ? '+' : '-'}{formatVND(tx.amount)}
                  </div>
                  {isAdmin && (
                    <button className="tx-delete" onClick={() => handleDelete(tx.id)}><Trash2 size={14} /></button>
                  )}
                </div>
              ))}
            </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h2 className={modalType === 'IN' ? 'text-in' : 'text-out'}>
                {modalType === 'IN' ? '🔖 Lập Phiếu Thu' : '🛒 Lập Phiếu Chi'}
              </h2>
              <button className="btn-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              <div className="form-group">
                <label>Danh mục</label>
                <select className="form-control" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Nội dung giao dịch</label>
                <input className="form-control" required
                  placeholder={modalType === 'IN' ? 'Vd: Anh Cường đóng quỹ đinh 2026' : 'Vd: Mua lễ mâm cúng Giỗ Tổ'}
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group">
                  <label>Số tiền (VNĐ)</label>
                  <input className="form-control" type="number" required min="1000"
                    placeholder="500000"
                    value={form.amount}
                    onChange={e => setForm({...form, amount: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Ngày giao dịch</label>
                  <input className="form-control" type="date" required
                    value={form.transactionDate}
                    onChange={e => setForm({...form, transactionDate: e.target.value})}
                  />
                </div>
              </div>

              {/* Receipt upload */}
              <div className="receipt-upload-area" onClick={() => fileRef.current.click()}>
                {previewUrl
                  ? <img src={previewUrl} alt="preview" className="receipt-preview" />
                  : <><Paperclip size={20} /><span>Đính kèm ảnh biên lai (tùy chọn)</span></>
                }
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className={`btn-save ${modalType === 'OUT' ? 'btn-save-out' : ''}`} disabled={uploading}>
                  {uploading ? 'Đang lưu...' : 'Xác nhận Lưu Phiếu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
