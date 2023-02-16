import { Schema, model } from 'mongoose';

// TypeScript interfaces
enum Role {
  Admin = "ADMIN",
  Director = "DIRECTOR",
  Guide = "GUIDE",
  Parent = "PARENT"
}

interface IUser {
  username: string;
  password: string;
  email: string;
  role: Role;
  created: Date;
}

// Mongoose Schemas
const userSchema = new Schema<IUser>({
  username: {
    type: String,
    cast: false,
    unique: true,
    required: [true, "User: Missing {PATH}."],
    minLength: [3, "User: {PATH} is too short. Minimum length is 3 characters."],
    maxLength: [16, "User: {PATH} is too long. Maximum length is 16 characters."],

  },
  password: {
    type: String,
    cast: false,
    required: [true, "User: Missing {PATH}."],
  },
  // need to consider email validation methods. 
  email: {
    type: String,
    cast: false,
    unique: true,
    required: [true, "User: Missing {PATH}."]
  },
  role: {
    type: String,
    cast: false,
    uppercase: true,
    enum: Role,
    required: [true, "User: Missing {PATH}."]
  }
},  { timestamps: true })

// Mongoose Model
const User = model<IUser>("User", userSchema);

// Export
module.exports = { User }