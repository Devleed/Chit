const cloudinary = require('cloudinary');
const Message = require('../../models/Message');
const User = require('../../models/User');

let onlineUsers = {};

module.exports = io => {
  io.on('connection', socket => {
    console.log('socket connected with id =>', socket.id);

    socket.on('user-online', (user, cb) => {
      socket.user = user;
      onlineUsers[user._id] = socket;
      socket.broadcast.emit('online-users', Object.keys(onlineUsers));
      socket.emit('online-users', Object.keys(onlineUsers));
      cb();
    });
    socket.on('user-offline', async id => {
      delete onlineUsers[id];

      console.log('a user went offline');

      const user = await User.findByIdAndUpdate(
        id,
        { $set: { lastActive: Date.now() } },
        { new: true }
      );

      socket.broadcast.emit('user-lastActive', user);
      socket.broadcast.emit('online-users', Object.keys(onlineUsers));
      socket.emit('online-users', Object.keys(onlineUsers));
    });

    // ? FACTORY FUNCTIONS
    const sendMessage = async ({ messageData, reciever }, cb) => {
      try {
        let messageContent = {
          sender: socket.user._id,
          reciever,
          body: messageData.textBody || '',
          date: Date.now(),
          status: 1
          // scrapedData: messageData.scrapedData
        };
        if (messageData.media) {
          const uploaded = await Promise.all(
            messageData.media.map(async item => {
              return await cloudinary.uploader.upload(item.url, {
                folder: './chat app/',
                use_filename: 'true',
                transformation: [
                  { height: 250, width: 250, gravity: 'auto' },
                  { quality: 'auto' }
                ]
              });
            })
          );

          messageContent.media = uploaded;
        }

        // create and save message in database
        const {
          body,
          sender,
          _id,
          date,
          status,
          media
          // scrapedData
        } = await new Message(messageContent).save();

        let message = {
          sentBy: sender,
          body,
          _id,
          date,
          status,
          media
          // scrapedData
        };

        // check if user's online
        if (onlineUsers.hasOwnProperty(reciever)) {
          console.log('private message emittion from server');
          // send message
          onlineUsers[reciever].emit('private-message', message);
        }

        // call callback
        cb({
          status: 1,
          payload: { ...message, identifier: messageData.identifier }
        });
      } catch (error) {
        cb({ status: 0, payload: error });
      }
    };

    const readMessage = async ({ connectedUser }, cb) => {
      try {
        await Message.updateMany(
          {
            $and: [
              { sender: connectedUser },
              { reciever: socket.user._id },
              { status: 1 }
            ]
          },
          {
            $set: { status: 2 }
          },
          { new: true }
        );

        if (onlineUsers.hasOwnProperty(connectedUser)) {
          onlineUsers[connectedUser].emit('message-read', Date.now());
        }

        cb({ status: 1 });
      } catch (error) {
        cb({ status: 0, payload: error });
      }
    };

    const onTyping = ({ reciever, typing }) => {
      if (onlineUsers.hasOwnProperty(reciever)) {
        onlineUsers[reciever].emit('typing-message', typing);
      }
    };

    // ? SOCKET LISTENERS
    socket.on('private-message', sendMessage);
    socket.on('message-read', readMessage);
    socket.on('typing-message', onTyping);
  });
};
