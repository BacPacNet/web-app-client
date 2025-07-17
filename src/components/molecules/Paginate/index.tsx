import useDeviceType from '@/hooks/useDeviceType'
import React from 'react'
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md'
type Props = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Paginate = ({ currentPage, totalPages, onPageChange }: Props) => {
  const { isMobile } = useDeviceType()

  const getPageNumbers = () => {
    const pages: (number | string)[] = []

    if (totalPages <= 5) {
      // If total pages are 5 or less, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }

    return pages
  }

  if (totalPages <= 1) {
    return
  }
  return (
    <div className="flex items-center ">
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className={` flex items-center gap-1 max-sm:w-9 max-sm:h-9 p-2 me-1 sm:px-4 sm:py-2 sm:me-8    text-[#6B7280] text-xs   rounded `}
        >
          <span className="w-5 h-5 flex items-center">
            <MdOutlineArrowBackIos color="#6B7280" />
          </span>

          <p className=" hidden sm:block">Previous</p>
        </button>
      )}

      <div className="flex items-center gap-1 sm:gap-3">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            className={`w-auto py-1  text-xs rounded px-2 sm:px-3 font-normal ${
              currentPage === page ? 'bg-surface-primary-50 text-primary-500 border-primary-500' : 'bg-neutral-50 border-neutral-200 text-neutral-700'
            } border-2`}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
      </div>

      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className={`  flex items-center gap-1 
             w-6 h-9 px-2 py-2 ms-1 sm:w-[76px] sm:px-4 sm:py-2 sm:ms-8 
              text-[#6B7280] text-xs   rounded `}
        >
          <p className=" hidden sm:block">Next</p>

          <span className={` ${isMobile ? ' w-5' : 'w-5'} h-5 flex items-center`}>
            <MdOutlineArrowForwardIos color="#6B7280" />
          </span>
        </button>
      )}
    </div>
  )
}

export default Paginate
