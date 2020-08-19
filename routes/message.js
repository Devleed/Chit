const express = require('express');
const mongoose = require('mongoose');
const verifyToken = require('../middlewares/verify-token');

const router = express.Router();

// require desired models
const Message = require('../models/Message');
const User = require('../models/User');

// helper which returns condition query
const getConditionQuery = id => ({ $eq: ['$sender', id] });

// helper which returns object id
const getObjectId = id => mongoose.Types.ObjectId(id);

// ? ======= GET CHATLIST ROUTE
/**
 * - chat list route
 * - private
 */
router.get('/chats', verifyToken, async (req, res) => {
  try {
    const messages = await Message.aggregate([
      // * match for messages recieved or sent by logged in user
      {
        $match: {
          $or: [
            { sender: getObjectId(req.user._id) },
            { reciever: getObjectId(req.user._id) }
          ]
        }
      },
      // * group by ( if sender is logged in user then by reciever ) respectively
      {
        $group: {
          _id: {
            $cond: {
              if: getConditionQuery(req.user._id),
              then: '$reciever',
              else: '$sender'
            }
          },
          // * also attach the last message of the conversation
          message: {
            $last: {
              sentBy: '$sender',
              body: '$body',
              date: '$date',
              status: '$status',
              media: '$media',
              _id: '$_id'
            }
          }
        }
      },
      // * populate the field
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      // * project the fields
      {
        $project: {
          'user.firstname': 1,
          'user.lastname': 1,
          'user.gender': 1,
          'user._id': 1,
          'user.register_date': 1,
          'user.avatar': 1,
          message: 1,
          _id: 0
        }
      }
    ]);

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send('internal server error');
  }
});

// ? test accounts
// * 5f2155750aba9c2884dfebe3
// * 5f21811641448d13472b9e5c

// ? ======= GET CHAT BETWEEN TWO USERS
/**
 * - gets chat between two users route
 * - private
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const messages = await Message.aggregate([
      {
        $match: {
          // $and: [
          //   {
          //     $or: [{ sender: req.params.id }, { sender: req.user._id }]
          //   },
          //   {
          //     $or: [{ reciever: req.params.id }, { reciever: req.user._id }]
          //   }
          // ],
          // * =================================================================
          /**
           * sender: <visited user id> && reciever: <logged user id>
           * ||
           * reciever: <visited user id> && sender: <logged user id>
           */
          $or: [
            {
              $and: [
                { sender: getObjectId(req.params.id) },
                { reciever: getObjectId(req.user._id) }
              ]
            },
            {
              $and: [
                { reciever: getObjectId(req.params.id) },
                { sender: getObjectId(req.user._id) }
              ]
            }
          ]
        }
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: '%m-%d-%Y',
                date: { $toDate: '$date' }
              }
            },
            user: {
              $cond: {
                if: getConditionQuery(req.user._id),
                then: '$reciever',
                else: '$sender'
              }
            }
          },
          messages: {
            $push: {
              sentBy: {
                $cond: {
                  if: getConditionQuery(req.user._id),
                  then: req.user._id,
                  else: '$sender'
                }
              },
              body: '$body',
              date: '$date',
              status: '$status',
              media: '$media',
              _id: '$_id'
            }
          }
        }
      },
      { $sort: { '_id.date': -1 } },
      {
        $group: {
          _id: '$_id.user',
          messagesByDate: {
            $push: {
              date: '$_id.date',
              messages: '$messages'
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          'user.firstname': 1,
          'user.lastname': 1,
          'user.gender': 1,
          'user.register_date': 1,
          'user.username': 1,
          'user._id': 1,
          'user.avatar': 1,
          _id: 0,
          messagesByDate: 1
        }
      }
    ]);

    if (messages.length === 0) {
      messages.push({
        messagesByDate: [],
        user: await User.findById(req.params.id)
      });
    }

    res.json(messages[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'internal server error ' });
  }
});

router.put('/read/:id', verifyToken, async (req, res) => {
  try {
    await Message.update(
      {
        $and: [
          { sender: req.params.id },
          { reciever: req.user._id },
          { status: 0 }
        ]
      },
      {
        $set: { status: 2 }
      },
      { new: true }
    );

    const messages = await Message.find({
      $and: [{ sender: req.params.id }, { reciever: req.user._id }]
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'internal server error ' });
  }
});

// ! testing purpose only
router.post('/:id', verifyToken, async (req, res) => {
  const { messageBody } = req.body;
  try {
    const message = await new Message({
      sender: req.user._id,
      reciever: req.params.id,
      body: messageBody
    }).save();

    await Message.populate(message, {
      path: 'reciever',
      select: 'firstname lastname username'
    });

    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).send('internal server error');
  }
});

module.exports = router;
