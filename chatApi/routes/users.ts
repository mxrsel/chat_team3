import express from "express";
import User from "../models/User";
import { Error } from "mongoose";
import auth from "../middlewear/auth";
import { RequestWithUser } from "../middlewear/auth";


const usersRouter = express.Router();

usersRouter.post("/register", async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
    user.generateToken();
    await user.save();
    res.send({ user, message: "Register successfully" });
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      res.status(400).send(error);
      return;
    }
    next(error);
  }
});

usersRouter.post("/sessions", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    res.status(400).send({ error: "Username not found" });
    return;
  }
  const isMatch = await user.checkPassword(req.body.password);
  if (!isMatch) {
    res.status(400).send({ error: "Password is wrong" });
    return;
  }
  user.generateToken();
  await user.save();
  res.send({ message: "Username and password correct!", user });
});

usersRouter.delete("/sessions", auth, async (req, res, next) => {
  const reqWithAuth = req as RequestWithUser;
  const userFromAuth = reqWithAuth.user;
  try {
    const user = await User.findOne({ _id: userFromAuth._id });
    if (user) {
      user.generateToken();
      await user.save();
    }
    res.send({
      message: "Success logout",
    });
  } catch (e) {
    next(e);
  }
});


export default usersRouter;
