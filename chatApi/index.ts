import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import path from 'node:path';
import mongoose from 'mongoose';
import config from './config';
import mongoDb from './mongoDb';
import usersRouter from './routes/users';
import { WebSocket } from 'ws';
import { IncomingMessages } from './typesDb';
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
  console.log('New client connected. Total clients:', connectedClients.length);
  let token = '';

  const messages = await Message.find().sort({ datetime: -1 }).limit(30);
  console.log(messages)
  ws.send(JSON.stringify({
    type: 'MESSAGES',
    payload: messages,
  }));

  ws.on('message', async (message) => {
    try {
      const decodedMessage = JSON.parse(message.toString()) as IncomingMessages;

      if (decodedMessage.type === 'USER_LOGIN') {
        const user = await User.findOne({ token: decodedMessage.payload });
        if (!user) {
          ws.close();
          return;
        }
        user.isOnline = true;
        await user.save();
        token = user.token;

        const onlineUsers = await User.find({ isOnline: true });
        connectedClients.forEach((client) => {
          client.send(JSON.stringify({
            type: 'USERS',
            payload: onlineUsers,
          }));
        });
      } else if (decodedMessage.type === 'USER_LOGOUT') {
        const user = await User.findOne({ token });
        if (user) {
          user.isOnline = false;
          await user.save();
        }
        ws.close();
      } else if (decodedMessage.type === 'SEND_MESSAGE') {
        if (!token) {
          ws.send(JSON.stringify({ error: 'No token provided' }));
          return;
        }
        const user = await User.findOne({ token });
        if (user) {
          if (!decodedMessage.payload) {
            ws.send(JSON.stringify({ error: 'Message text is missing' }));
            return;
          }

          if (!decodedMessage.payload) {
            ws.send(JSON.stringify({ error: 'Message text is missing' }));
            return;
          }

          const message = new Message({
            user: user._id,
            message: decodedMessage.payload,
            datetime: new Date().toISOString(),
          });


          const savedMessage =  await message.save();
          const populatedMessage = await Message.findById(savedMessage._id).populate('user', 'username role _id');

          connectedClients.forEach((client) => {
            client.send(JSON.stringify({
              type: 'NEW_MESSAGE',
              payload: populatedMessage,
            }));
          });
        }
      }
    } catch (error) {
      console.error('Error handling message:', error);
      ws.close();
    }
  });

  ws.on('close', () => {
    const index = connectedClients.indexOf(ws);
    if (index !== -1) {
      connectedClients.splice(index, 1);
    }
    console.log('Client disconnected. Total clients:', connectedClients.length);
  });
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

  run().catch(e => console.error(e))
