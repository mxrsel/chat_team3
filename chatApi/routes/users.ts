import express from "express";
import {Error} from "mongoose";
import User from "../models/User";
import auth, { RequestWithUser } from '../middlewear/auth';

const usersRouter = express.Router();

usersRouter.post('/register', async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    user.generateToken();

    await user.save();
    res.send({user, message: "Registration was successful!"});
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      res.status(400).send(error);
      return;
    }
    next(error);
  }
});

usersRouter.post('/sessions', async (req, res, next) => {
  try {
    const user = await User.findOne({username: req.body.username});

    if (!user) {
      res.status(400).send({error: 'Invalid user name.'});
      return;
    }

    const isMatch = await user.checkPassword(req.body.password);

    if (!isMatch) {
      res.status(400).send({error: 'Invalid password'});
      return;
    }

    user.generateToken();
    await user.save();

    res.send({message: 'You have successfully logged in!', user});

  } catch (error) {
    if (error instanceof Error.ValidationError) {
      res.status(400).send(error);
      return;
    }
    next(error);
  }
});

usersRouter.delete('/sessions', auth, async (req, res, next) => {
  let reqWithAuth = req as RequestWithUser;
  const userFromAuth = reqWithAuth.user;
  try {
    const user = await User.findOne({_id: userFromAuth._id});

    if (user) {
      user.generateToken();
      await user.save();
      res.send({message: 'You have successfully logged out.'});
    }
  } catch (e) {
    next(e);
  }
});

export default usersRouter;