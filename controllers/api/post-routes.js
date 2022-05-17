const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Vote, Comment } = require('../../models');

// GET all posts
router.get('/', (req, res) => {
    console.log('===================');
    Post.findAll({
        // organizes the data based on newest using created_at's timestamp
        order: [['created_at', 'DESC']],
        // array of attributes to return from query from Post model
        attributes: [
            'id', 
            'post_url', 
            'title', 
            'created_at', 
            [
                sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post_id = vote.post_id)'), 
                'vote_count'
            ]
        ],
        // (JOIN) INCLUDE property expressed as object that 
        // references a Model (user / comment) and its defined attributes
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        // Promise that captures response from call (dbPostData)
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// GET one post by id
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id', 
            'post_url', 
            'title', 
            'created_at', 
            [
                sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post_id = vote.post_id)'),
                'vote_count'
            ]
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
      .then(dbPostData => {
          if (!dbPostData) {
              res.status(404).json({ message: 'No post found with this id!' });
              return;
          }
          res.json(dbPostData);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// POST create new post
router.post('/', (req, res) => {
    // check if session exists
    if (req.session) {
        Post.create({
            title: req.body.title,
            post_url: req.body.post_url,
            user_id: req.session.user_id
        })
          .then(dbPostData => res.json(dbPostData))
          .catch(err => {
              console.log(err);
              res.status(500).json(err);
          });
    }
});

// PUT /api/posts/upvote
// voting on a post is actually updating a post's data
// must be defined before the put /:id route
router.put('/upvote', (req, res) => {
    // check if session exists
    if (req.session) {
        // pass session id along with all destructured properties on req.body
        Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
        .then(updatedVoteData => res.json(updatedVoteData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    }
});

// PUT update a post's title
router.put('/:id', (req, res) => {
    // update a post's title based on id
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
      .then(dbPostData => {
          if (!dbPostData) {
              res.status(404).json({ message: 'No post found with this id!' });
              return;
          }
          res.json(dbPostData);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// DELETE remove a post
router.delete('/:id', (req, res) => {
    // delete a post based on id
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
      .then(dbPostData => {
          if (!dbPostData) {
              res.status(404).json({ message: 'No post found with this id!' });
              return;
          }
          res.json(dbPostData);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

module.exports = router;