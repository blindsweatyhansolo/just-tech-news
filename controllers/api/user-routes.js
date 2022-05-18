const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { User, Post, Vote, Comment } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
    // access User model and run .findAll() method
    // findAll() is equivalent to SQL's SELECT * FROM users
    User.findAll({
        // will not return value under 'password' column
        attributes: { exclude: ['password'] }
    })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    // findOne() is equivalent to SQL's SELECT * FROM users WHERE id = ?
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
            // going [through] Vote, pull post titles User has voted on AS 'voted_posts'
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ]
    })
      .then(dbUserData => {
          if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id!'});
              return;
          }
          res.json(dbUserData);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// POST [create] /api/users
router.post('/', (req, res) => {
    // create() is equivalent to SQL's INSERT INTO users (username, email, password) VALUES ('Lerantino', 'learntino@gmail.com', 'password1234')
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
      .then(dbUserData => {
          // give server easy access to user's user_id/username and Boolean value for login status
          // make sure session is created BEFORE sending response back (req.session.save() method
          // initiates creation of session, then runs callback function)
          req.session.save(() => {
              req.session.user_id = dbUserData.id;
              req.session.username = dbUserData.username;
              req.session.loggedIn = true;

              res.json(dbUserData);
          })
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// POST route for login (POST is the standard for the login thats in process)
// POST method carries the request parameter in req.body which makes it a more secure way of transferring
// data from the  client to the server, unlike a GET request (carries the req.param appended to the url string)
router.post('/login', (req, res) => {
    // expects {email: 'value', password: 'value'}
    // use entered email as parameter for findOne() method
    User.findOne({
        where: {
            email: req.body.email
        }
    })
      .then(dbUserData => {
          // if email is invalid / doesn't exist then respond with 404 not found
          if (!dbUserData) {
              res.status(404).json({ message: 'No user with that email address!'});
              return;
          }

          // verify user
          const validPassword = dbUserData.checkPassword(req.body.password);

          if (!validPassword) {
              res.status(400).json({ message: 'Incorrect password!' });
              return;
          }

          req.session.save(() => {
              // declare session variables
              req.session.user_id = dbUserData.id;
              req.session.username = dbUserData.username;
              req.session.loggedIn = true;

              res.json({ user: dbUserData, message: 'You are now logged in!' });
          });
      });
});

// LOGOUT route for destroying session
router.post('/logout', (req, res) => {
    // check for session, destoy keyword will end active session
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            // successful destroy status code (204 NO CONTENT)
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

// PUT [update] /api/users/1
router.put('/:id', (req, res) => {
    // update() combines params for creating and looking up data
    // equivalent to SQL's 
    // UPDATE users SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234" WHERE id = 1
    // if req.body has exact key/value pairs to match the model, you can just use req.body
    User.update(req.body, {
        // { individualHooks: true } must be declared when using bcrypt's hashing functions
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
      .then(dbUserData => {
          if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id!'});
              return;
          }
          res.json(dbUserData);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) =>{
    // destroy() combines params for looking up and deleting data
    // equivalent to SQL's DELETE users WHERE id = 1
    User.destroy({
        where: {
            id: req.params.id
        }
    })
      .then(dbUserData => {
          if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id!'});
              return;
          }
          res.json(dbUserData);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});



module.exports = router;