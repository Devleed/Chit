const express = require('express');

const verifyToken = require('../middlewares/verify-token');
const User = require('../models/User');
const { findByIdAndUpdate } = require('../models/User');

const router = express.Router();

router.get('/search/:username', verifyToken, async (req, res) => {
  try {
    const result = await User.findOne({ username: req.params.username }).select(
      'firstname lastname gender avatar'
    );

    if (!result) return res.json({ msg: 'no user found' });

    if (JSON.stringify(result._id) === JSON.stringify(req.user._id))
      return res.json({ msg: 'thats you ..!!' });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: 'internal server error' });
  }
});

router.post('/set/email', verifyToken, async (req, res) => {
  console.log('email was set by user');

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          email: req.body.email
        }
      },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: 'internal server error' });
  }
});

router.post('/set/avatar', verifyToken, async (req, res) => {
  console.log('email was set by user');

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          avatar: req.body.avatar
        }
      },
      { new: true }
    );

    console.log(user);

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: 'internal server error' });
  }
});

module.exports = router;
