"use client"
import { Dialog, DialogHeader, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { FC } from 'react';

interface ModalProps {
  title: string
  description: string
  isOpen: boolean
  onClose(): void
  children?: React.ReactNode
}

const Modal: FC<ModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  children
}) => {

  function onChange(open: boolean) {
    if (!open) {
      onClose()
    }
  }
  return (<Dialog open={isOpen} onOpenChange={onChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div>{children}</div>
    </DialogContent>
  </Dialog>);
}

export default Modal;
