const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Lấy danh sách bài đăng và comment đi kèm
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: Comment, as: 'comments' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Lỗi khi tải bảng tin' });
  }
});

// Tạo bài viết mới
router.post('/', async (req, res) => {
  try {
    const { title, content, category, author } = req.body;
    const post = await Post.create({ title, content, category, author });
    res.status(201).json({ ...post.toJSON(), comments: [] });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Lỗi khi tạo bài viết' });
  }
});

// Thêm comment vào bài
router.post('/:id/comments', async (req, res) => {
  try {
    const { author, content } = req.body;
    const comment = await Comment.create({
      postId: req.params.id,
      author,
      content
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Lỗi khi thêm bình luận' });
  }
});

// Xóa bài viết
router.delete('/:id', async (req, res) => {
  try {
    await Post.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Đã xóa bài viết thành công' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Lỗi xóa bài viết' });
  }
});

module.exports = router;
