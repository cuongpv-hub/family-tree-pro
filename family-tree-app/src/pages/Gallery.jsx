import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Image, Upload, Trash2, X, ImagePlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Gallery.css';

export default function Gallery() {
  const { user, isAdmin } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [note, setNote] = useState('');
  const [isShared, setIsShared] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchPhotos = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/gallery?userId=${user?.id}&role=${user?.role}`);
      setPhotos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi tải ảnh:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Vui lòng chọn một bức ảnh!');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('note', note);
    formData.append('uploaderId', user?.id || '');
    formData.append('uploaderName', user?.username || 'Ẩn danh');
    formData.append('isShared', isShared);

    setUploading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/gallery`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Tải ảnh lên thành công!');
      setShowModal(false);
      setFile(null);
      setPreview(null);
      setNote('');
      setIsShared(true);
      fetchPhotos();
    } catch (error) {
      console.error('Lỗi upload:', error);
      alert('Tải ảnh lên thất bại!');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bức ảnh này?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/gallery/${id}`);
      fetchPhotos();
    } catch (error) {
      console.error('Lỗi xóa ảnh:', error);
      alert('Xóa ảnh thất bại!');
    }
  };

  return (
    <div className="gallery-container animate-fade-in">
      <div className="gallery-header">
        <h1>Thư Viện Ảnh</h1>
        <button className="btn-upload" onClick={() => setShowModal(true)}>
          <Upload size={18} /> Tải ảnh lên
        </button>
      </div>

      {loading ? (
        <div style={{textAlign: 'center', padding: '3rem', color: 'var(--text-muted)'}}>Đang tải thư viện ảnh...</div>
      ) : photos.length === 0 ? (
        <div className="empty-gallery glass-panel">
          <ImagePlus size={48} opacity={0.3} color="var(--text-muted)" />
          <p>Chưa có hình ảnh nào được tải lên.<br/>Bấm "Tải ảnh lên" để chia sẻ khoảnh khắc đầu tiên!</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {photos.map(photo => (
            <div key={photo.id} className="photo-card animate-fade-in">
              <div className="photo-wrapper">
                <img src={`http://localhost:5000${photo.imageUrl}`} alt="Gallery item" />
              </div>
              <div className="photo-info">
                <p className="photo-note">{photo.note || 'Không có ghi chú'}</p>
                <div style={{fontSize:'0.75rem', marginBottom:'0.5rem', color:'var(--text-muted)'}}>
                   Đăng bởi: <strong>{photo.uploaderName || 'Hệ thống'}</strong>
                   <span style={{marginLeft:'8px', padding:'2px 6px', background: photo.isShared ? 'rgba(22, 163, 74, 0.1)' : 'rgba(225, 29, 72, 0.1)', color: photo.isShared ? '#16a34a' : '#e11d48', borderRadius:'4px'}}>
                     {photo.isShared ? 'Công khai' : 'Riêng tư'}
                   </span>
                </div>
                <div className="photo-meta">
                  <span className="photo-date">
                    {new Date(photo.uploadedAt).toLocaleDateString('vi-VN')}
                  </span>
                  {isAdmin && (
                    <button className="btn-delete-photo" onClick={() => handleDelete(photo.id)} title="Xóa bức ảnh này">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{width: '90%', maxWidth: '500px'}}>
            <div className="modal-header">
              <h2 style={{fontSize: '1.4rem', fontWeight: 500}}>Tải Ảnh Mới</h2>
              <button className="btn-close" onClick={() => { setShowModal(false); setPreview(null); setFile(null); }}><X size={24}/></button>
            </div>
            
            <form onSubmit={handleUpload} className="photo-form">
              <div className="file-input-wrapper">
                {!preview ? (
                  <>
                    <Image size={40} color="var(--accent-primary)" style={{marginBottom: '1rem'}} />
                    <p style={{color: 'var(--text-secondary)'}}>Nhấn để chọn ảnh từ máy <br/> (hoặc kéo thả vào đây)</p>
                  </>
                ) : (
                  <img src={preview} alt="Preview" className="file-preview" />
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </div>

              <div className="form-group">
                <label style={{color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block'}}>Nhập ghi chú cho bức ảnh (tùy chọn)</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="Ghi chú về kỷ niệm, sự kiện hoặc người trong ảnh..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
              </div>

              <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500, color: 'var(--text-primary)' }}>
                  <input type="checkbox" checked={isShared} onChange={(e) => setIsShared(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                  Chia sẻ ảnh này công khai
                </label>
                <p style={{fontSize:'0.8rem', color:'var(--text-muted)', marginTop:'0.25rem', marginLeft:'1.5rem'}}>Nếu tắt, bức ảnh sẽ được khóa riêng tư và chỉ một mình bạn hoặc Trưởng tộc mới thấy.</p>
              </div>

              <div className="modal-actions" style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                <button type="button" className="btn-cancel" style={{flex: 1}} onClick={() => { setShowModal(false); setPreview(null); setFile(null); }}>Hủy cài đặt</button>
                <button type="submit" className="btn-save" style={{flex: 2}} disabled={uploading}>
                  {uploading ? 'Đang tải lên...' : 'Lưu bức ảnh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
