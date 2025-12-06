import Image from 'next/image'
import { MdCancel } from 'react-icons/md'

interface CommentPreviewProps {
  files: { id: string | number; file: File }[]
  onRemove: (id: string | number) => void
  onOpenFile?: (file: File) => void
}

export default function CommentPreview({ files, onRemove, onOpenFile }: CommentPreviewProps) {
  const imageFiles = files.filter((f) => f.file.type.startsWith('image/'))
  const docFiles = files.filter((f) => !f.file.type.startsWith('image/'))

  return (
    <div className="space-y-4">
      {/* IMAGE PREVIEW */}
      {imageFiles.length > 0 && (
        <div className="flex flex-wrap gap-4 items-end">
          {imageFiles.map(({ id, file }) => (
            <div key={id} className="relative w-fit group">
              <Image
                width={96}
                height={96}
                src={URL.createObjectURL(file)}
                alt={`img-${id}`}
                className="w-24 h-24 object-cover rounded border border-neutral-300"
              />
              <button onClick={() => onRemove(id)} className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100">
                <MdCancel size={20} className="text-destructive-600" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* FILE PREVIEW */}
      {docFiles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {docFiles.map(({ id, file }) => (
            <div key={id} className="relative w-full p-3 rounded-lg border border-neutral-300 flex items-center gap-3 bg-white">
              {/* File icon */}
              <div className="text-neutral-700 text-lg">{file.type.includes('pdf') ? '📄' : '📁'}</div>

              <div className="truncate flex-1">
                <p onClick={() => onOpenFile?.(file)} className="text-2xs font-medium text-primary-500 truncate underline cursor-pointer">
                  {file.name}
                </p>
                <p className="text-3xs text-neutral-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={() => onRemove(id)} className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100">
                <MdCancel size={20} className="text-destructive-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
