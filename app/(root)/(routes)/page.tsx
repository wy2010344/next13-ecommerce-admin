"use client"
import Modal from '@/components/custom/modal'
import { Button } from '@/components/ui/button'
import useStoreModal from '@/hooks/use-store-modal'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { useEffect } from 'react'

export default function Home() {
  const onOpen = useStoreModal(state => state.onOpen)
  const isOpen = useStoreModal(state => state.isOpen)

  useEffect(() => {
    if (!isOpen) {
      onOpen()
    }
  }, [isOpen, onOpen])
  return (
    <div className='p-2'>
      <UserButton afterSignOutUrl="/" />
    </div>
  )
}
