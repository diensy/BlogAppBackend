const Post = require('../model/blog');
const User = require('../model/user');

exports.createPost = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { title, description, image, catagory } = req.body;

        const post = new Post({
            title,
            description,
            image,
            catagory,
            author: userId,
        });

        await post.save();
        res.status(201).json({ message: 'Post created successfully', postId: post._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        let query = req.body.query || {};
        if (req.query.title) {
            query.title = new RegExp(req.query.title, 'i');
        }

        if (req.query.catagory) {
            query.catagory = new RegExp(req.query.catagory, 'i');
        }

        if (req.query.query) {
            const queryRegex = new RegExp(req.query.query, 'i');
            query.$or = [{ title: queryRegex }, { catagory: queryRegex }];
        }

        const posts = await Post.find(query)
            .populate('author', 'name email')
            .populate('comments.author', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId)
            .populate('author', 'name email')
            .populate('comments.author', 'name');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.editPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const updatedPost = await Post.findByIdAndUpdate(postId, req.body, { new: true });

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post updated successfully', updatedPost });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.userId;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this post' });
        }

        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserAllPosts = async (req, res) => {
    try {
        const userId = req.params.userId;
        const userPosts = await Post.find({ author: userId }).sort({ createdAt: -1 });

        res.status(200).json(userPosts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.likePost = async (req, res) => {
    try {
        const userId = req.user.userId;
        const post = await Post.findById(req.params.postId);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.dislikes = post.dislikes.filter(id => id.toString() !== userId);

        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();
        res.json({ message: 'Post liked/unliked' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.dislikePost = async (req, res) => {
    try {
        const userId = req.user.userId;
        const post = await Post.findById(req.params.postId);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.likes = post.likes.filter(id => id.toString() !== userId);

        if (post.dislikes.includes(userId)) {
            post.dislikes = post.dislikes.filter(id => id.toString() !== userId);
        } else {
            post.dislikes.push(userId);
        }

        await post.save();
        res.json({ message: 'Post disliked/undisliked' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { content } = req.body;

        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.comments.push({ author: userId, content });

        await post.save();

        const populatedPost = await Post.findById(post._id)
            .populate('comments.author', 'name');

        res.json({ message: 'Comment added', comments: populatedPost.comments });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
