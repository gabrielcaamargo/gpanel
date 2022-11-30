import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const User = mongoose.model('User', new Schema({
  _id: {
    type: String,
    default: uuidv4()
  },
  name: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ['ROOT', 'ADMIN', 'USER'],
    required: true
  }
}));

export default User;
