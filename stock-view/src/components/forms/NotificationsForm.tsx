import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AddSingleDoc } from '@/utils/request';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
export function NotificationsForm({
  disable,
  index,
}: {
  disable: boolean;
  index: string;
}) {
  const [selectedValue, setSelectedValue] = useState('above');
  const [inputValue, setInputValue] = useState<number | string>(50);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = useCallback((value: string) => {
    setSelectedValue(value);
  }, []);
  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    console.log('user', user);
    if (!user || !inputValue || !index || !selectedValue) {
      toast.error('Something went wrong please try again');
      return;
    }
    await AddSingleDoc('notify', {
      price: inputValue,
      direction: selectedValue,
      email: user.email,
      stock: index,
    });
    setIsOpen(false);
    toast.success('Added!');
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild disabled={disable}>
        <Button disabled={disable} variant='outline'>
          Enable Notifications
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Enable Notifications </DialogTitle>
          <DialogDescription>
            set a price threshold for an index, above or below
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='price' className='text-right'>
              Price
            </Label>
            <Input
              id='price'
              value={inputValue}
              type='number'
              onChange={(e) =>
                setInputValue(
                  e.target.value === '' ? '' : Number(e.target.value)
                )
              }
              className='col-span-3'
            />
          </div>
          {/* <div className='grid grid-cols-4 items-center gap-4'> */}
          <RadioGroup value={selectedValue} onValueChange={handleChange}>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='above' id='r1' />
              <Label htmlFor='r1'>Above</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='below' id='r2' />
              <Label htmlFor='r2'>Below</Label>
            </div>
          </RadioGroup>
          {/* </div> */}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
