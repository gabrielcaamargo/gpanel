import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User';


class Users {
  async createUser(request: Request, response: Response) {
    const {name, email, username, password, confirmPassword, role} = request.body;

    if(!name) {
      return response.status(422).json({'error': 'Name is required'});
    }


    if(!username) {
      return response.status(422).json({'error': 'Username is required'});
    }

    if(!email) {
      return response.status(422).json({'error': 'Email is required'});
    }


    if(!password) {
      return response.status(422).json({'error': 'Password is required'});
    }


    if(password !== confirmPassword) {
      return response.status(422).json({'error': 'Passwords must be identical'});
    }

    const doesUserExist = await User.findOne({email});

    if(doesUserExist) {
      return response.status(422).json({'error': 'Email already in use'});
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User(
      {
        name,
        email,
        username,
        password: passwordHash,
        role,
      }
    );
    try {
      await user.save();

      response.status(201).json({'msg': 'User successfully created'});
    } catch (error) {
      console.log(error);
      response.status(500).json({'msg': 'Unexpected server error'});
    }

  }

  async validateUser(request: Request, response: Response) {
    const {name, email, username, password, confirmPassword} = request.body;

    if(!email) {
      return response.status(422).json({'error': 'Email is required'});
    }

    if(!password) {
      return response.status(422).json({'error': 'Password is required'});
    }

    const user = await User.findOne({email});

    if(!user) {
      return response.status(404).json({'error': 'User not found'});
    }

    const doesPasswordMatch = await bcrypt.compare(password, user.password);

    if(!doesPasswordMatch) {
      return response.status(404).json({'error': 'Invalid password'});
    }

    try {
      const secret = process.env.SECRET;

      const token = jwt.sign({
        id: user.id
      }, secret!);

      response.status(200).json({'msg': 'Successful authentication', token});

    } catch (error) {
      console.log(error);
      response.status(500).json({'msg': 'Unexpected server error'});
    }
  }

  async checkUser(request: Request, response: Response) {
    const id = request.params.id;

    const user = await User.findById(id, '-password');

    if(!user) {
      return response.status(404).json({'msg': 'User not found'});
    }

    response.status(200).json({ user });
  }
}

export default new Users();
