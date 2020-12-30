const router = require('express').Router();
let User = require('../model/user.model');

router.route('/').post((req, res) => {
    const newUser = new User({
        username: req.query.username,
        password: req.query.password,
        logorg: parseInt(req.query.logorg)
    });

    User.findOne({username: req.query.username})
    .then((result) => {
        if(result)
        {
            res.status(400);
            res.json('User exists');
        }
        else
        {
            newUser.save()
            .then(() => {
                res.status(200);
                res.json('Sign up successfully.');
            })
            .catch((err) => {
                res.status(400);
                res.json(err);
            });
        }
    })
    .catch((err) => {
        res.status(400);
        res.json(err);
    })
});

router.route('/login').post((req, res) => {
    User.findOne({username: req.query.username})
    .then((result) => {
        if(result && result.password === req.query.password)
        {
            res.status(200);
            res.json({
                status: 'authorized',
                logorg: result.logorg
            });
        }
        else if(result && result.password !== req.query.password)
        {
            res.status(401);
            res.json('Password is not correct.');
        }
        else
        {
            res.status(400);
            res.json('User doesn\'t exist');
        }
    })
    .catch((err) => {
        res.status(400);
        res.json(err);
    })
});

module.exports = router;