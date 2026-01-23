import { Router } from 'express';
import {
  listStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
} from '../controllers/student.controller';

const router = Router();

router.get('/', listStudents); //listar todo
router.get('/:id', getStudent); //listar uno
router.post('/', createStudent); // añadir
router.put('/:id', updateStudent); //editar
router.delete('/:id', deleteStudent); //borrar

export default router;
