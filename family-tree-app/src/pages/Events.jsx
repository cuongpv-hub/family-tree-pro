import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'Đám Giỗ',
    eventDate: '',
    location: '',
    description: ''
  });

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/events`);
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi tải sự kiện:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/events`, newEvent);
      setShowModal(false);
      setNewEvent({ title: '', type: 'Đám Giỗ', eventDate: '', location: '', description: '' });
      fetchEvents();
    } catch (error) {
      alert('Tạo sự kiện thất bại');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`);
      fetchEvents();
    } catch (error) {
      alert('Xóa sự kiện thất bại');
      console.error(error);
    }
  };

  return (
    <div className="events-container glass-panel">
      <div className="events-header">
        <h1 className="glow-text">Lịch Sự Kiện</h1>
        <button className="btn-add-event" onClick={() => setShowModal(true)}>
          <span>+</span> Thêm Sự Kiện
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">Đang tải dữ liệu...</div>
      ) : (
        <div className="events-grid">
          {events.length === 0 ? (
            <p className="empty-message">Chưa có sự kiện nào.</p>
          ) : (
            events.map(evt => (
              <div key={evt.id} className="event-card glass-card">
                <div className="event-type-badge">{evt.type}</div>
                <h3 className="event-title">{evt.title}</h3>
                <div className="event-details">
                  <p><strong>Ngày:</strong> {evt.eventDate}</p>
                  <p><strong>Địa điểm:</strong> {evt.location || 'Không có'}</p>
                  <p className="event-desc">{evt.description}</p>
                </div>
                <button className="btn-delete" onClick={() => handleDelete(evt.id)}>Xóa</button>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-modal">
            <h2>Thêm Mới Sự Kiện</h2>
            <form onSubmit={handleSubmit} className="event-form">
              <div className="form-group">
                <label>Tiêu đề</label>
                <input type="text" className="form-control" name="title" value={newEvent.title} onChange={handleInputChange} required />
              </div>
              <div className="form-group row">
                <div className="half">
                  <label>Loại hình</label>
                  <select className="form-control" name="type" value={newEvent.type} onChange={handleInputChange}>
                    <option value="Đám Giỗ">Đám Giỗ</option>
                    <option value="Họp Họ">Họp Họ</option>
                    <option value="Sinh Nhật">Sinh Nhật</option>
                    <option value="Lễ Tết">Lễ Tết</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div className="half">
                  <label>Ngày diễn ra</label>
                <input type="date" className="form-control" name="eventDate" value={newEvent.eventDate} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Địa điểm</label>
                <input type="text" className="form-control" name="location" value={newEvent.location} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Ghi chú</label>
                <textarea className="form-control" name="description" value={newEvent.description} onChange={handleInputChange} rows="3"></textarea>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-save">Lưu</button>
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
