'use client';
import IndexChart, { ChartData } from '@/components/Chart';
import { DatePicker } from '@/components/date-picker';
import { NotificationsForm } from '@/components/forms/NotificationsForm';
import ProtectedComponent from '@/components/protectected-component';
import Spinner from '@/components/spinner';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useGetIndices } from '@/hooks/get-indices';
import { formatDate } from '@/lib/utils';
import { getDataByIndex } from '@/service';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
const roundTo2Digits = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};
export default function Home() {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [date, setDate] = useState<Date>();
  const handleSelectChange = useCallback((value: string) => {
    setSelectedValue(value);
  }, []);

  const { data: indices, isError, isLoading } = useGetIndices();
  const {
    data,
    isLoading: fetchIndexDataLoading,
    error,
  } = useQuery({
    queryKey: ['indexById', selectedValue, date],
    retry: false,
    queryFn: () =>
      getDataByIndex({
        symbol: selectedValue,
        date: formatDate(date as Date),
      }),
    enabled: Boolean(date) && Boolean(selectedValue),
  });
  console.log('e__ ', error);
  console.log('data ', data);
  useEffect(() => {
    if (error) {
      console.log('error ', error);
      // @ts-ignore
      const err = error.response.data.data;
      toast.error(err?.message ?? 'something went wrong');
      console.log('err', err);
    }
  }, [isError, error]);
  // useEffect(())
  return (
    <ProtectedComponent>
      <div className='flex flex-col w-full min-h-screen bg-background'>
        <div className='flex-1 p-6 md:p-10'>
          <div className='flex items-center justify-between h-16 px-6 shrink-0'>
            <div className='flex items-center justify-between gap-4 w-full'>
              <div className='flex items-center flex-col gap-y-3'>
                <p>Select Stock Index</p>
                <Select
                  onValueChange={handleSelectChange}
                  value={selectedValue}
                >
                  <SelectTrigger disabled={isLoading} className='w-[300px]'>
                    {isLoading ? (
                      <Spinner />
                    ) : (
                      <SelectValue placeholder='Filter by...' />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='I:NDX'>Free one</SelectItem>

                    {indices?.map(
                      ({ ticker, name }: { ticker: string; name: string }) => (
                        <SelectItem value={ticker}>{name}</SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              {/* <button onClick={() => setTest((prev) => !prev)}>click</button> */}
              <div className='flex items-center flex-col gap-y-3'>
                <h1>Select Date</h1>
                <DatePicker date={date} setDate={setDate} />
              </div>
              <NotificationsForm
                index={selectedValue}
                disable={!selectedValue}
              />
              {/* <Button className='px-6 py-2 text-lg font-medium'>
                Create New
              </Button> */}
            </div>
          </div>
          <div className=''>
            <IndexChart
              data={data?.results?.map(
                (item: {
                  t: string;
                  o: number;
                  c: number;
                  l: number;
                  h: number;
                }) => ({
                  time: new Date(item.t).toLocaleTimeString(),
                  open: item.o?.toFixed(2),
                  close: item.c?.toFixed(2),
                  lowest: item.l?.toFixed(2),
                  highest: item.h?.toFixed(2),
                })
              )}
            />
          </div>
        </div>
      </div>
    </ProtectedComponent>
  );
}

function MoveHorizontalIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <polyline points='18 8 22 12 18 16' />
      <polyline points='6 8 2 12 6 16' />
      <line x1='2' x2='22' y1='12' y2='12' />
    </svg>
  );
}

function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M18 6 6 18' />
      <path d='m6 6 12 12' />
    </svg>
  );
}
