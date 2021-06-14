const router = require('express').Router();
const { Blog, User, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

// get all users
router.get('/', (req, res) => {
    Blog.findAll({
        attributes: [
            'id',
            'title',
            'created_at',
            'blog_content'
        ],
      order: [['created_at', 'DESC']],
      include: [
        // Comment model here -- attached username to comment
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'blog_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        },
      ]
    })
      .then(blogData => res.json(blogData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.get('/:id', (req, res) => {
    Blog.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'title',
        'created_at',
        'blog_content'
      ],
      include: [
        // include the Comment model here:
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'blog_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        }
      ]
    })
      .then(blogData => {
        if (!blogData) {
          res.status(404).json({ message: 'No blog found with this id' });
          return;
        }
        res.json(blogData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

router.post('/', withAuth, (req, res) => {
    Blog.create({
      title: req.body.title,
      blog_content: req.body.blog_content,
      user_id: req.session.user_id
    })
      .then(blogData => res.json(blogData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.put('/:id', withAuth, (req, res) => {
    Blog.update({
        title: req.body.title,
        blog_content: req.body.blog_content
      },
      {
        where: {
          id: req.params.id
        }
      })
      .then(blogData => {
        if (!blogData) {
          res.status(404).json({ message: 'No blog found with this id' });
          return;
        }
        res.json(blogData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.delete('/:id', withAuth, (req, res) => {
    Blog.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(blogData => {
        if (!blogata) {
          res.status(404).json({ message: 'No blog found with this id' });
          return;
        }
        res.json(blogData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  module.exports = router;