import { Schema, model } from 'mongoose';
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
    required: [true, "Name: Missing {PATH} name."],
    minLength: [2, "Name: {PATH} name is too short. Minimum length is 2 characters."],
    maxLength: [16, "Name: {PATH} name is too long. Maximum length is 16 characters."],
  },
  last: {
    type: String,
    cast: false,
    trim: true,
    lowercase: true,
    required: [true, "Name: Missing {PATH} name."],
    minLength: [2, "Name: {PATH} name is too short. Minimum length is 2 characters."],
    maxLength: [16, "Name: {PATH} name is too long. Maximum length is 16 characters."],
  }
}, { _id: false, id: false })

// const lessonProgressSchema = new Schema<ILessonProgress>({
//     lesson: {
//       type: Schema.Types.ObjectId,
//       required: [true, "Lesson Progress: Missing {PATH} ID."]
//     },
//     status: {
//       type: String,
//       cast: false,
//       required: [true, "Lesson Progress: Missing {PATH}."],
//       uppercase: true,
//       match: [/I|P|M|N/, "Lesson Progress: {VALUE} is not a valid value for {PATH}."]

//     },
// }, { _id: false, id: false })

const studentSchema = new Schema<IStudent>({
  name: {
    type: nameSchema,
    // default: () => ({}),
    required: [true, "Student: Missing {PATH}."]
  },
  dob: {
    type: Date,
    cast: false,
    required: [true, "Student: Missing {PATH}."],
  },
  progress: {
    type: Map,
    of: {
      type: String,
      cast: false,
      uppercase: true,
      match: [/I|P|M|N/, "Lesson Progress: {VALUE} is not a valid value for {PATH}."]
    },
    default: () => ({})
  }
});

// Mongoose Model
export const Student = model<IStudent>("Student", studentSchema);

// // Export
// module.exports = { Student }