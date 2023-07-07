"use client"
import { useState, type FC } from 'react';
import Modal from './modal';
import useStoreModal from '@/hooks/use-store-modal';
import * as z from 'zod'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface StoreModalProps { }


const formSchema = z.object({
  name: z.string().min(1)
})
const StoreModal: FC<StoreModalProps> = () => {
  const storeModal = useStoreModal()
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ""
    }
  })
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const response = await axios.post(`/api/stores`, values)
      // console.log(response.data)
      // toast.success("Store created.")
      window.location.assign(`/${response.data.id}`)
    } catch (error) {
      console.log(error)
      toast.error("something went wrong")
    } finally {
      setLoading(false)
    }
  }
  return (<Modal title='Create Store' description='Add a new store to manage products and categories'
    isOpen={storeModal.isOpen}
    onClose={storeModal.onClose}
  >
    <div className='space-y-4 py-2 pb-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder='E-Commerce' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            }} />
          <div className="pt-6 space-x-2 flex items-center justify-end">
            <Button variant="outline" disabled={loading} onClick={storeModal.onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>Continue</Button>
          </div>
        </form>
      </Form>
    </div>
  </Modal>);
}

export default StoreModal;
