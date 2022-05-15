// ALL USER-FACING ROUTES [homepage, login page, etc]
const router = require('express').Router();
const sequelize = require('../config/connection');
const {Post, User, Comment, Vote } = require('../models');


router.get('/', (req, res) => {
    console.log('========================');
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
        res.render('homepage', { posts });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;