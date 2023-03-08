import { Lesson } from "../models/Lesson"
import { Student } from "../models/Student"
import { NextFunction, Request, Response } from "express";
import { IStudent } from "../interfaces/Model-Interfaces";
import { IStudentProgress } from "../interfaces/Controller-Interfaces"

export const updateSingleStudentProgress = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const { id }= req.params;
    const { progress }: { progress: Map<string, string> } = req.body;
    const result =  await updateProgress(id, progress);
    return res.status(200).json(result);
  }catch(err){
    next(err);
  }
}

export const updateMultipleStudentsProgress = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const { students }: IStudentProgress = req.body;
    const results: IStudent[] = []
    for(let studentId in students){
      results.push(await updateProgress(studentId, students[studentId])) 
    }
    return res.status(200).json(results);
  }catch(err){
    next(err);
  }
}

//WORKER: Verify Lesson Exists
const verifyLessonId = async (id: string): Promise<void> => {
  Lesson.exists({_id: id}).orFail()
}

//WORKER: Partial data validation, Sets or Deletes an entry
const updateProgress = async ( id: string, progress: Map<string, string>): Promise<IStudent> => {
  if(!id) throw { name: "QueryError", message: "Missing Student Id."}
  if(!(progress instanceof Map)) throw { name: "SyntaxError", message: "'Progress' value should be of type 'Map'."}
  if(progress.size === 0) throw { name: "QueryError", message: "'Progress' map is empty."}

  const student = await Student.findById(id).orFail();
  for(let [lessonId, lessonFlag] of progress){
    await verifyLessonId(lessonId);
    if(lessonFlag){
      student.progress.set(lessonId, lessonFlag)
    }else{
      student.progress.delete(lessonId);
    }
  }
  return student.save();
}