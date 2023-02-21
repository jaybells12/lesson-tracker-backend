import { Types } from 'mongoose';

export enum Role {
  Admin = "ADMIN",
  Director = "DIRECTOR",
  Guide = "GUIDE",
  Parent = "PARENT"
}

export interface ILesson {
  name: string;
  area: string;
  section: string;
  group?: string;
}

export interface ILessonMap {
  [lessonId: string]: string;
}

export interface IName {
  first: string;
  last: string;
}

export interface IStudent {
  name: IName;
  dob: Date;
  progress: ILessonMap;
}

export interface IUser {
  username: string;
  password: string;
  email: string;
  role: Role;
  created: Date;
}

export interface IProgress {
  lesson: Types.ObjectId;
  students: Types.ObjectId[];
  flag: string;
}

export interface IProgressArray extends Array<IProgress> {}