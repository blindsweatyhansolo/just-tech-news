// MIDDLEMAN FILE TO COLLECT PACKAGED API ROUTES FROM ROUTES/API/INDEX.JS
const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./home-routes');

router.use('/', homeRoutes);
// prefixes /api to all API paths collected in routes/api/index.js
router.use('/api', apiRoutes);

// in case of request to non-existant endpoint, send 404 error (RESTful practice)
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;