"use client"
import AlertModal from '@/components/custom/alert-modal';
import Heading from '@/components/custom/heading';
import ImageUpload from '@/components/custom/image-upload';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import useOrigin from '@/hooks/use-origin';
import { zodResolver } from '@hookform/resolvers/zod';
import { EcommerceSize } from '@prisma/client';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

interface SizeFormProps {
  initialData?: EcommerceSize | null
}

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1)
})

type SizesFormValues = z.infer<typeof formSchema>

const SizeForm: FC<SizeFormProps> = ({
  initialData
}) => {
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<SizesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: ''
    }
  })

  async function onSubmit(data: SizesFormValues) {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${initialData.storeId}/sizes/${initialData.id}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, data)
      }
      router.refresh()
      router.push(`/${params.storeId}/sizes`)
      toast.success(initialData ? "Size updated." : "Size created")
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function onDelete() {
    try {
      setLoading(true)
      await axios.delete(`/api/${initialData?.storeId}/sizes/${initialData?.id}`)
      router.refresh()
      router.push(`/${params.storeId}/sizes`)
      toast.success("Size deleted.")
    } catch (error) {
      toast.error("Make sure you removed all products using this size")
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }
  return (<>
    <AlertModal loading={loading}
      isOpen={open}
      onClose={() => {
        setOpen(false)
      }} onConfirm={onDelete} />
    <div className='flex items-center justify-between'>
      <Heading
        title={initialData ? 'Edit Size' : 'Create Size'}
        description={initialData ? 'Edit a Size' : 'Create a Size'}
      />
      {initialData && <Button variant="destructive"
        disabled={loading}
        size="sm"
        onClick={() => {
          setOpen(true)
        }}>
        <Trash className='h-4 w-4' />
      </Button>}
    </div>
    <Separator />
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
        <div className='grid grid-cols-3 gap-8'>
          <FormField control={form.control} name="name" render={({ field }) => {
            return <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input disabled={loading} placeholder='Size name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          }} />
          <FormField control={form.control} name="value" render={({ field }) => {
            return <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input disabled={loading} placeholder='Size value' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          }} />
        </div>
        <Button disabled={loading} className='ml-auto' type="submit">
          {initialData ? "Save changes" : "Create size"}
        </Button>
      </form>
    </Form>
  </>);
}

export default SizeForm;
