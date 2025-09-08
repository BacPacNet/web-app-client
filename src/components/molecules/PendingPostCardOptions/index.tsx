import { FaExclamationTriangle, FaTimesCircle, FaCrown } from 'react-icons/fa'
import Buttons from '../../atoms/Buttons'
import { FaCircleExclamation } from 'react-icons/fa6'

interface PendingPostCardOptionProps {
  variant?: 'pending' | 'rejected' | 'review'
  title?: string
  text: string
  onAccept?: () => void
  onReject?: () => void
  acceptLabel?: string
  rejectLabel?: string
}

const PendingPostCardOption: React.FC<PendingPostCardOptionProps> = ({
  variant = 'pending',
  title,
  text,
  onAccept,
  onReject,
  acceptLabel = 'Accept',
  rejectLabel = 'Reject',
}) => {
  const variants = {
    pending: {
      wrapper: 'bg-yellow-50 border border-yellow-200 text-yellow-700',
      icon: <FaExclamationTriangle className="w-5 h-5 text-yellow-600" />,
    },
    rejected: {
      wrapper: 'bg-red-50 border border-red-200 text-red-700',
      icon: <FaCircleExclamation className="w-5 h-5 text-red-600" />,
    },
    review: {
      wrapper: 'bg-[#F9FAFB] border border-neutral-300 text-gray-800',
      icon: <FaCrown className="w-5 h-5 text-yellow-600" />,
    },
  }

  const style = variants[variant] || variants.pending

  return (
    <div className={`px-3 py-2 mb-4  rounded-md ${style.wrapper}`}>
      <div className={`flex ${variant == 'review' ? 'items-start' : 'items-center'}   gap-3`}>
        {style.icon}
        <div className="flex flex-col">
          {title && <p className="font-medium text-xs text-neutral-800 mb-4">{title}</p>}
          <p className="text-2xs text-neutral-700 ">{text}</p>
          {variant === 'review' && (
            <div className="flex gap-2 mt-3">
              <Buttons variant="notificationDanger" size="small" onClick={onReject} className="text-sm">
                {rejectLabel}
              </Buttons>
              <Buttons variant="primary" size="small" onClick={onAccept} className="text-sm">
                {acceptLabel}
              </Buttons>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PendingPostCardOption
