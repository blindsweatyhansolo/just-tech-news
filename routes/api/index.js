// MIDDLEMAN FILE FOR ROUTING ALL ROUTE ENDPOINT MODULES FOR USE BY SERVER
const router = require('express').Router();

const userRoutes = require('./user-routes.js');

// prefixes /users to the API paths in user-routes.js
router.use('/users', userRoutes);

module.exports = router;