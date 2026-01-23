import { Request, Response } from 'express';
import * as studentService from '../services/student.service';

export const listStudents = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    const students = await studentService.getStudents(search);
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving students' });
  }
};

export const getStudent = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const student = await studentService.getStudentById(id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch {
    res.status(500).json({ message: 'Error retrieving student' });
  }
};
//post
export const createStudent = async (req: Request, res: Response) => {
  try {
    const { name, email, age } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const id = await studentService.createStudent(name, email, age);
    res.status(201).json({ id });
  } catch {
    res.status(500).json({ message: 'Error creating student' });
  }
};
//put 
//body---> datos
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, email, age } = req.body;

    const updated = await studentService.updateStudent(id, name, email, age);

    if (!updated) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student updated' });
  } catch {
    res.status(500).json({ message: 'Error updating student' });
  }
};
//delete
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await studentService.deleteStudent(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted' });
  } catch {
    res.status(500).json({ message: 'Error deleting student' });
  }
};
