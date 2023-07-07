"use client"

import { useIsMounted } from '@/hooks/use-is-mounted';
import type { FC } from 'react';
import Modal from './modal';
import { Button } from '../ui/button';

interface AlertModalProps {
  isOpen: boolean
  onClose(): void
  onConfirm(): void
  loading: boolean
}

const AlertModal: FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading
}) => {
  const isMounted = useIsMounted()
  if (!isMounted) {
    return null
  }
  return (<Modal
    title="Are you sure?"
    description="This action cannot be undone."
    isOpen={isOpen}
    onClose={onClose}
  >
    <div className="pt-6 space-x-2 flex items-center justify-end w-full">
      <Button disabled={loading} variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button disabled={loading} variant="destructive" onClick={onConfirm}>
        Continue
      </Button>
    </div>
  </Modal>);
}

export default AlertModal;
