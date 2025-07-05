'use client'
import CollegeResult from '@/components/CollegeResult'
import { Skeleton } from '@/components/ui/Skeleton'
import { useUniversitySearch } from '@/services/universitySearch'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { PiMagnifyingGlassBold } from 'react-icons/pi'
import { motion, AnimatePresence } from 'framer-motion'

export default function UniversitySearchBox() {
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()
  const { data: universitiesData, isLoading } = useUniversitySearch(searchTerm, 1, 10)
  const universities = universitiesData?.result?.universities

  return (
    <div className="relative mt-8">
      <div className="absolute top-1/2 -translate-y-1/2 left-4">
        <PiMagnifyingGlassBold size={20} strokeWidth={5} className="text-neutral-400 " />
      </div>
      {/* Search Input */}
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '-webkit-fill-available' }}
        className="py-1 md:py-2 pl-10 border-[3px] border-neutral-300 rounded-full focus:outline-none focus:border-gray-500 w-full"
        type="text"
        placeholder="Search Institute"
      />

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute mt-2 w-full bg-white border-[1px] border-neutral-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            <div className="p-4">
              <Skeleton className="bg-slate-300 h-4 w-40 my-2" />
              <Skeleton className="bg-slate-300 h-4 w-50 my-2" />
            </div>
          </motion.div>
        )}

        {!isLoading && searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute px-4 py-2 mt-2 w-full bg-white border-2 border-neutral-300 rounded-xl shadow-2xl max-h-80 overflow-y-auto"
          >
            {universities && universities?.length > 0 ? (
              <>
                {universities?.map((university: any, index: number) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      ease: 'easeOut',
                    }}
                    onClick={() => router.push(`/discover/${university.name}`)}
                    key={university?.id}
                    className="bg-white rounded-md hover:bg-surface-primary-50 py-1 cursor-pointer transition-colors duration-200"
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: '#f8fafc',
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CollegeResult university={university} />
                  </motion.div>
                ))}
              </>
            ) : universitiesData && universities?.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-white rounded-lg hover:bg-gray-100 border-b border-neutral-200 last:border-b-0 text-black"
              >
                <p className="p-3 text-gray-500">No results found</p>
              </motion.div>
            ) : (
              <div className="p-4">
                <Skeleton className="bg-slate-300 h-4 w-40 my-2" />
                <Skeleton className="bg-slate-300 h-4 w-50 my-2" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
