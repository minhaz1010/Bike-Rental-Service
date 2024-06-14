import { z } from "zod";

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
    phone: z.string(),
    address: z.string(),
    role: z.enum(['user', 'admin']).default('user')
  })
})


export const UserValidations = {
  createUserValidationSchema
}
