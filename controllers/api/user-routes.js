const router = require("express").Router();
const {
  Developer,
  User,
  Response,
  Service
} = require("../../models");

// get all developers
router.get('/', (req, res) => {
  User.findAll({
      attributes: {
        exclude: ['password'],
      },
    })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get one route
router.get('/:id', (req, res) => {
  User.findOne({
      attributes: {
        exclude: ['password']
      },
      where: {
        id: req.params.id
      }
    })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({
          message: 'No user found with this id'
        });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// create a user
router.post('/', (req, res) => {
  User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      account_type: req.body.account_type
    })
    .then((dbUserData) => {
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.account_type = dbUserData.account_type;
        //req.session.loggedIn = true;

        res.json(dbUserData);
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put('/:id', (req, res) => {
  User.update(req.body, {
      individualHooks: true,
      where: {
        id: req.params.id
      }
    })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({
          message: 'No user found with this id'
        });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
  User.destroy({
      where: {
        id: req.params.id,
      },
    })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({
          message: 'No user found with this id'
        });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
