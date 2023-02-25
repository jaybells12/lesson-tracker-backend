import { Schema, model, Types, Error } from 'mongoose';
import { IName, IStudent } from '../interfaces/Model-Interfaces'

// Mongoose Schemas
// Had to modify schematypes.d.ts in mongoose/types, in the "class SchemaTypeOptions<T>"
// "cast" was set only to string, changed to "string | boolean" to allow mongoose disable casting
// for a single path - https://thecodebarbarian.com/whats-new-in-mongoose-5-11-custom-casting-for-paths.html
const nameSchema = new Schema<IName>({
  first: {
    type: String,
    cast: false,
    trim: true,
    lowercase: true,
    required: [true, "Missing required field."],
    minLength: [2, "{PATH} name is too short. Minimum length is 2 characters."],
    maxLength: [16, "{PATH} name is too long. Maximum length is 16 characters."],
  },
  last: {
    type: String,
    cast: false,
    trim: true,
    lowercase: true,
    required: [true, "Missing required field."],
    minLength: [2, "{PATH} name is too short. Minimum length is 2 characters."],
    maxLength: [16, "{PATH} name is too long. Maximum length is 16 characters."],
  }
}, { _id: false, id: false })

const studentSchema = new Schema<IStudent>({
  name: {
    type: nameSchema,
    required: [true, "Missing required field."]
  },
  dob: {
    type: Date,
    cast: false,
    required: [true, "Missing required field."],
  },
  progress: {
    type: Map,
    of: {
      type: String,
      cast: false,
      uppercase: true,
      match: [/I|P|M|N/, "{VALUE} is not a valid value for {PATH}."]
    },
    default: () => ({})
  }
});

// Middleware to validate Object IDs - Two main parts
// First - use built in validator, however certain invalid strings can still pass,
// Second - cast found Id string to Object Id, back to string, if the recast string and the found string match, then it's a valid ID; 
studentSchema.pre(['findOneAndUpdate', 'updateMany'], function(next) {
  const updateObj = this.getUpdate()
  if(updateObj && '$set' in updateObj){
    for( let key in updateObj.$set){
      let results = key.split('.');
      if( results[0] === 'progress'){
        const err = new Error.ValidationError(
          new Error.ValidatorError({
            message: "Unable to cast key as ObjectId",
            path: key,
            value: results[1]
          })
        )
        if(!(Types.ObjectId.isValid(results[1]))){
          return next(err);
        }else if(!((String)(new Types.ObjectId(results[1])) === results[1])){
          return next(err);
        }
      }
    }
  }
  next();
})

export const Student = model<IStudent>("Student", studentSchema);