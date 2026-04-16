const axios = require('axios');

async function runTests() {
  console.log('\n[QA AGENT REPORT] Bắt đầu Integration Test cho Module Bảng Tin...\n');
  let errors = 0;
  let postId = null;

  try {
    // 1. Tạo bài viết mới
    process.stdout.write('[TEST 1] Tạo bài viết (POST /api/posts)... ');
    const postRes = await axios.post('http://localhost:5000/api/posts', {
      title: '[AUTO TEST] Cáo thị từ bài test tự động',
      content: 'Chạy Integration testing cho API!',
      category: 'Thông báo',
      author: 'QA_Agent_007'
    });
    postId = postRes.data.id;
    console.log('✅ PASSED (ID: ' + postId + ')');

    // 2. Tạo bình luận vào bài viết trên
    process.stdout.write('[TEST 2] Viết bình luận (POST /api/posts/' + postId + '/comments)... ');
    await axios.post(`http://localhost:5000/api/posts/${postId}/comments`, {
      author: 'Tester_Minion',
      content: 'Đã test nhé sếp!'
    });
    console.log('✅ PASSED');

    // 3. Đọc danh sách bài viết
    process.stdout.write('[TEST 3] Tải danh sách bài và comment (GET /api/posts)... ');
    const getRes = await axios.get('http://localhost:5000/api/posts');
    const createdPost = getRes.data.find(p => p.id === postId);
    if(createdPost && createdPost.comments && createdPost.comments.length > 0) {
       console.log('✅ PASSED (Đã móc dữ liệu SQL thành công)');
    } else {
       console.log('❌ FAILED (Không tìm thấy bài hoặc comment)');
       errors++;
    }

    // 4. Xóa bài viết
    process.stdout.write('[TEST 4] Xóa Dọn dẹp Database (DELETE /api/posts/' + postId + ')... ');
    await axios.delete(`http://localhost:5000/api/posts/${postId}`);
    console.log('✅ PASSED');

  } catch (err) {
    console.error('\n❌ ERROR: Kiểm thử thất bại!', err.message);
    errors++;
  }

  console.log('\n=======================================');
  if(errors === 0) {
     console.log('🏆 KẾT QUẢ: 100% HOẠT ĐỘNG HOÀN HẢO! Database SQLite đọc/ghi trơn tru, API phản hồi mượt mà.');
  } else {
     console.log('🔥 KẾT QUẢ: PHÁT HIỆN LỖI CODE! Cần Coder Agent vào sửa chữa.');
  }
  console.log('=======================================\n');
}

runTests();
