import { Schema, model } from 'mongoose';
import { ILesson } from '../interfaces/Model-Interfaces.js';

const lessonSchema = new Schema<ILesson>({
  name: {
    type: String,
    cast: false,
    trim: true,
    lowercase: true,
    required: [true, "Missing required field."],
    unique: true,
  },
  area: {
    type: String,
    cast: false,
    trim: true,
    lowercase: true,
    required: [true, "Missing required field."]
  },
  section: {
    type: String,
    cast: false,
    trim: true,
    lowercase: true,
    required: [true, "Missing required field."]
  },
  group: {
    type: String,
    cast: false,
    trim: true,
    lowercase: true
  }
})

export const Lesson = model<ILesson>("Lesson", lessonSchema);