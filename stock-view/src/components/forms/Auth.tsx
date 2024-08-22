'use client';
import { authSchema } from '@/schema/auth-schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Spinner from '../spinner';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
export type Credentials = z.infer<typeof authSchema>;
interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (credentials: Credentials) => void;
  isLoading?: boolean;
  serverError: {
    email: string;
    password: string;
  };
}
export const AuthForm = ({
  type,
  onSubmit,
  isLoading,
  serverError,
}: AuthFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
  });

  return (
    <div className={cn('grid gap-6')}>
      <div>
        <div className='grid gap-2 gap-y-3'>
          <div className='grid gap-1 text-white gap-y-2'>
            <Label className='' htmlFor='email'>
              Email
            </Label>
            <Input
              id='email'
              placeholder='name@example.com'
              type='email'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              disabled={isLoading}
              {...register('email')}
            />
            {(errors.email?.message || serverError.email) && (
              <p className='text-red-600 text-sm'>
                {errors.email?.message
                  ? errors?.email.message
                  : serverError.email}
              </p>
            )}
          </div>
          <div className='grid gap-1 text-white gap-y-2'>
            <Label className='' htmlFor='email'>
              Password
            </Label>
            <Input
              id='password'
              placeholder='*******'
              type='password'
              autoCapitalize='none'
              autoCorrect='off'
              disabled={isLoading}
              {...register('password')}
            />
            {(errors.password?.message || serverError.password) && (
              <p className='text-red-600 text-sm'>
                {errors.password?.message
                  ? errors.password?.message
                  : serverError.password}
              </p>
            )}
          </div>
          <Button
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
            className=' bg-gradient-to-r from-indigo-400 to-sky-300 py-4 hover:from-indigo-500 hover:to-sky-400'
            // type='submit'
          >
            {isLoading && <Spinner />}

            {type === 'login' ? 'Login' : 'Signup'}
          </Button>
          {errors.root?.message && (
            <p className='text-red-600 text-sm'>{errors.root?.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
