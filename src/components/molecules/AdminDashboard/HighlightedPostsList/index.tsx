'use client'

import HighlightedPostItem from '@/components/molecules/AdminDashboard/HighlightedPostItem'
import { HighlightPostType } from '@/services/universitySearch'
import { useEffect, useState } from 'react'

export type HighlightedPostOrderItem = {
  postId: string
  postType: HighlightPostType
  position: number
}

type Props = {
  posts: any[]
  universityId: string
  selectedIndex?: number
  onSelectPost?: (index: number) => void
  onOrderChange?: (order: HighlightedPostOrderItem[], posts: any[]) => void
  onRemove?: (postId: string) => void
}

function buildOrder(posts: any[]): HighlightedPostOrderItem[] {
  return posts.map((post, index) => ({
    postId: post._id,
    postType: ('communityId' in post ? 'CommunityPost' : 'UserPost') as HighlightPostType,
    position: index,
  }))
}

export default function HighlightedPostsList({ posts, universityId, selectedIndex = 0, onSelectPost, onOrderChange, onRemove }: Props) {
  const [items, setItems] = useState(posts)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  useEffect(() => {
    setItems(posts)
  }, [posts])

  const handleOrderChange = (newItems: any[]) => {
    onOrderChange?.(buildOrder(newItems), newItems)
  }

  const handleDragStart = (index: number) => {
    setDragIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null)
      setDragOverIndex(null)
      return
    }

    const newItems = [...items]
    const [moved] = newItems.splice(dragIndex, 1)
    newItems.splice(index, 0, moved)

    setItems(newItems)
    handleOrderChange(newItems)
    setDragIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((post, index) => (
        <HighlightedPostItem
          key={post._id}
          post={post}
          position={index}
          universityId={universityId}
          isPrimary={selectedIndex === index}
          isDragging={dragIndex === index}
          isDragOver={dragOverIndex === index}
          onSelect={() => onSelectPost?.(index)}
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={() => handleDrop(index)}
          onDragEnd={handleDragEnd}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}
