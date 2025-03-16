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
    const pages = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3 && !isMobile) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages)
      } else if (currentPage <= 3 && isMobile) {
        pages.push(1, 2, 3, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
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
          className={` flex items-center gap-1 ${isMobile ? 'w-9 h-9 p-2' : ' px-4 py-2'}    text-[#6B7280] text-xs   rounded me-8`}
        >
          <span className="w-5 h-5 flex items-center">
            <MdOutlineArrowBackIos color="#6B7280" />
          </span>
          {!isMobile && 'Previous'}
        </button>
      )}

      <div className="flex items-center gap-3">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            className={`w-9 h-9 p-2 text-xs rounded ${
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
          className={` ms-8 flex items-center gap-1 ${
            isMobile ? 'w-9 h-9 p-2' : 'w-[76px] px-4 py-2'
          }    text-[#6B7280] text-xs bg-neutral-50 border-neutral-200 border-2 rounded `}
        >
          {!isMobile && 'Next'}

          <span className="w-5 h-5 flex items-center">
            <MdOutlineArrowForwardIos color="#6B7280" />
          </span>
        </button>
      )}
    </div>
  )
}

export default Paginate
