import { Request } from "express"

export interface IStudentProgress {
  students: {
    [studentId: string]: Map<string, string>
  }
}

export type UserRequest = Request & { username?: string, role?: number }