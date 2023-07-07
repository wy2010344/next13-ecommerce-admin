"use client"
import AlertModal from '@/components/custom/alert-modal';
import Heading from '@/components/custom/heading';
import ImageUpload from '@/components/custom/image-upload';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import useOrigin from '@/hooks/use-origin';
import { zodResolver } from '@hookform/resolvers/zod';
import { EcommerceCategory, EcommerceColor, EcommerceImage, EcommerceProduct, EcommerceSize } from '@prisma/client';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

interface ProductFormProps {
  categories: EcommerceCategory[]
  colors: EcommerceColor[]
  sizes: EcommerceSize[]
  initialData?: EcommerceProduct & {
    images: EcommerceImage[]
  } | null
}

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional()
})

type ProductsFormValues = z.infer<typeof formSchema>

const ProductForm: FC<ProductFormProps> = ({
  initialData,
  categories,
  colors,
  sizes
}) => {
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<ProductsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      price: Number(initialData.price)
    } : {
      name: '',
      images: [],
      price: 0,
      categoryId: '',
      colorId: '',
      sizeId: '',
      isFeatured: false,
      isArchived: false
    }
  })

  async function onSubmit(data: ProductsFormValues) {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${initialData.storeId}/products/${initialData.id}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/products`, data)
      }
      router.refresh()
      router.push(`/${params.storeId}/products`)
      toast.success(initialData ? "Product updated." : "Product created")
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function onDelete() {
    try {
      setLoading(true)
      await axios.delete(`/api/${initialData?.storeId}/products/${initialData?.id}`)
      router.refresh()
      router.push(`/${params.storeId}/products`)
      toast.success("Product deleted.")
    } catch (error) {
      toast.error("Something went wrong")
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
        title={initialData ? 'Edit Product' : 'Create Product'}
        description={initialData ? 'Edit a Product' : 'Create a Product'}
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
        <FormField control={form.control} name="images" render={({ field }) => {
          return <FormItem>
            <FormLabel>Images</FormLabel>
            <FormControl>
              <ImageUpload
                value={field.value.map(v => v.url)}
                disabled={loading}
                onChange={(url) => {
                  field.onChange([...field.value, { url }])
                }}
                onRemove={url => {
                  field.onChange(field.value.filter(v => v.url != url))
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        }} />
        <div className='grid grid-cols-3 gap-8'>
          <FormField control={form.control} name="name" render={({ field }) => {
            return <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input disabled={loading} placeholder='Product name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          }} />
          <FormField control={form.control} name="price" render={({ field }) => {
            return <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" disabled={loading} placeholder='9.99' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          }} />

          <FormField control={form.control} name="categoryId" render={({ field }) => {
            return <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select disabled={loading}
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue defaultValue={field.value}
                        placeholder="Select a category"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map(category => {
                      return <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    })}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          }} />


          <FormField control={form.control} name="sizeId" render={({ field }) => {
            return <FormItem>
              <FormLabel>Size</FormLabel>
              <FormControl>
                <Select disabled={loading}
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue defaultValue={field.value}
                        placeholder="Select a size"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sizes.map(category => {
                      return <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    })}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          }} />


          <FormField control={form.control} name="colorId" render={({ field }) => {
            return <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Select disabled={loading}
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue defaultValue={field.value}
                        placeholder="Select a Color"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {colors.map(category => {
                      return <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    })}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          }} />

          <FormField control={form.control} name="isFeatured" render={({ field }) => {
            return <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>

              <FormControl>
                <Checkbox
                  checked={field.value}
                  disabled={loading}
                  //@ts-ignore
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Featured</FormLabel>
                <FormDescription>
                  This product will appear on the home page
                </FormDescription>
              </div>
            </FormItem>
          }} />


          <FormField control={form.control} name="isArchived" render={({ field }) => {
            return <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>

              <FormControl>
                <Checkbox
                  checked={field.value}
                  disabled={loading}
                  //@ts-ignore
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Archived</FormLabel>
                <FormDescription>
                  This product will not appear anywhere in the store
                </FormDescription>
              </div>
            </FormItem>
          }} />

        </div>
        <Button disabled={loading} className='ml-auto' type="submit">
          {initialData ? "Save changes" : "Create product"}
        </Button>
      </form>
    </Form>
  </>);
}

export default ProductForm;
