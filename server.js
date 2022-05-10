const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TURN ON ROUTES
app.use(routes);

// TURN ON CONNECTION TO DB AND SERVER
// sequelize.sync() method establishes connection to db, taking the models and connecting them to the associated db tables
// if it doesn't find a table, Sequelize will create it
// {force: false} means db tables will NOT be dropped and recreated on start-up 
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});