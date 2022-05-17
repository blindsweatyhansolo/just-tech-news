// ALL USER-FACING ROUTES [homepage, login page, etc]
const router = require('express').Router();
const sequelize = require('../config/connection');
const {Post, User, Comment, Vote } = require('../models');

// root route (gets all posts for homepage)
router.get('/', (req, res) => {
    console.log(req.session);

    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
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
        // get({ plain: true }) - sequelize method to serialize data in object
        const posts = dbPostData.map(post => post.get({ plain: true }));

        // res.render used to specify which template to use (first arg: homepage.handlebars)
        // can accept an object that includes all the data to be passed into the template
        res.render('homepage', { 
            posts,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// single-post route
router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
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
            res.status(404).json({message: 'No post found with this id!'});
            return;
        }

        // serialize the data
        const post = dbPostData.get({ plain: true });

        // pass data to template, second variable is set as loggedIn session variable
        res.render('single-post', { 
            post,
            loggedIn: req.session.loggedIn
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// login/signup route
router.get('/login', (req, res) => {
    // check for session, redirect to homepage if exists
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

module.exports = router;