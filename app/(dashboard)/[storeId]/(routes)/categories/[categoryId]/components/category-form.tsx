"use client"
import AlertModal from '@/components/custom/alert-modal';
import Heading from '@/components/custom/heading';
import ImageUpload from '@/components/custom/image-upload';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import useOrigin from '@/hooks/use-origin';
import { zodResolver } from '@hookform/resolvers/zod';
import { EcommerceBillboard, EcommerceCategory } from '@prisma/client';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

interface CategorieFormProps {
  initialData?: EcommerceCategory | null
  billboards: EcommerceBillboard[]
}

const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1)
})

type CategoriesFormValues = z.infer<typeof formSchema>

const CategorieForm: FC<CategorieFormProps> = ({
  initialData,
  billboards
}) => {
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<CategoriesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      billboardId: ''
    }
  })

  async function onSubmit(data: CategoriesFormValues) {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${initialData.storeId}/categories/${initialData.id}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data)
      }
      router.refresh()
      router.push(`/${params.storeId}/categories`)
      toast.success(initialData ? "Category updated." : "Category created")
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function onDelete() {
    try {
      setLoading(true)
      await axios.delete(`/api/${initialData?.storeId}/categories/${initialData?.id}`)
      router.refresh()
      router.push(`/${params.storeId}/categories`)
      toast.success("Category deleted.")
    } catch (error) {
      toast.error("Make sure you removed all products using this category first")
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
        title={initialData ? 'Edit Categorie' : 'Create Categorie'}
        description={initialData ? 'Edit a Categorie' : 'Create a Categorie'}
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
                <Input disabled={loading} placeholder='Category name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          }} />

          <FormField control={form.control} name="billboardId" render={({ field }) => {
            return <FormItem>
              <FormLabel>Billboard</FormLabel>
              <FormControl>
                <Select disabled={loading}
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue defaultValue={field.value}
                        placeholder="Select a billboard"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {billboards.map(billboard => {
                      return <SelectItem key={billboard.id} value={billboard.id}>
                        {billboard.label}
                      </SelectItem>
                    })}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          }} />
        </div>
        <Button disabled={loading} className='ml-auto' type="submit">
          {initialData ? "Save changes" : "Create category"}
        </Button>
      </form>
    </Form>
  </>);
}

export default CategorieForm;
