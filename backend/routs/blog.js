const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const Blog = require('../models/Blog');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Route 1 :Get all blogs : GET "/api/blogs/fetchallblogs". No login Required
router.get('/fetchallblogs', async (req, res) => {
    try {
        const blogs = await Blog.find({})
        res.json(blogs)
    } catch (error) {
        console.error('Error fetching blogs:', error.message); // Log any error
        res.status(500).send("Internal Server Error Occurred");
    }
})
// Route 2 :Get all blogs for the user: GET "/api/blogs/fetchuserblogs". login Required
router.get('/fetchuserblogs', fetchuser, async (req, res) => {
    try {
        const blogs = await Blog.find({ user: req.user.id })
        res.json(blogs)
    } catch (error) {
        console.error('Error fetching blogs:', error.message); // Log any error
        res.status(500).send("Internal Server Error Occurred");
    }
})
// Route 3 :Add a blogs for everyone: POST "/api/blogs/addblog". login Required
router.post('/addblog', fetchuser, [
    body('author', 'Enter a valid email').exists(),
    body('title', 'title cannot be blank').exists(),
    body('content', 'content cannot be blank').exists(),
    body('summary', 'summary cannot be blank'),
    body('status', 'status cannot be blank'),
    body('category', 'category cannot be blank').exists()
], async (req, res) => {
    try {
        const { author, title, content, summary, status, category } = req.body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const blog = new Blog({
            author, title, content, summary, status, category
        })
        const savedBlog = await blog.save();
        res.json(savedBlog)
    } catch (error) {
        console.error('Error fetching blogs:', error.message); // Log any error
        res.status(500).send("Internal Server Error Occurred");
    }
})
// Route 4 :Edit a blogs for everyone: PUT "/api/blogs/editblog". login Required
router.put('/editblog/:id', fetchuser, [
    body('author', 'Enter a valid email').exists(),
    body('title', 'title cannot be blank').exists(),
    body('content', 'content cannot be blank').exists(),
    body('summary', 'summary cannot be blank'),
    body('status', 'status cannot be blank'),
    body('category', 'category cannot be blank').exists()
], async (req, res) => {
    try {
        const { author, title, content, summary, status, category } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const editedBlog = {};
        if (author) editedBlog.author = author;
        if (title) editedBlog.title = title;
        if (content) editedBlog.content = content;
        if (summary) editedBlog.summary = summary;
        if (status) editedBlog.status = status;
        if (category) editedBlog.category = category;

        let blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).send("Blog not found");
        }

        blog = await Blog.findByIdAndUpdate(req.params.id, { $set: editedBlog }, { new: true });
        res.json(blog);
    } catch (error) {
        console.error('Error fetching blogs:', error.message); // Log any error
        res.status(500).send("Internal Server Error Occurred");
    }
})
// Route 5 :Delete a blogs for everyone: Delete "/api/blogs/deleteblog". login Required
router.delete('/deleteblog/:id', fetchuser, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).send("Blog not found");
        }

        blog = await Blog.findByIdAndDelete(req.params.id);
        res.status(200).send("Blog deleted successfully");
    } catch (error) {
        console.error('Error fetching blogs:', error.message); // Log any error
        res.status(500).send("Internal Server Error Occurred");
    }
})
module.exports = router