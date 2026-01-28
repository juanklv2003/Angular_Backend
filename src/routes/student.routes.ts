import { Router } from 'express';
import {
  listStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
} from '../controllers/student.controller';

import { validate } from '../middlewares/validate.middleware';
import {
  createStudentSchema,
  updateStudentSchema,
  listStudentsQuerySchema,
  idParamSchema
} from '../schemas/student.schema';

const router = Router();

router.get('/', validate(listStudentsQuerySchema, 'query'), listStudents);
router.get('/:id', validate(idParamSchema, 'params'), getStudent);

router.post('/', validate(createStudentSchema, 'body'), createStudent);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateStudentSchema, 'body'), updateStudent);

router.delete('/:id', validate(idParamSchema, 'params'), deleteStudent);

export default router;
