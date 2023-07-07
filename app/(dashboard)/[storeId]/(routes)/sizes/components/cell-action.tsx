"use client"
import { useState, type FC } from 'react';
import { SizeColumn } from './columns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import AlertModal from '@/components/custom/alert-modal';

interface CellActionProps {
  data: SizeColumn
}

const CellAction: FC<CellActionProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  async function onDelete() {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/sizes/${data.id}`)
      router.refresh()
      toast.success("Size deleted.")
    } catch (error) {
      toast.error("Make sure you removed all products using this size")
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }
  return (<>
    <AlertModal
      isOpen={open}
      onClose={() => {
        setOpen(false)
      }}
      onConfirm={onDelete}
      loading={loading}
    />
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='w-4 h-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => {
          navigator.clipboard.writeText(data.id)
          toast.success("Size Id copied to the clipboard")
        }}>
          <Copy className='mr-4 w-4 h-4' />
          Copy Id
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          router.push(`/${params.storeId}/sizes/${data.id}`)
        }}>
          <Edit className='mr-4 w-4 h-4' />
          Update
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          setOpen(true)
        }}>
          <Trash className='mr-4 w-4 h-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </>);
}

export default CellAction;
