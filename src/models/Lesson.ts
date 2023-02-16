import { Schema, model } from 'mongoose';

// TypeScript Interfaces
interface ILesson {
  name: string;
  area: string;
  section: string;
  group?: string;
}

// Mongoose Schemas
const lessonSchema = new Schema<ILesson>({
  name: {
    type: String,
    cast: false,
    trim: true,
    lowercase: true,
    required: [true, "Lesson: Missing {PATH}."],
    unique: true,
  },
  area: {
    type: String,
    cast: false,
    trim: true,
    lowercase: true,
    required: [true, "Lesson: Missing {PATH}."]
  },
  section: {
    type: String,
    cast: false,
    trim: true,
    lowercase: true,
    required: [true, "Lesson: Missing {PATH}."]
  },
  group: {
    type: String,
    cast: false,
    trim: true,
    lowercase: true
  }
})

// Mongoose Model
const Lesson = model<ILesson>("Lesson", lessonSchema);

// Export
module.exports = { Lesson }