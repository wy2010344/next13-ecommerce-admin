import { create } from 'zustand'

interface UserStoreModalProps {
  isOpen: boolean
  onOpen(): void
  onClose(): void
}

const useStoreModal = create<UserStoreModalProps>(set => {
  return {
    isOpen: false,
    onClose() {
      set({
        isOpen: false
      })
    },
    onOpen() {
      set({
        isOpen: true
      })
    },
  }
})

export default useStoreModal;
