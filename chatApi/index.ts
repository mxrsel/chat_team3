import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import path from 'node:path';
import mongoose from 'mongoose';
import config from './config';
import mongoDb from './mongoDb';
import usersRouter from './routes/users';
import { WebSocket } from 'ws';
import { Online } from './typesDb';
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

const activeConnections: {[id: string]: WebSocket;} = {};
const usersOnline: Online[] = [];

router.ws('/chat', async (ws, _res) => {
  const id = crypto.randomUUID();
  activeConnections[id] = ws;

  const messages = await Message.find().sort({datetime: -1}).populate('user', 'username role _id').limit(30);

  ws.send(
    JSON.stringify({
      type: 'LOGIN',
      payload: messages,
    })
  );

  ws.on('message', async (message) => {
    try {
      const decodedMessage = JSON.parse(message.toString());

      if (decodedMessage.type === 'NEW_USER') {

        const user = await User.findById({_id: decodedMessage.id});

        if (!user) {
          ws.close();
          return;
        }

        if (usersOnline.find(user => user._id === decodedMessage.id)) {
          return;
        }

        usersOnline.push({
          _id: id,
          username: user.username,
        });

        Object.values(activeConnections).forEach((connection) => {
          connection.send(JSON.stringify({
            type: 'SET_ONLINE_USERS',
            payload: usersOnline,
          }));
        });
      }

      if (decodedMessage.type === 'NEW_MESSAGE') {

        const newMessage = new Message({
          user: decodedMessage.payload.user,
          message: decodedMessage.payload.message,
        });

        await newMessage.save();

        const message = await Message.findOne({_id: newMessage._id.toString()}).populate('user', 'username');

        Object.values(activeConnections).forEach((connection) => {
          connection.send(JSON.stringify({
            type: 'NEW_MESSAGE',
            payload: message,
          }));
        });
      }
      else if (decodedMessage.type === 'DELETE_MESSAGE') {
        await Message.deleteOne({_id: decodedMessage.payload});
        const updatedMessages = await Message.find().sort({datetime: -1}).populate('user', 'username role _id').limit(30);

        Object.values(activeConnections).forEach((connection) => {
          connection.send(JSON.stringify({
            type:'UPDATE_MESSAGE',
            payload: updatedMessages,
          }));
        });
      }
    } catch (e) {
      ws.send(JSON.stringify({error: 'Invalid message format'}));
    }

    ws.on('close', () => {
      const userLogout = Object.keys(activeConnections).find((key) => activeConnections[key] === ws);

      if (userLogout) {
        delete activeConnections[userLogout];

        const updatedOnlineUsers = usersOnline.filter(user => user._id !== userLogout);
        usersOnline.length = 0;
        usersOnline.push(...updatedOnlineUsers);

        Object.values(activeConnections).forEach((connection) => {
          connection.send(JSON.stringify({
            type: 'SET_ONLINE_USERS',
            payload: usersOnline,
          }));
        });
      }
    });
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
};

run().catch(e => console.error(e));