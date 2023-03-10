import { Schema, model, Types } from "mongoose";
import { IName, IStudent } from "../interfaces/Model-Interfaces"

/*
* Mongoose Schemas
* Had to modify schematypes.d.ts in mongoose/types, in the "class SchemaTypeOptions<T>"
* "cast" was set only to string, changed to "string | boolean" to allow mongoose disable casting
* for a single path - https://thecodebarbarian.com/whats-new-in-mongoose-5-11-custom-casting-for-paths.html
*/

const nameSchema = new Schema<IName>({
  first: {
    type: String,
    cast: false,
    trim: true,
    lowercase: true,
    required: [true, "Missing required field."],
    minLength: [2, "{VALUE} is too short. Minimum length is 2 characters."],
    maxLength: [16, "{VALUE} is too long. Maximum length is 16 characters."],
  },
  last: {
    type: String,
    cast: false,
    trim: true,
    lowercase: true,
    required: [true, "Missing required field."],
    minLength: [2, "{VALUE} is too short. Minimum length is 2 characters."],
    maxLength: [16, "{VALUE} is too long. Maximum length is 16 characters."],
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
      match: [/I|N|P|M/, "Invalid value: {VALUE}"]
    },
    validate: { 
      validator: function(input: Map<string, string>){
        for(let [key] of input){
          if(!(Types.ObjectId.isValid(key)) || !((String)(new Types.ObjectId(key)) === key)){
            return false;
          }
        }
        return true;
      },  
      message: "Invalid key."
    },
    default: () => (new Map())
  }
}, {virtuals: {
  fullname: {
    get (this: IStudent) {
      let first: string = this.name.first[0].toUpperCase() + this.name.first.substring(1)
      let last: string = this.name.last[0].toUpperCase() + this.name.last.substring(1)
      return `${first} ${last}`
    } 
  }
}, toJSON:{virtuals: true}, toObject:{virtuals:true}});

export const Student = model<IStudent>("Student", studentSchema);