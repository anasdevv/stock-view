'use client';
import { AuthForm, Credentials } from '@/components/forms/Auth';
import { useToast } from '@/components/ui/use-toast';
import { auth } from '@/firebase.config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function page() {
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
    setError({
      email: '',
      password: '',
      root: '',
    });
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log('User signed in:', userCredential.user);
      toast({
        title: 'Signed In!',
      });
      router.push('/');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError((prev) => ({
          ...prev,
          email: 'No user found with this email.',
        }));
      } else if (err.code === 'auth/wrong-password') {
        setError((prev) => ({
          ...prev,
          password: 'Incorrect password.',
        }));
      } else if (err.code === 'auth/invalid-email') {
        setError((prev) => ({
          ...prev,
          email: 'The email address is not valid.',
        }));
      } else {
        setError((prev) => ({
          ...prev,
          root: 'An unexpected error occurred. Please try again later.',
        }));
      }
      console.error('Error logging in:', err.code);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className='lg:p-8'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <div className='flex flex-col space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight text-violet-400'>
            Login to your account
          </h1>
        </div>
        <AuthForm
          serverError={error}
          isLoading={isLoading}
          type='login'
          onSubmit={(credentials) => {
            handleSubmit(credentials);
          }}
        />
        <p className='text-gray-400 text-center'>
          Dont't have an account ?
          <Link className='pl-4 font-bold underline' href={'/auth/signup'}>
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
