// components/molecules/MediaPreview.tsx
import Image from 'next/image'
import { FiFile, FiFileText, FiImage } from 'react-icons/fi'
import { RxCrossCircled } from 'react-icons/rx'
import { formatFileSize } from '@/lib/utils'

type Props = {
  files: { id: string; file: File }[]
  onRemove: (id: string) => void
  onOpenPDF?: (file: File) => void
}

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return <FiImage className="text-blue-500" size={24} />
  switch (fileType) {
    case 'application/pdf':
      return <FiFileText className="text-primary-500" size={24} />
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/msword':
      return <FiFile className="text-primary-500" size={24} />
    default:
      return <FiFile className="text-primary-500" size={24} />
  }
}

export default function MediaPreview({ files, onRemove, onOpenPDF }: Props) {
  const mediaFiles = files.filter((f) => f.file.type.startsWith('image/'))
  const docFiles = files.filter((f) => !f.file.type.startsWith('image/'))

  return (
    <div className="space-y-4">
      {mediaFiles.length > 0 && (
        <div className="flex flex-wrap gap-4 items-end">
          {mediaFiles.map(({ id, file }) => (
            <div key={id} className="relative w-fit group">
              <Image
                width={96}
                height={96}
                src={URL.createObjectURL(file)}
                alt={`Media ${id}`}
                className="w-24 h-24 p-1 object-cover rounded-lg border border-neutral-300"
              />
              <button onClick={() => onRemove(id)} className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100">
                <RxCrossCircled className="text-red-500" size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {docFiles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {docFiles.map(({ id, file }) => (
            <div key={id} className="relative w-full p-3 rounded-lg border border-neutral-300 flex items-center gap-3">
              {getFileIcon(file.type)}
              <div className="truncate flex-1">
                <p onClick={() => onOpenPDF?.(file)} className="text-2xs font-medium text-primary-500 truncate underline cursor-pointer">
                  {file.name}
                </p>
                <p className="text-3xs text-neutral-500">{formatFileSize(file.size)}</p>
              </div>
              <button onClick={() => onRemove(id)} className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100">
                <RxCrossCircled className="text-red-500" size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
