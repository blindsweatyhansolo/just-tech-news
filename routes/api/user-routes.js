const router = require('express').Router();
const { User } = require('../../models');

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
        }
    })
      .then(dbUserData => {
          if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id!'});
              return;
          }
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// POST [create] /api/users
router.post('/', (req, res) => {
    // create() is equivalent to SQL's INSERT INTO users (username, email, password) VALUES ('Lerantino', 'learntino@gmail.com', 'password1234')
    // expects {username: 'Lerantino', email: 'learntino@gmail.com', password: 'password1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// PUT [update] /api/users/1
router.put('/:id', (req, res) => {
    // update() combines params for creating and looking up data
    // equivalent to SQL's 
    // UPDATE users SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234" WHERE id = 1
    // if req.body has exact key/value pairs to match the model, you can just use req.body
    User.update(req.body, {
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