import mongoose from "mongoose";
import config from "./config";
import { randomUUID } from "node:crypto";
import User from "./models/User";

const run = async () => {
  await mongoose.connect(config.mongoPath);
  const db = mongoose.connection;

  try {
    await db.dropCollection("users");
  } catch (e) {
    console.log(e, "Collections were not presents, skipping drop");
  }

  await User.create({
      username: "Jane",
      password: "123",
      token: randomUUID(),
      role: "moderator",
    },
    {
      username: "John",
      password: "123",
      token: randomUUID(),
      role: "user",
    });

  await db.close();
};

run().catch(console.error);