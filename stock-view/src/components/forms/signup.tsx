'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCountries } from '@/lib/constants';
import { cn } from '@/lib/utils';
import authService from '@/service/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';
import { z } from 'zod';
import { IUserSignup, signupSchema } from '../../../app/schema/signupSchema';

import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}
// https://flagcdn.com/pt.svg

const COUNTRIES = getCountries();
export function UserSignup({ className, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  const { toast } = useToast();
  const router = useRouter();
  const {
    mutate: signupUser,
    error,
    isPending,
    data,
  } = useMutation({
    mutationFn: authService.signup,
    onSuccess: (data) => {
      console.log('signup ', data);
      toast({
        title: 'Signup  ✅',
        description: 'signup sucessful',
      });
      router.push('/auth/login');
      // router;
    },
    onError: (err: any) => {
      console.log('err ', err);
      console.log(err.message);
      if (err.props.statusCode == 400 && Array.isArray(err.props.message)) {
        err.props.message.forEach((obj: { field: string; error: string }) => {
          setError(obj.field as keyof Omit<IUserSignup, 'countryFlag'>, {
            message: obj.error ?? 'something went wrong',
          });
        });
        return;
      }
      toast({
        variant: 'destructive',
        title: `Uh oh! ${
          err?.props.message ?? err?.message ?? 'something went wrong'
        }`,
        description: 'There was a problem with your request.',
      });
      if (err.props.statusCode == 422) {
        setError('email', {
          message: 'user already exists with this email. Try login',
        });
      }
    },
  });
  console.log('signupresponse ', data);
  async function onSubmit(data: z.infer<typeof signupSchema>) {
    const country = COUNTRIES.find((c) => c.value === data.country);
    console.log('singn ');
    signupUser({
      ...data,
      country: country?.label as string,
      countryFlag: `https://flagcdn.com/${data.country}.svg`,
    });
  }
  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid gap-2 gap-y-3'>
          <div className='grid gap-1 text-white gap-y-2'>
            <Label className='' htmlFor='email'>
              Name
            </Label>
            <Input
              id='name'
              placeholder='Alex Smith'
              type='name'
              autoCapitalize='none'
              autoComplete='name'
              autoCorrect='off'
              disabled={isPending}
              {...register('name')}
            />
            {errors.name?.message && (
              <p className='text-red-600 text-sm'>{errors.name?.message}</p>
            )}
          </div>
          <div className='grid gap-1 text-white gap-y-2'>
            <Label className='' htmlFor='email'>
              Email
            </Label>
            <Input
              id='email'
              placeholder='name@example.com'
              type='text'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              disabled={isPending}
              {...register('email')}
            />
            {errors.email?.message && (
              <p className='text-red-600 text-sm'>{errors.email?.message}</p>
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
              disabled={isPending}
              {...register('password')}
            />
            {errors.password?.message && (
              <p className='text-red-600 text-sm'>{errors.password?.message}</p>
            )}
          </div>
          <div className='grid gap-1 text-white gap-y-2'>
            <Label className='' htmlFor='email'>
              Phone number
            </Label>
            <Input
              id='phoneNumber'
              placeholder='your phoneNumber number'
              type='tel'
              autoComplete='tel'
              autoCorrect='off'
              disabled={isPending}
              {...register('phoneNumber')}
            />
            {errors.phoneNumber?.message && (
              <p className='text-red-600 text-sm'>
                {errors.phoneNumber?.message}
              </p>
            )}
          </div>
          <div className='grid gap-1 text-white gap-y-2'>
            <Label>Country</Label>
            <Controller
              control={control}
              name='country'
              render={({ field }) => (
                <Select
                  name='country'
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  required
                >
                  <SelectTrigger className={cn('w-full', className)}>
                    <SelectValue placeholder='Select your country' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {COUNTRIES.map(({ label, value }) => (
                        <div className='flex items-center justify-start py-1 '>
                          <SelectItem
                            value={value}
                            className='text-center'
                            //   className='flex items-center justify-between'
                          >
                            {label}
                          </SelectItem>
                        </div>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                  {errors.country?.message && (
                    <p className='text-red-600 text-sm'>
                      {errors.country?.message}
                    </p>
                  )}
                </Select>
                // <SelectableInput
                //   {...field}
                //   placeholder='select your country'
                //   options={getCountries()}
                // />
              )}
            />
          </div>
          <Button
            disabled={isPending}
            className=' bg-gradient-to-r from-indigo-400 to-sky-300 py-4 hover:from-indigo-500 hover:to-sky-400'
            type='submit'
          >
            {isPending && <FaSpinner className='mr-2 h-4 w-4 animate-spin' />}
            Sign In
          </Button>
        </div>
      </form>
    </div>
  );
}
