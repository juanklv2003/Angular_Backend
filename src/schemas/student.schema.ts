import { z } from 'zod';

export const listStudentsQuerySchema = z.object({
  search: z.string().trim().min(1).max(60).optional()
});

export const createStudentSchema = z.object({
  name: z.string().trim().min(2, 'Nombre mínimo 2 caracteres').max(60),
  email: z.string().trim().email('Email no válido').max(255),
  age: z.coerce.number().int().min(0).max(120).optional().default(0)
});

export const updateStudentSchema = createStudentSchema; // mismos campos

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive()
});
