const express = require('express');
const cloudinary = require('cloudinary');

const router = express.Router();

router.get('/avatars', async (req, res) => {
  try {
    const result = await cloudinary.v2.api.resources({
      type: 'upload',
      prefix: 'chat app/avatars',
      max_results: 50
    });
    res.json(result.resources);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'internal server error' });
  }
});

module.exports = router;
