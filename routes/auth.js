const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const util = require('util');
const verifyToken = require('../middlewares/verify-token');

const router = express.Router();

// * requiring models
const User = require('../models/User');

// * promisifying jwt.sign method for clear code
jwt.sign = util.promisify(jwt.sign);

// * helper to generate token
const generateToken = async id => {
  try {
    const token = await jwt.sign({ id }, process.env.JWT_SECRET);
    return token;
  } catch (err) {
    return err;
  }
};

// ? ======= REGISTER ROUTE
/**
 * - Register route
 * - public
 */
router.post('/register', async ({ body }, res) => {
  // raw json user body
  const userBody = {
    firstname: body.firstname,
    lastname: body.lastname,
    username: body.username,
    gender: body.gender,
    avatar: body.avatar
  };

  try {
    // check existing user
    if (await User.findOne({ username: userBody.username }))
      return res.status(403).send({
        register: { username: 'user already exists with that username' }
      });

    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    // creating and saving user
    const {
      id,
      firstname,
      lastname,
      username,
      gender,
      register_date,
      avatar
    } = await new User({
      ...userBody,
      password: hashedPassword
    }).save();

    // generating token
    const token = await generateToken(id);

    // sending reponse
    res.json({
      token,
      user: {
        _id: id,
        firstname,
        lastname,
        username,
        gender,
        register_date,
        avatar
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('internal server error');
  }
});

// ? ======= LOGIN ROUTE
/**
 * - Login route
 * - public
 */
router.post('/login', async (req, res) => {
  try {
    // necessary stuff
    const { username, password } = req.body;

    // try finding user
    const user = await User.findOne({ username });

    // if not found send err response
    if (!user)
      return res
        .status(401)
        .json({ login: { username: 'no user exists, with that username' } });

    // try comparnig passwords
    const isMatch = await bcrypt.compare(password, user.password);

    // if not matched send err response
    if (!isMatch)
      return res
        .status(401)
        .json({ login: { password: 'wrong password, buddy' } });

    // generate token
    const token = await generateToken(user.id);

    // sending reponse
    res.json({
      token,
      user: {
        _id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        gender: user.gender,
        avatar: user.avatar,
        register_date: user.register_date
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ server: { msg: 'internal server error' } });
  }
});

router.get('/user', verifyToken, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
