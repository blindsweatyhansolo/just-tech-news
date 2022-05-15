const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// handlebars set up
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// TURN ON ROUTES
app.use(routes);

// TURN ON CONNECTION TO DB AND SERVER
// sequelize.sync() method establishes connection to db, taking the models and connecting them to the associated db tables
// if it doesn't find a table, Sequelize will create it
// {force: false} means db tables will NOT be dropped and recreated on start-up
// {force: true} will drop/re-create the tables on start-up, which will update any association changes
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});