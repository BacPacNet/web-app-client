// components/Editor.tsx
'use client'

import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { PostInputType } from '@/types/constants'

interface EditorProps {
  readOnly?: boolean
  defaultValue?: any
  onTextChange?: (innerHtml: any, oldDelta: any, source: 'api' | 'user') => void
  onSelectionChange?: (range: any | null, oldRange: any | null, source: 'api' | 'user') => void
  type?: PostInputType
  getQuillInstance?: (quill: Quill) => void
  placeholder?: string
  preventImagePaste?: boolean // Add new prop to control image paste prevention
}

const Editor = forwardRef<Quill | null, EditorProps>(
  ({ readOnly = false, defaultValue, onTextChange, onSelectionChange, getQuillInstance, placeholder, preventImagePaste = true }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const quillInstanceRef = useRef<Quill | null>(null)

    // Sync external callbacks with refs
    const onTextChangeRef = useRef<typeof onTextChange>()
    const onSelectionChangeRef = useRef<typeof onSelectionChange>()

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange
      onSelectionChangeRef.current = onSelectionChange
    }, [onTextChange, onSelectionChange])

    // Set editor read-only based on prop
    useEffect(() => {
      if (quillInstanceRef.current) {
        quillInstanceRef.current.enable(!readOnly)
      }
    }, [readOnly])

    useEffect(() => {
      const container = containerRef.current
      if (!container) return

      const editorContainer = document.createElement('div')
      container.appendChild(editorContainer)

      const quill = new Quill(editorContainer, {
        theme: 'snow',
        placeholder: placeholder || '',
        formats: preventImagePaste ? ['bold', 'italic', 'underline', 'strike', 'align', 'code-block', 'list', 'link'] : undefined,
        modules: {
          toolbar: [
            //[{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
            ['code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
          ],
          clipboard: {
            // Disable image pasting in clipboard module
            matchVisual: false,
          },
        },
      })

      quillInstanceRef.current = quill

      // 🔧 Assign to forwarded ref
      if (typeof ref === 'function') {
        ref(quill)
      } else if (ref) {
        ref.current = quill
      }

      if (defaultValue) {
        quill.setText(defaultValue)
      }

      // Set up text-change and selection-change event listeners
      quill.on('text-change', (_delta, oldDelta, source: any) => {
        onTextChangeRef.current?.(quill.root.innerHTML, oldDelta, source)
      })

      quill.on('selection-change', (range, oldRange, source: any) => {
        onSelectionChangeRef.current?.(range, oldRange, source)
      })

      if (getQuillInstance) {
        getQuillInstance(quill) // 👈 Pass instance to parent
      }

      // Prevent image pasting if enabled
      let pasteEventListener: ((e: ClipboardEvent) => void) | null = null
      if (preventImagePaste) {
        // Handle paste events to filter out images
        pasteEventListener = (e: ClipboardEvent) => {
          const clipboardData = e.clipboardData
          if (!clipboardData) return

          // Check if clipboard contains images
          const hasImages = Array.from(clipboardData.items).some((item) => item.type.startsWith('image/'))

          if (hasImages) {
            e.preventDefault()
            e.stopPropagation()
            return false
          }
        }

        // Add paste event listener to the editor container
        const editorElement = quill.root
        editorElement.addEventListener('paste', pasteEventListener)
      }

      // Cleanup function
      return () => {
        // Remove paste event listener if it was added
        if (pasteEventListener) {
          const editorElement = quill.root
          editorElement.removeEventListener('paste', pasteEventListener)
        }

        if (getQuillInstance) getQuillInstance(null as any)
        if (typeof ref === 'function') {
          ref(null)
        } else if (ref) {
          ref.current = null
        }
        quillInstanceRef.current = null
        container.innerHTML = ''
      }
    }, [defaultValue, ref, preventImagePaste])

    return <div className="quill-container" ref={containerRef} />
  }
)

Editor.displayName = 'Editor'
export default Editor
