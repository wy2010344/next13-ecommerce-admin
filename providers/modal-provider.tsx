"use client"

import StoreModal from '@/components/custom/store-modal';
import { useIsMounted } from '@/hooks/use-is-mounted';
import { useState, type FC, useEffect } from 'react';

interface ModalProviderProps { }

const ModalProvider: FC<ModalProviderProps> = () => {
  const isMounted = useIsMounted()
  if (!isMounted) {
    return null
  }
  return <>
    <StoreModal />
  </>
}

export default ModalProvider;
