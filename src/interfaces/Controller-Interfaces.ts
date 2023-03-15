export interface IStudentProgress {
  students: {
    [studentId: string]: Map<string, string>
  }
}


export type IRoles = "ADMIN" | "DIRECTOR" | "GUIDE" | "PARENT";