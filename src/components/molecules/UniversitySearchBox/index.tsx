'use client'
import CollegeResult from '@/components/CollegeResult'
import { Skeleton } from '@/components/ui/Skeleton'
import { useUniversitySearch } from '@/services/universitySearch'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { PiMagnifyingGlassBold } from 'react-icons/pi'

export default function UniversitySearchBox() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: universities, isLoading, error } = useUniversitySearch(searchTerm)
  const router = useRouter()

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
        className="py-2 pl-10 border-[3px] border-neutral-300 rounded-full focus:outline-none focus:border-gray-500 w-full"
        type="text"
        placeholder="Search Institute"
      />

      {isLoading ? (
        <div className="absolute mt-2 w-full bg-white border-4 border-neutral-500 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="p-4">
            <Skeleton className="bg-slate-300 h-4 w-40 my-2" />
            <Skeleton className="bg-slate-300 h-4 w-50 my-2" />
          </div>
        </div>
      ) : (
        searchTerm && (
          <div className="absolute px-4 py-2 mt-2 w-full bg-white border-2 border-neutral-300 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
            {universities && universities.result.length > 0 ? (
              <>
                {universities.result.map((university: any) => (
                  <div
                    onClick={() => router.push(`/discover/${university.name}`)}
                    key={university?.id}
                    className=" bg-white rounded-md hover:bg-surface-primary-50 py-1 cursor-pointer"
                  >
                    <CollegeResult university={university} />
                  </div>
                ))}
              </>
            ) : (
              <div className=" bg-white rounded-lg hover:bg-gray-100 border-b border-neutral-200 last:border-b-0 text-black">
                <p className="p-3 text-gray-500">No results found</p>
              </div>
            )}
          </div>
        )
      )}
    </div>
  )
}
