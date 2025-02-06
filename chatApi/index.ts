import express from 'express';
import cors from 'cors';
import path from "node:path";
import * as mongoose from 'mongoose';
import config from './config';
import mongoDb from './mongoDb';

const app = express();
const port = 8000;
const router = express.Router();

app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname,'public')));
app.use(router);

router.ws('/chat', (ws, res) => {
    console.log('client connected');
});

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