import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Trash2, MessageCircle, Clock, Save, Edit3 } from 'lucide-react';
import './News.css';

const API_URL = 'http://localhost:5000/api/posts';

const News = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Tin tức');

  // Comment State (postId -> text)
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(API_URL);
      setPosts(res.data);
    } catch (error) {
      console.error('Lỗi tải bài viết:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      const res = await axios.post(API_URL, {
        title,
        content,
        category,
        author: user?.fullName || user?.username || 'Thành viên ẩn danh'
      });
      setPosts([res.data, ...posts]);
      setTitle('');
      setContent('');
      setShowForm(false);
    } catch (error) {
      console.error('Lỗi đăng bài:', error);
      alert('Không thể đăng bài viết.');
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Lỗi xóa bài:', error);
    }
  };

  const handlePostComment = async (e, postId) => {
    e.preventDefault();
    const cContent = commentInputs[postId];
    if (!cContent?.trim()) return;

    try {
      const res = await axios.post(`${API_URL}/${postId}/comments`, {
        author: user?.fullName || user?.username || 'Thành viên',
        content: cContent
      });
      
      // Update local state
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return { ...p, comments: [...(p.comments || []), res.data] };
        }
        return p;
      }));
      setCommentInputs({ ...commentInputs, [postId]: '' });
    } catch (error) {
      console.error('Lỗi gửi bình luận:', error);
    }
  };

  return (
    <div className="news-container">
      <div className="news-header">
        <h1 className="news-title">Bảng Tin & Ký Sự</h1>
        <button className="post-submit-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px'}} onClick={() => setShowForm(!showForm)}>
          <Edit3 size={18} /> {showForm ? 'Hủy' : 'Viết Bài Mới'}
        </button>
      </div>

      {showForm && (
        <div className="create-post-card slide-down">
          <form className="create-post-form" onSubmit={handleCreatePost}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Tiêu đề bài viết..." 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
              <select style={{ width: '200px' }} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Tin tức">📌 Tin tức</option>
                <option value="Ký sự">✒️ Ký sự</option>
                <option value="Thông báo">📣 Thông báo</option>
                <option value="Sự kiện">🎉 Khác</option>
              </select>
            </div>
            
            <textarea 
              rows="5" 
              placeholder="Nội dung bài viết, chia sẻ tư liệu lịch sử hoặc thông báo..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            
            <button type="submit" className="post-submit-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Save size={18}/> Đăng Bài
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Đang tải bảng tin...</div>
      ) : (
        <div className="posts-list">
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
              Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ!
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <div className="post-title">
                    <span className="post-category">{post.category}</span>
                    <h2 style={{ marginTop: '0.8rem' }}>{post.title}</h2>
                    <div className="post-meta">
                      <span style={{color: '#fff', fontWeight: 'bold'}}>{post.author}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14}/> {new Date(post.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>
                  <div className="post-actions">
                    {(user?.role === 'ADMIN' || user?.username === post.author) && (
                      <button className="delete-btn" onClick={() => handleDeletePost(post.id)}>
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="post-content">
                  {post.content}
                </div>

                <div className="comments-section">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', marginBottom: '1rem' }}>
                    <MessageCircle size={18}/> {post.comments?.length || 0} Bình luận
                  </div>
                  
                  {post.comments?.map(cmt => (
                    <div key={cmt.id} className="comment-item">
                      <div className="comment-meta">{cmt.author} - <span style={{fontWeight:'normal', fontSize:'0.8rem'}}>{new Date(cmt.createdAt).toLocaleString('vi-VN')}</span></div>
                      <div className="comment-content">{cmt.content}</div>
                    </div>
                  ))}

                  <form className="comment-form" onSubmit={(e) => handlePostComment(e, post.id)}>
                    <input 
                      type="text" 
                      className="comment-input" 
                      placeholder="Viết bình luận..." 
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    />
                    <button type="submit" className="comment-submit">Gửi</button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default News;
