import { config } from 'dotenv';
import express  from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { router } from './router';

mongoose.connect('mongodb://localhost:27017')
  .then(
    () => console.log('Connected to mongo')
  )
  .catch(
    () => console.log('Failed when connecting to mongo')
  );

const app = express();
app.use(router);

app.listen(3000, () => console.log('🎇 Server started at http://localhost:3000'));
