import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(6, {
    message: 'Password must be atleast 6 characters long',
  }),
});
export type IUserLogin = z.infer<typeof authSchema>;
