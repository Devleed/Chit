const express = require('express');

const verifyToken = require('../middlewares/verify-token');
const User = require('../models/User');

const router = express.Router();

router.get('/search/:username', verifyToken, async (req, res) => {
  try {
    const result = await User.findOne({ username: req.params.username }).select(
      'firstname lastname gender'
    );

    if (!result) return res.json({ msg: 'no user found' });

    if (JSON.stringify(result._id) === JSON.stringify(req.user._id))
      return res.json({ msg: 'thats you ..!!' });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('internal server error');
  }
});

module.exports = router;
