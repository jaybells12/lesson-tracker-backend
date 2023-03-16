import { Model } from "mongoose"

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

export interface IName {
  first: string;
  last: string;
}

export interface IStudent {
  name: IName;
  dob: Date;
  progress: Map<string, string>;
  fullname: string;
}

export interface IUser {
  username: string;
  password: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<Boolean>;
}

export type UserModel = Model<IUser, {}, IUserMethods>