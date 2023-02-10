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
    unique: true,
    required: [true, "User: Missing {PATH}"],
    minLength: [3, "User: {PATH} is too short. Must be at least 3 characters."],
    maxLength: [16, "User: {PATH} is too long. Must be at most 16 characters."],

  },
  password: {
    type: String,
    required: [true, "User: Missing {PATH}"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "User: Missing {PATH}"]
  },
  role: {
    type: String,
    enum: Role,
    required: [true, "User: Missing {role}"]
  }
},  { timestamps: true })

// Mongoose Model
const User = model<IUser>("User", userSchema);

// Export
export default User;