// MIDDLEMAN FILE FOR ROUTING ALL ROUTE ENDPOINT MODULES FOR USE BY SERVER
const router = require('express').Router();

const userRoutes = require('./user-routes.js');
const postRoutes = require('./post-routes');
const commentRoutes = require('./comment-routes');

// prefixes /users to the API paths in user-routes.js
router.use('/users', userRoutes);
// prefixes /posts to the API paths in post-routes.js
router.use('/posts', postRoutes);
// prefixes /comments to the API paths in comment-routes.js
router.use('/comments', commentRoutes);

module.exports = router;