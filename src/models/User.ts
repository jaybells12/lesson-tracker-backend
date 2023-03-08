import mongoose, { Schema, model, Model } from 'mongoose';
import { IUser, IUserMethods, Role } from '../interfaces/Model-Interfaces'
import bcrypt from "bcrypt";

const SALT_WORK_FACTOR = 10;

type UserModel = Model<IUser, {}, IUserMethods>

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  username: {
    type: String,
    cast: false,
    unique: true,
    required: [true, "Missing required field."],
    minLength: [3, "{PATH} is too short. Minimum length is 3 characters."],
    maxLength: [16, "{PATH} is too long. Maximum length is 16 characters."],
  },
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
}, { timestamps: true })


//Callback accepts two parameters, either error object or null & boolean value
userSchema.methods.comparePassword = function(candidatePassword, callback){
  bcrypt.compare(candidatePassword, this.password, function(err, results){
    if(err) return callback(err);
    callback(null, results);
  })
}

//Password Hashing with Length Validation Middleware (Save)
userSchema.pre('save', function(next){
  const user = this;

  if(!user.isModified('password')) return next();

  if(user.password.length < 10) {
    return next(new mongoose.Error.ValidatorError({
      message: "Password length is too short. Minimum length is 10 characters.",
      path: 'password',
      reason: 'Invalid length'
    }))
  }

  bcrypt.hash(user.password, SALT_WORK_FACTOR, function(err, hash){
    if(err) return next(err)
    user.password = hash;
    next()
  })
})

//Password Hashing with Length Validation Middleware (Update)
userSchema.pre('findOneAndUpdate', function(next) {
  const updateObj = this.getUpdate();

  if(!updateObj || !('password' in updateObj)) return next()

  if(updateObj.password.length < 10) {
    return next(new mongoose.Error.ValidatorError({
      message: "Password length is too short. Minimum length is 10 characters.",
      path: 'password',
      reason: 'Invalid length'
    }))
  }

  bcrypt.hash(updateObj.password, SALT_WORK_FACTOR, function(err, hash){
    if(err) return next(err)
    updateObj.password = hash;
    next();
  })
})

export const User = model<IUser, UserModel>("User", userSchema);