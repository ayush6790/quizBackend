import { Request, Response, NextFunction } from "express";
import User from "../../schemas/User";
import { generateError } from "../config/function";
import dotenv from "dotenv";
import {
  UserValidation,
  forgotEmailValidation,
  loginValidation,
  resetPasswordValidation,
} from "./utils/validation";
import generateToken, {
  generateResetPasswordToken,
  verifyResetPasswordToken,
} from "../config/generateToken";
import ResetPasswordToken from "../../schemas/user/ResetPasswordToken";
import SendForgotPasswordMail from "../../services/email/ForgotEmail/Templates/SendMail";
import ResetToken from "../../schemas/user/ResetPasswordToken";
import SendResetPasswordMail from "../../services/email/ResetEmail/Templates/SendMail";

dotenv.config();
const MeUser = async (req: any, res: Response): Promise<any> => {
  return res.status(200).send({
    message: `get successfully data`,
    data: req.bodyData,
    statusCode: 201,
    success: true,
  });
};

const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const result = UserValidation.validate(req.body);
    if (result.error) {
      throw generateError(result.error.details, 422);
    } else {
      const existUser = await User.findOne({ username: req.body.username });
      if (existUser) {
        throw generateError(`${existUser.username} user already exists`, 400);
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
          const { password, ...userData } = savedUser.toObject();
          const responseUser = {
            ...userData,
            authorization_token: generateToken({ userId: savedUser._id }),
          };
          return res.status(201).send({
            message: `${savedUser.username} user has been created successfully`,
            data: responseUser,
            statusCode: 201,
            success: true,
          });
        } else {
          throw generateError(`Cannot create the user`, 400);
        }
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
    const result = loginValidation.validate(req.body);
    if (result.error) {
      throw generateError(result.error.details, 422);
    } else {
      const existUser = await User.findOne({ username: req.body.username });
      if (existUser) {
        const { password, ...userData } = existUser.toObject();
        if (password === req.body.password) {
          const responseUser = {
            ...userData,
            authorization_token: generateToken({ userId: userData._id }),
          };
          return res.status(200).send({
            message: `${existUser.username} user has been logged in successfully`,
            data: responseUser,
            statusCode: 200,
            success: true,
          });
        } else {
          throw generateError(`Invalid username and password`, 400);
        }
      } else {
        throw generateError(`${req.body.username} user does not exists`, 401);
      }
    }
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = forgotEmailValidation.validate(req.body);
    if (result.error) {
      throw generateError(result.error.details, 422);
    } else {
      const user = await User.findOne({ username: req.body.username });
      if (user) {
        const resetData = new ResetPasswordToken({
          userId: user.id,
          token: generateResetPasswordToken(user.id),
        });
        const savedData = await resetData.save();
        if (savedData) {
          const sendMail: any = await SendForgotPasswordMail(
            user.name,
            user.username,
            `${process.env.RESET_PASSWORD_LINK}/${resetData.token}`
          );
          if (sendMail.success) {
            res.status(200).send({
              message: `Link has been send to ${req.body.username} email`,
              data: `Link has been send to ${req.body.username} email`,
              statusCode: 200,
              success: true,
            });
          } else {
            await resetData.deleteOne();
            throw generateError(
              `cannot send the mail please try again later`,
              400
            );
          }
        } else {
          throw generateError(
            `cannot send the mail please try again later`,
            400
          );
        }
      } else {
        throw generateError(`${req.body.username} email does not exists`, 400);
      }
    }
  } catch (err: any) {
    next(err);
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = resetPasswordValidation.validate(req.body);
    if (result.error) {
      throw generateError(result.error.details, 422);
    } else {
      const token = await ResetToken.findOne({ token: req.body.token });
      if (token) {
        const validToken = verifyResetPasswordToken(token.token);
        if (validToken) {
          const user = await User.findByIdAndUpdate(token.userId, {
            $set: { password: req.body.password },
          });
          if (user) {
            await token.deleteOne();
            await SendResetPasswordMail(
              user.name,
              user.username,
              `${process.env.FRONTEND_BASE_URL}`
            );
            res.status(200).send({
              message: `password has been change successfully`,
              data: `password has been successfully`,
              statusCode: 200,
              success: true,
            });
          } else {
            throw generateError(`Invalid token or token has been expires`, 400);
          }
        } else {
          throw generateError(`Invalid token or token has been expires`, 400);
        }
      } else {
        throw generateError(`Invalid token or token has been expires`, 400);
      }
    }
  } catch (err: any) {
    next(err);
  }
};

export { createUser, loginUser, MeUser, forgotPassword, resetPassword };
