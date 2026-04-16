import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Trash2, MessageCircle, Clock, Save, Mic } from 'lucide-react';
import './News.css';

const API_URL = `${import.meta.env.VITE_API_URL}/api/posts`;

const News = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Tin tức');
  const [isListening, setIsListening] = useState(false);

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
    if (!title.trim() && !content.trim()) return;

    try {
      const res = await axios.post(API_URL, {
        title: title.trim() || 'Chia sẻ dòng họ',
        content,
        category,
        author: user?.fullName || user?.username || 'Thành viên ẩn danh'
      });
      setPosts([res.data, ...posts]);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Lỗi đăng bài:', error);
      alert('Không thể đăng bài viết.');
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này (sẽ xóa luôn tất cả bình luận bên trong)?')) return;
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

  const toggleListen = () => {
    if (isListening) return; // Tránh bấm nhiều lần
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("⚠️ Trình duyệt của bạn không hỗ trợ tính năng Nhận diện giọng nói. Hãy dùng trình duyệt Chrome/Edge mới nhất nhé.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setContent(prev => prev + (prev.length > 0 ? " " : "") + transcript);
    };

    recognition.onerror = (event) => {
      console.error("Lỗi Microphone:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="news-container">
      <div className="news-header">
        <h1 className="news-title">Bảng Tin & Ký Sự</h1>
      </div>

      <div className="create-post-card always-on">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{width:'45px', height:'45px', borderRadius:'50%', background:'linear-gradient(135deg, #1aa3ff 0%, #00d2ff 100%)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', fontSize:'1.2rem', boxShadow: '0 4px 10px rgba(26,163,255,0.3)'}}>
            {user?.username ? user.username.substring(0,2).toUpperCase() : 'FT'}
          </div>
          <span style={{ fontSize: '1.2rem', color: '#e2e8f0' }}>Chào <b>{user?.fullName || user?.username || "Thành viên"}</b>, dòng họ hôm nay có ký ức hay sự kiện gì mới không? Kể ngay nào! 😊</span>
        </div>

        <form className="create-post-form" onSubmit={handleCreatePost}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Tiêu đề bài viết (không bắt buộc)..." 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                style={{ fontSize: '1.1rem', padding: '1rem' }}
              />
              <select style={{ width: '220px', fontSize: '1.1rem' }} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Tin tức">📌 Cập nhật Tin Tức</option>
                <option value="Ký sự">✒️ Kể lại Ký Sự</option>
                <option value="Thông báo">📣 Ra Thông báo</option>
                <option value="Sự kiện">🎉 Khác</option>
              </select>
            </div>
            
            <div style={{ position: 'relative' }}>
              <textarea 
                rows="4" 
                placeholder="Chạm vào biểu tượng Micro bên dưới để kể chuyện bằng giọng nói, hoặc bạn cũng có thể gõ chữ trực tiếp vào đây..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{ fontSize: '1.2rem', padding: '1.2rem', paddingBottom: '3.5rem' }}
              ></textarea>
              
              <div style={{ position: 'absolute', bottom: '25px', right: '20px', display: 'flex', gap: '10px' }}>
                <button 
                  type="button" 
                  className={`mic-btn ${isListening ? 'listening' : ''}`}
                  onClick={toggleListen}
                  title="Bấm để nói bằng tiếng Việt"
                >
                  <Mic size={24} /> {isListening ? 'Đang Lắng Nghe...' : 'Nhấn Để Bắt Đầu Thu Âm'}
                </button>
              </div>
            </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" className="post-submit-btn explicit-btn" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              <Save size={20}/> <span>Đăng Bài Lên Bảng Tin</span>
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', fontSize: '1.2rem' }}>Đang tải dữ liệu gia tộc...</div>
      ) : (
        <div className="posts-list">
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem', fontSize: '1.1rem' }}>
              Chưa có bài viết nào. Hãy là người đầu tiên kéo gia đình gần nhau hơn!
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <div className="post-title">
                    <span className="post-category">{post.category}</span>
                    <h2 style={{ marginTop: '0.8rem', fontSize: '1.8rem' }}>{post.title}</h2>
                    <div className="post-meta">
                      <span style={{color: '#fff', fontWeight: 'bold'}}>{post.author}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={16}/> {new Date(post.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>
                  <div className="post-actions">
                    {(user?.role === 'ADMIN' || user?.username === post.author) && (
                      <button className="delete-btn explicit-btn" onClick={() => handleDeletePost(post.id)}>
                        <Trash2 size={18} /> <span>Xóa bài này</span>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="post-content" style={{ fontSize: '1.2rem' }}>
                  {post.content}
                </div>

                <div className="comments-section">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', marginBottom: '1rem', fontSize: '1.1rem' }}>
                    <MessageCircle size={20}/> {post.comments?.length || 0} Bình luận
                  </div>
                  
                  {post.comments?.map(cmt => (
                    <div key={cmt.id} className="comment-item">
                      <div className="comment-meta">{cmt.author} <span style={{fontWeight:'normal', fontSize:'0.9rem', color: '#64748b'}}> - {new Date(cmt.createdAt).toLocaleString('vi-VN')}</span></div>
                      <div className="comment-content">{cmt.content}</div>
                    </div>
                  ))}

                  <form className="comment-form" onSubmit={(e) => handlePostComment(e, post.id)}>
                    <input 
                      type="text" 
                      className="comment-input" 
                      placeholder="Viết bình luận của bạn..." 
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      style={{ fontSize: '1.1rem', padding: '1rem' }}
                    />
                    <button type="submit" className="comment-submit explicit-btn" style={{ fontSize: '1.1rem' }}>Gửi Bình Luận</button>
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
