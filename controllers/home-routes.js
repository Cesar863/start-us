const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Service } = require('../models');

router.get('/', (req, res) => {
    Service.findAll({
        attributes: [
            'id',
            'service_title',
            'service_type',
            'service_description',
            'budget',
            'user_id'
            //[sequelize.literal('(SELECT COUNT(*) FROM user WHERE user.id')]
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbServiceData => {
        const services = dbServiceData.map(post => post.get({ plain: true }));
        res.render('homepage', {
            services,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/user', (req, res) => {
    Service.findAll({
        attributes: [
            'id',
            'service_title',
            'service_type',
            'service_description',
            'budget',
            'user_id'
            //[sequelize.literal('(SELECT COUNT(*) FROM user WHERE user.id')]
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbServiceData => {
        const services = dbServiceData.map(post => post.get({ plain: true }));
        res.render('homepage', {
            services,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
//added line 70 id: req.params.id and change service to findOne
router.get('/service/:id', (req, res) => {
    Service.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'service_title',
            'service_type',
            'service_description',
            'budget',
            'user_id',
            // sequielize data
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbServiceData => {
        if (!dbServiceData) {
            res.status(404).json({ message: 'No post found with that ID' });
            return;
        }
        const service = dbServiceData.get({ plain: true });
        res.render('single-service', {
            post,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});


module.exports = router;
