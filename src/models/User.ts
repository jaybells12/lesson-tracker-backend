import { Schema, model } from 'mongoose';
import { IUser, Role } from '../interfaces/Model-Interfaces'

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    cast: false,
    unique: true,
    required: [true, "Missing required field."],
    minLength: [3, "{PATH} is too short. Minimum length is 3 characters."],
    maxLength: [16, "{PATH} is too long. Maximum length is 16 characters."],
  },
  // need to implement password hashing
  password: {
    type: String,
    cast: false,
    required: [true, "Missing required field."],
  },
  // need to consider email validation methods. 
  email: {
    type: String,
    cast: false,
    unique: true,
    required: [true, "Missing required field."]
  },
  role: {
    type: String,
    cast: false,
    uppercase: true,
    enum: Role,
    required: [true, "Missing required field."]
  }
},  { timestamps: true })

export const User = model<IUser>("User", userSchema);