import { useIsMounted } from "./use-is-mounted";

export default function useOrigin() {
  const isMounted = useIsMounted()
  const origin = isMounted && typeof window != 'undefined' ? window.location.origin : ''
  return origin
}