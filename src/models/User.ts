import mongoose, { Schema, model} from "mongoose";
import { IUser, IUserMethods, UserModel, Role } from "../interfaces/Model-Interfaces"
import bcrypt from "bcrypt";

/*
* Mongoose Schemas
* Had to modify schematypes.d.ts in mongoose/types, in the "class SchemaTypeOptions<T>"
* "cast" was set only to string, changed to "string | boolean" to allow mongoose disable casting
* for a single path - https://thecodebarbarian.com/whats-new-in-mongoose-5-11-custom-casting-for-paths.html
*/

const SALT_WORK_FACTOR = 10;

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
  },
  refreshToken: {
    type: String,
    cast: false,
  }
}, { timestamps: true })

userSchema.methods.comparePassword = function(candidatePassword){
  return bcrypt.compare(candidatePassword, this.password)
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