"use client"
import AlertModal from '@/components/custom/alert-modal';
import ApiAlert from '@/components/custom/api-alert';
import Heading from '@/components/custom/heading';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import useOrigin from '@/hooks/use-origin';
import { zodResolver } from '@hookform/resolvers/zod';
import { ECommerceStore } from '@prisma/client';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

interface SettingFormProps {
  initialData: ECommerceStore
}

const formSchema = z.object({
  name: z.string().min(1)
})

type SettingsFormValues = z.infer<typeof formSchema>

const SettingForm: FC<SettingFormProps> = ({
  initialData
}) => {
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  })

  async function onSubmit(data: SettingsFormValues) {
    try {
      setLoading(true)
      await axios.patch(`/api/stores/${initialData.id}`, data)
      router.refresh()
      toast.success("Store updated.")
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function onDelete() {
    try {
      setLoading(true)
      await axios.delete(`/api/stores/${initialData.id}`)
      router.refresh()
      router.push('/')
      toast.success("Store deleted.")
    } catch (error) {
      toast.error("Make sure you removed all products and categories first")
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  const origin = useOrigin()
  return (<>
    <AlertModal loading={loading}
      isOpen={open}
      onClose={() => {
        setOpen(false)
      }} onConfirm={onDelete} />
    <div className='flex items-center justify-between'>
      <Heading
        title='Settings'
        description='Manage store preferences'
      />
      <Button variant="destructive"
        disabled={loading}
        size="sm"
        onClick={() => {
          setOpen(true)
        }}>
        <Trash className='h-4 w-4' />
      </Button>
    </div>
    <Separator />
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
        <div className='grid grid-cols-3 gap-8'>
          <FormField control={form.control} name="name" render={({ field }) => {
            return <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input disabled={loading} placeholder='Store name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          }} />
        </div>
        <Button disabled={loading} className='ml-auto' type="submit">
          Save changes
        </Button>
      </form>
    </Form>
    <Separator />
    <ApiAlert title='NEXT_PUBLIC_API_URL' description={`
      ${origin}/api/${initialData.id}
    `} />
  </>);
}

export default SettingForm;
