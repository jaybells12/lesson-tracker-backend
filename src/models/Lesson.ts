import { Schema, model } from "mongoose";
import { ILesson } from "../interfaces/Model-Interfaces.js";

/*
* Mongoose Schemas
* Had to modify schematypes.d.ts in mongoose/types, in the "class SchemaTypeOptions<T>"
* "cast" was set only to string, changed to "string | boolean" to allow mongoose disable casting
* for a single path - https://thecodebarbarian.com/whats-new-in-mongoose-5-11-custom-casting-for-paths.html
*/

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