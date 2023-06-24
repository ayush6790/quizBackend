import { Request, Response, NextFunction } from "express";
import User from "../../schemas/User";
import { generateError } from "../config/function";

const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const existUser = await User.findOne({ username: req.body.username });
    if (existUser) {
      throw new Error(`${existUser.username} user is already exists`);
    } else {
      const user = new User({
        username: req.body.username,
        name: req.body.name,
        password: req.body.password,
        role: req.body.role,
        active: true,
      });
      const savedUser = await user.save();
      if (savedUser) {
        return res.status(201).send({
          message: `${savedUser.username} user has been created successfully`,
          data: savedUser,
          statusCode: 201,
          success: true,
        });
      } else {
        res.status(400).json({
          message: `cannot create the user`,
          data: `cannot create the user`,
          statusCode: 400,
          success: false,
        });
      }
    }
  } catch (err) {
    next(err);
  }
};

const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const existUser = await User.findOne({ username: req.body.username });
    if (existUser) {
      const { password, ...rest } = existUser;
      if (password === req.body.password) {
        console.log(existUser)
        return res.status(200).send({
          message: `${existUser.username} user has been login successfully`,
          data: existUser,
          statusCode: 200,
          success: true,
        });
      } else {
        throw generateError(`Invalid username and password`, 400);
      }
    } else {
      throw generateError(`${req.body.username} user does not exists`, 401);
    }
  } catch (err) {
    next(err);
  }
};

export { createUser, loginUser };
