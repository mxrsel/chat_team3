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

const activeConnections:{[key: string]: WebSocket} = {};
let userOnline: Online[] = [];
let userData: Online;
const connectedClients: WebSocket[] = [];

router.ws('/chat', async (ws, _res) => {
  const id = crypto.randomUUID();
  activeConnections[id] = ws;
  connectedClients.push(ws);
  let token = '';

  const messages = await Message.find().sort({datetime: -1}).populate('user', 'username role _id').limit(30);

  ws.send(JSON.stringify({
    type: 'LOGIN_USER',
    payload: messages,
  }));

  ws.on('message', async (message) => {
    try {
      const decodedMessage = JSON.parse(message.toString());

      if (decodedMessage.type === 'NEW_USER') {

        const user = await User.findById({ _id: decodedMessage.id });

        if (!user) {
          ws.close();
          return;
        }

        const newUser = {
          _id: id,
          username: user.username,
        };

        userOnline.push(newUser);
        userData = newUser;

        Object.values(activeConnections).forEach((connection) => {
          const outgoingMessage = { type: 'SET_ONLINE_USERS', payload: userOnline };
          connection.send(JSON.stringify(outgoingMessage));
        });
      } else if (decodedMessage.type === 'NEW_MESSAGE') {

        const message = {
          user: decodedMessage.payload.user,
          message: decodedMessage.payload.message,
        };

        const saveMessage = new Message(message);
        await saveMessage.save();

        const messageById = await Message.findOne({ _id: saveMessage._id.toString() }).populate('user', 'username');

        Object.values(activeConnections).forEach((connection) => {
          const outgoingMessage = { type: 'NEW_MESSAGE', payload: messageById };
          connection.send(JSON.stringify(outgoingMessage));
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
  ws.on('close', () => {
    userOnline = userOnline.filter((user) => user !== userData);
    Object.values(activeConnections).forEach((connection) => {
      const outgoingMessage = { type: 'SET_ONLINE_USERS', payload: userOnline };
      connection.send(JSON.stringify(outgoingMessage));
    });

    delete activeConnections[id];
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

run().catch(e => console.error(e));