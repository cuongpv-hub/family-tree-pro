import React, { useState, useMemo, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Move, ZoomIn, ZoomOut, Maximize, Plus, Edit3, X, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Tree.css';

export default function Tree() {
  const { isAdmin } = useAuth();
  
  // TÍCH ĐIỆN TÍN QUANG: Đói dữ liệu thực từ Máy Chủ Sqlite API
  const [treeNodes, setTreeNodes] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/members')
      .then(r => r.json())
      .then(d => setTreeNodes(d))
      .catch(e => console.error(e));
  }, []);

  const [modal, setModal] = useState({ isOpen: false, mode: 'ADD', targetNode: null });
  const [formData, setFormData] = useState({ fullName: '', status: 'Alive', gender: 'Male' });

  const buildTree = (data, parentId = null) => {
    return data
      .filter(item => item.parentId === parentId)
      .map(item => ({
        ...item,
        children: buildTree(data, item.id)
      }));
  };

  const treeData = useMemo(() => buildTree(treeNodes), [treeNodes]);

  const openAddChildModal = (node) => {
    setFormData({ fullName: '', status: 'Alive', gender: 'Male' });
    setModal({ isOpen: true, mode: 'ADD', targetNode: node });
  };

  const openEditModal = (node) => {
    setFormData({ fullName: node.fullName, status: node.status, gender: node.gender });
    setModal({ isOpen: true, mode: 'EDIT', targetNode: node });
  };

  const handleDeleteNode = async (node) => {
    if (window.confirm(`Lệnh Bài Phán Quyết Cục Bộ: Bạn có muốn XÓA vĩnh viễn [${node.fullName}] và Toàn Bộ Con cháu của nhánh này?`)) {
      
      const idsToDelete = [node.id];
      const killBranch = (id, list) => {
         let childrenIds = list.filter(n => n.parentId === id).map(n => n.id);
         let newList = list.filter(n => n.id !== id);
         childrenIds.forEach(cId => { 
             idsToDelete.push(cId);
             newList = killBranch(cId, newList); 
         });
         return newList;
      }
      
      const finalNodes = killBranch(node.id, treeNodes);
      
      // FIRE APIS IN BACKGROUND Xóa Rễ Tận Cùng
      idsToDelete.forEach(async id => {
         await fetch(`http://localhost:5000/api/members/${id}`, { method: 'DELETE' });
      });

      setTreeNodes(finalNodes);
    }
  };

  // Nơi Phép thuật API Xảy Ra Xuyên Lục Địa
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return alert("Hội Nghị Gia Đình: Tên không thể trống!");

    if (modal.mode === 'ADD') {
      const newNode = {
        ...formData,
        id: 'node_' + Date.now().toString(),
        parentId: modal.targetNode.id
      };
      // GỌI THẲNG XUỐNG DB
      const r = await fetch('http://localhost:5000/api/members', {
         method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(newNode)
      });
      const data = await r.json();
      if(data.success) {
         setTreeNodes([...treeNodes, data.member]);
      }
    } else if (modal.mode === 'EDIT') {
      const r = await fetch(`http://localhost:5000/api/members/${modal.targetNode.id}`, {
         method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(formData)
      });
      if(r.ok) {
         setTreeNodes(treeNodes.map(n => 
           n.id === modal.targetNode.id ? { ...n, ...formData } : n
         ));
      }
    }
    setModal({ isOpen: false, mode: 'ADD', targetNode: null }); 
  };

  const TreeNode = ({ node }) => {
    return (
      <li>
        <div className="node-card">
          
          <div className="node-actions" 
               onMouseDown={(e) => e.stopPropagation()} 
               onTouchStart={(e) => e.stopPropagation()}
               onClick={(e) => e.stopPropagation()}>
            {isAdmin && (
              <button className="action-btn delete" onClick={() => handleDeleteNode(node)} title="Hủy Diệt Căn Cơ (Admin Chỉ Lệnh)">
                <Trash2 size={14}/>
              </button>
            )}
            <button className="action-btn edit" onClick={() => openEditModal(node)} title="Cập nhật Khí Khái Sinh Giới">
              <Edit3 size={15}/>
            </button>
            <button className="action-btn add" onClick={() => openAddChildModal(node)} title="Phong Ấn Khai Sinh Bé Mới">
              <Plus size={16}/>
            </button>
          </div>

          <div className="node-avatar">
             {node.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="node-name">{node.fullName}</div>
          <div className={`node-status ${node.status === 'Alive' ? 'status-alive' : 'status-deceased'}`}>
             {node.status === 'Alive' ? 'Vẫn đang lưu Danh' : 'Đã tạc tượng Ngọc'}
          </div>
        </div>
        
        {node.children && node.children.length > 0 && (
          <ul>
            {node.children.map(child => (
              <TreeNode key={child.id} node={child} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="tree-container glass-panel animate-fade-in relative">
       
      <TransformWrapper
        initialScale={1}
        minScale={0.3}
        maxScale={3}
        centerOnInit={true}
        wheel={{ step: 0.1 }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <React.Fragment>
            <div className="tree-instruction">
               <h3 className="text-gradient mb-2" style={{marginBottom: '1rem'}}>Sa Bàn Phả Hệ Thượng Thần</h3>
               <div className="flex gap-2">
                 <button onClick={() => zoomIn()} className="btn-tool"><ZoomIn size={18}/> Dàn Tới Đầu Điểm</button>
                 <button onClick={() => zoomOut()} className="btn-tool"><ZoomOut size={18}/> Thu Tiêu Cự Cảnh</button>
                 <button onClick={() => resetTransform()} className="btn-tool"><Maximize size={18}/> Khóa Tâm Trục X,Y</button>
               </div>
               <p className="text-muted" style={{marginTop: '1rem', fontSize: '0.85rem'}}>
                 <Move size={14} style={{display:'inline', verticalAlign:'middle'}}/> Tín hiệu Điện Mạng (Axios REST) Đang Trực Thuộc... Đưa chuột ngang người trên Cây để Rút Lệnh Sửa Cây!
               </p>
            </div>

            <TransformComponent wrapperStyle={{ width: "100%", height: "100%", cursor: "grab" }}>
              <div className="tree-wrapper tree">
                 <ul>
                   {treeData.map(rootNode => (
                     <TreeNode key={rootNode.id} node={rootNode} />
                   ))}
                 </ul>
              </div>
            </TransformComponent>
          </React.Fragment>
        )}
      </TransformWrapper>

      {/* BẢNG ĐIỀU CHẾ TÁI TẠO MẶT ĐẤT CÂY */}
      {modal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" onMouseDown={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="text-gradient" style={{fontSize: '1.4rem'}}>
                {modal.mode === 'ADD' ? `[Hư Vô Thần Thoại] Nặn Khối Máu Tử Nối Nhánh Chân Cho: ${modal.targetNode.fullName}` : `[Bút Viết Sinh Tử] Đổi Mệnh Cách: ${modal.targetNode.fullName}`}
              </h2>
              <button className="btn-close" onClick={() => setModal({isOpen: false})}><X size={24}/></button>
            </div>
            
            <form className="tree-modal-form" onSubmit={handleSubmit}>
              <div className="form-group" style={{marginBottom: '1rem'}}>
                <label style={{display:'block', marginBottom:'0.5rem', color: 'var(--text-secondary)'}}>Khắc Niệm Trọn Vẹn Tên</label>
                <input type="text" name="fullName" value={formData.fullName} 
                       onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                       className="form-control" autoFocus placeholder="Tên Đầy Đủ..."/>
              </div>

              <div className="flex gap-4 w-full" style={{marginBottom: '1rem', display: 'flex', gap: '1rem'}}>
                <div style={{flex: 1}}>
                  <label style={{display:'block', marginBottom:'0.5rem', color: 'var(--text-secondary)'}}>Khảm Ấn Linh Tính</label>
                  <select name="gender" value={formData.gender} 
                          onChange={(e) => setFormData({...formData, gender: e.target.value})} className="form-control">
                    <option value="Male">Ngạo Khí (Nam)</option>
                    <option value="Female">Thủy Âm (Nữ)</option>
                  </select>
                </div>
                <div style={{flex: 1}}>
                  <label style={{display:'block', marginBottom:'0.5rem', color: 'var(--text-secondary)'}}>Thiên Trọng Kiếp</label>
                  <select name="status" value={formData.status} 
                          onChange={(e) => setFormData({...formData, status: e.target.value})} className="form-control">
                    <option value="Alive">Vẫn Bước Trong Ánh Sáng Thời Gian</option>
                    <option value="Deceased">Đã Chạm Xuôi Vàng Nơi Nghĩa Chủng</option>
                  </select>
                </div>
              </div>

              <div className="tree-modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setModal({isOpen: false})}>Tẩy Khởi Lệnh Hủy</button>
                <button type="submit" className="save-btn">{modal.mode === 'ADD' ? 'Khảm Node Ngay Lập Tức!' : 'Chỉnh Sửa Đường Viền Bản Đồ Tổ Tiên!'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
