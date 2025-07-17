type NotificationBadgeProps = {
  count: number
  maxCount?: number // Optional: to display '9+' or similar
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, maxCount = 99 }) => {
  const displayCount = count > maxCount ? `${maxCount}+` : count

  const isDoubleDigit = count > 9 || displayCount.toString().length > 1

  return (
    <span
      className={`bg-destructive-600 rounded-full text-white text-[10px] leading-none font-semibold flex items-center justify-center ${
        isDoubleDigit ? 'w-5 h-5' : 'w-4 h-4'
      }`}
    >
      {displayCount}
    </span>
  )
}

export default NotificationBadge
