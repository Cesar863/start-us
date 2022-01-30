const router = require("express").Router();
const {
  Developer,
  User,
  Response,
  Service
} = require("../../models");

// get all developers
router.get("/", (req, res) => {
  User.findAll({
      attributes: {
        exclude: ["password"],
      },
    })
    .then((dbMemberData) => res.json(dbMemberData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  User.findOne({
      attributes: {
        exclude: ["password"],
      },
      where: {
        id: req.params.id,
      },
      include: [{}],
    })
    .then((dbMemberData) => res.json(dbMemberData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
  User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    })
    .then((dbMemberData) => {
      req.session.save(() => {
        req.session.user_id = dbMemberData.id;
        req.session.username = dbMemberData.username;
        req.session.loggedIn = true;

        res.json(dbMemberData);
      });
    })
    .then((dbMemberData) => res.json(dbMemberData))
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
    .then(dbMemberData => {
      if (!dbMemberData) {
        res.status(404).json({
          message: 'No user found with this id'
        });
        return;
      }
      res.json(dbMemberData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
  User.destroy({
      where: {
        id: req.params.id,
      },
    })
    .then((dbMemberData) => {
      if (!dbMemberData) {
        res.status(404).json({
          message: "No user found with this id"
        });
        return;
      }
      res.json(dbMemberData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
