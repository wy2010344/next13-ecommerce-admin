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
import { EcommerceColor } from '@prisma/client';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

interface ColorFormProps {
  initialData?: EcommerceColor | null
}

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: 'String must be a valid hex code'
  })
})

type ColorsFormValues = z.infer<typeof formSchema>

const ColorForm: FC<ColorFormProps> = ({
  initialData
}) => {
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<ColorsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: ''
    }
  })

  async function onSubmit(data: ColorsFormValues) {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${initialData.storeId}/colors/${initialData.id}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data)
      }
      router.refresh()
      router.push(`/${params.storeId}/colors`)
      toast.success(initialData ? "Color updated." : "Color created")
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function onDelete() {
    try {
      setLoading(true)
      await axios.delete(`/api/${initialData?.storeId}/colors/${initialData?.id}`)
      router.refresh()
      router.push(`/${params.storeId}/colors`)
      toast.success("Color deleted.")
    } catch (error) {
      toast.error("Make sure you removed all products using this color")
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
        title={initialData ? 'Edit Color' : 'Create Color'}
        description={initialData ? 'Edit a Color' : 'Create a Color'}
      />
      {initialData && <Button variant="destructive"
        disabled={loading}
        color="sm"
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
                <Input disabled={loading} placeholder='Color name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          }} />
          <FormField control={form.control} name="value" render={({ field }) => {
            return <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <div className="flex items-center gap-x-4">

                  <Input disabled={loading} placeholder='Color value' {...field} />
                  <div className="border p-4 rounded-full" style={{
                    backgroundColor: field.value
                  }}></div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          }} />
        </div>
        <Button disabled={loading} className='ml-auto' type="submit">
          {initialData ? "Save changes" : "Create color"}
        </Button>
      </form>
    </Form>
  </>);
}

export default ColorForm;
