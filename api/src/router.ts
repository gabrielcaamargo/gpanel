import { Router, Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';


export const router = Router();

import User from './useCases/Users';

router.get('/', (request, response) => response.status(200).json({'msg': 'OK'}));

// Users

// Public Routes
router.post('/auth/register', User.createUser);
router.post('/auth/login', User.validateUser);

// Private Routes
function checkToken(request: Request, response: Response, next: NextFunction) {
  const authorizationHeader = request.headers['authorization'];
  const token = authorizationHeader?.split(' ')[1];

  if(!token) {
    return response.status(401).json({'msg': 'Access denied'});
  }

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret!);
    next();
  } catch (error) {
    response.status(400).json({'msg': 'Invalid token'});
  }
}

router.get('/users/:id', checkToken, User.checkUser);
