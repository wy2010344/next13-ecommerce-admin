"use client"
import { useIsMounted } from '@/hooks/use-is-mounted';
import type { FC } from 'react';
import { Button } from '../ui/button';
import { ImagePlus, Trash } from 'lucide-react';
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';

interface ImageUploadProps {
  disabled?: boolean
  onChange(value: string): void
  onRemove(value: string): void
  value: string[]
}

const ImageUpload: FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value
}) => {
  const isMounted = useIsMounted()
  if (!isMounted) {
    return null
  }

  function onUpload(result: any) {
    onChange(result.info.secure_url)
  }
  return (<div>
    <div className='mb-4 flex items-center gap-4' >
      {value.map(url => {
        return <div key={url} className='relative w-[200px] h-[200px] rounded-md overflow-hidden'>
          <div className="z-10 absolute top-2 right-2">
            <Button type='button' onClick={() => {
              onRemove(url)
            }} variant="destructive" size="icon">
              <Trash className='h-4 w-4' />
            </Button>
          </div>
          <Image
            fill
            className='object-cover'
            alt='Image'
            src={url}
          />
        </div>
      })}
    </div>
    <CldUploadWidget onUpload={onUpload} uploadPreset='cqsb9fdu' children={({ open }) => {
      function onClick() {
        open()
      }
      return <Button type='button' disabled={disabled} variant="secondary" onClick={onClick}>
        <ImagePlus className='w-4 h-4 mr-2' />
        Upload an Image
      </Button>
    }} />
  </div>);
}

export default ImageUpload;
