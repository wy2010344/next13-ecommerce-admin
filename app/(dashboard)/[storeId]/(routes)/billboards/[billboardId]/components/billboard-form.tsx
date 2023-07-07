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
import { EcommerceBillboard } from '@prisma/client';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

interface BillboardFormProps {
  initialData?: EcommerceBillboard | null
}

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1)
})

type BillboardsFormValues = z.infer<typeof formSchema>

const BillboardForm: FC<BillboardFormProps> = ({
  initialData
}) => {
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<BillboardsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: ''
    }
  })

  async function onSubmit(data: BillboardsFormValues) {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${initialData.storeId}/billboards/${initialData.id}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data)
      }
      router.refresh()
      router.push(`/${params.storeId}/billboards`)
      toast.success(initialData ? "Billboard updated." : "Billboard created")
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function onDelete() {
    try {
      setLoading(true)
      await axios.delete(`/api/${initialData?.storeId}/billboards/${initialData?.id}`)
      router.refresh()
      router.push(`/${params.storeId}/billboards`)
      toast.success("Billboard deleted.")
    } catch (error) {
      toast.error("Make sure you removed all categories using this billboard")
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
        title={initialData ? 'Edit Billboard' : 'Create Billboard'}
        description={initialData ? 'Edit a Billboard' : 'Create a Billboard'}
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
        <FormField control={form.control} name="imageUrl" render={({ field }) => {
          return <FormItem>
            <FormLabel>Background image</FormLabel>
            <FormControl>
              <ImageUpload
                value={field.value ? [field.value] : []}
                disabled={loading}
                onChange={(url) => {
                  field.onChange(url)
                }}
                onRemove={url => {
                  field.onChange('')
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        }} />
        <div className='grid grid-cols-3 gap-8'>
          <FormField control={form.control} name="label" render={({ field }) => {
            return <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input disabled={loading} placeholder='Billboard label' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          }} />
        </div>
        <Button disabled={loading} className='ml-auto' type="submit">
          {initialData ? "Save changes" : "Create billboard"}
        </Button>
      </form>
    </Form>
  </>);
}

export default BillboardForm;
