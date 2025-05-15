import { useEffect, RefObject } from 'react'

type UseInfiniteScrollProps = {
  containerRef: RefObject<HTMLElement>
  onBottomReach: () => void
  deps?: unknown[]
}

export const useInfiniteScroll = ({ containerRef, onBottomReach, deps = [] }: UseInfiniteScrollProps): void => {
  useEffect(() => {
    const handler = () => {
      const el = containerRef.current
      if (!el) return

      const { scrollTop, scrollHeight, clientHeight } = el
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        onBottomReach()
      }
    }

    const el = containerRef.current
    el?.addEventListener('scroll', handler)
    return () => el?.removeEventListener('scroll', handler)
  }, deps)
}
