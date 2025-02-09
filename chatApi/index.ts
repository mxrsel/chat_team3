import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import path from 'node:path';
import mongoose from 'mongoose';
import config from './config';
import mongoDb from './mongoDb';
import usersRouter from './routes/users';
import { WebSocket } from 'ws';
import { IncomingMessage } from './typesDb';
import User from './models/User';
import Message from './models/Message';

const app = express();
const port = 8000;
const router = express.Router();
expressWs(app);

app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname,'public')));

app.use('/users', usersRouter);

const connectedClients: WebSocket[] = [];

router.ws('/chat', async (ws, _res) => {
  connectedClients.push(ws);
  let token = '';

  const messages = await Message.find().sort({datetime: -1}).populate('user', 'username role _id').limit(30);

  ws.send(JSON.stringify({
    type: 'MESSAGES',
    payload: messages,
  }));

  ws.on('message', async (message) => {
    try {
      const decodedMessage = JSON.parse(message.toString()) as IncomingMessage;

      if (decodedMessage.type === 'USER_LOGIN') {
        token = decodedMessage.payload;

        const user = await User.findOne({token});
        if (user) {
          user.isOnline = true;
          await user.save();
        } else {
          ws.close();
          return;
        }

        const onlineUsers = await User.find({isOnline: true});
        connectedClients.forEach((client) => {
          client.send(JSON.stringify({
            type: 'USERS',
            payload: onlineUsers,
          }));
        });
      } else if (decodedMessage.type === 'USER_LOGOUT') {
        const user = await User.findOne({token});
        if (user) {
          user.isOnline = false;
          await user.save();
        }

        const onlineUsers = await User.find({isOnline: true});
        connectedClients.forEach((client) => {
          client.send(JSON.stringify({
            type: 'USERS',
            payload: onlineUsers,
          }));
        });
      }

      if (decodedMessage.type === 'SEND_MESSAGE') {
        const user = await User.findOne({token});
        if (!user) {
          ws.close();
          return;
        }

        const newMessage = new Message({
          user: user._id,
          message: decodedMessage.payload,
        });

        await newMessage.save();

        const id = newMessage._id.toString();
        const lastMessage = await Message.findOne({_id: id}).populate('user', 'username role _id');

        connectedClients.forEach((clientWS) => {
          clientWS.send(JSON.stringify({
            type: 'NEW_MESSAGE',
            payload: lastMessage,
          }));
        });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      ws.send(JSON.stringify({error: 'Invalid message'}));
    }
  });

  ws.on('close', async () => {
    console.log('Client disconnected');
    const index = connectedClients.indexOf(ws);
    if (index !== -1) {
      connectedClients.splice(index, 1);
    }

    const user = await User.findOne({token});
    if (user) {
      user.isOnline = false;
      await user.save();
    }

    const onlineUsers = await User.find({isOnline: true});
    connectedClients.forEach((client) => {
      client.send(JSON.stringify({
        type: 'USERS',
        payload: onlineUsers,
      }));
    });
  });
});

app.get('/online-users', async(_req, res) => {
  const onlineUsers = await User.find({isOnline: true});
  res.send(onlineUsers);
});

app.use(router);

const run = async () => {
  await mongoose.connect(config.mongoPath);

  app.listen(port, () => {
    console.log(`Server started on port: http://localhost:${port}`);
  });

  process.on('exit', () => {
    mongoDb.disconnect()
  })
}

run().catch(e => console.error(e));