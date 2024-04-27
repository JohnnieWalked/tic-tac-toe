import { z } from 'zod';

export const CreateGameSchema = z.object({
  roomname: z
    .string()
    .trim()
    .min(1, { message: 'This field has to be filled.' })
    .max(12, { message: 'Maximum 12 characters.' })
    .regex(/^[a-zA-Z0-9\s]+$/gm, {
      message: 'Allowed only lowercase, uppercase letters, numbers and spaces.',
    }),
  // password: z.string().trim(),
});
