export interface IStudentProgress {
  students: {
    [studentId: string]: Map<string, string>
  }
}