'use client';

import Link from 'next/link';

import { AuthForm, Credentials } from '@/components/forms/Auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/firebase.config';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<
    Credentials & {
      root?: string;
    }
  >({
    email: '',
    password: '',
    root: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = async ({ email, password }: Credentials) => {
    try {
      setIsLoading(true);
      setError({
        email: '',
        password: '',
        root: '',
      });
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log('User signed up:', userCredential.user);
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Signed In!',
      });
      router.push('/');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        console.log('jhere');
        setError((err) => ({
          ...err,
          email: 'The email address is already in use by another account.',
        }));
      } else if (err.code === 'auth/invalid-email') {
        setError((err) => ({
          ...err,
          email: 'The email address is not valid.',
        }));
      } else if (err.code === 'auth/weak-password') {
        setError((err) => ({
          ...err,
          password: 'The password is too weak.',
        }));
      } else {
        setError((err) => ({
          ...err,
          root: 'An unexpected error occurred. Please try again later.',
        }));
      }
      console.log('error ', err.code);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight text-violet-400'>
              Create an account
            </h1>
          </div>
          <AuthForm
            serverError={error}
            isLoading={isLoading}
            type='signup'
            onSubmit={(credentials) => {
              handleSubmit(credentials);
            }}
          />
          <p className='text-gray-400 text-center'>
            already have an account ?
            <Link className='pl-4 font-bold underline' href={'/auth/login'}>
              Login
            </Link>
          </p>
          <p className='px-8 text-center text-sm text-muted-foreground'>
            By clicking continue, you agree to our{' '}
            <Link
              href='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
