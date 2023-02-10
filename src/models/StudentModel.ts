import { Schema, model, Types } from 'mongoose';

// TypeScript Interfaces
interface ILessonProgress {
  lesson: Types.ObjectId;
  status: string;
}

interface IStudent {
  name: string;
  dob: Date;
  progress: ILessonProgress[];
}

interface IName {
  first: string;
  last: string;
}

// Mongoose Schemas
const nameSchema = new Schema<IName>({
  first: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, "Name: Missing {PATH} name"],
    minLength: [2, "Name: {PATH} name is too short. Minimum length is 2 characters."],
    maxLength: [16, "Name: {PATH} name is too long. Maximum length is 16 characters"],
  },
  last: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, "Name: Missing {PATH} name"],
    minLength: [2, "Name: {PATH} name is too short. Minimum length is 2 characters."],
    maxLength: [16, "Name: {PATH} name is too long. Maximum length is 16 characters"],
  }
}, { _id: false, id: false })

const lessonProgressSchema = new Schema<ILessonProgress>({
    lesson: {
      type: Schema.Types.ObjectId,
      required: [true, "Lesson Progress: Missing {PATH} ID"]
    },
    status: {
      type: String,
      required: [true, "Lesson Progress: Missing {PATH}"],
      uppercase: true,
      match: [/I|P|M|N/, "Lesson Progress: {VALUE} is not a valid value for {PATH}"]

    },
}, { _id: false, id: false })

const studentSchema = new Schema<IStudent>({
  name: {
    nameSchema,
    required: [true, "Student: Missing {PATH}"],
  },
  dob: {
    type: Date,
    required: [true, "Student: Missing {PATH}"],
  },
  progress: [lessonProgressSchema]
});

// Mongoose Model
const Student = model<IStudent>("Student", studentSchema);

// Export
export default Student;
