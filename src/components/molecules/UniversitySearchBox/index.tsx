'use client'
import CollegeResult from '@/components/CollegeResult'
import UserListItemSkeleton from '@/components/Connections/UserListItemSkeleton'
import { Skeleton } from '@/components/ui/Skeleton'
import { useUniversitySearch } from '@/services/universitySearch'
import { useState } from 'react'

export default function UniversitySearchBox() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: universities, isLoading, error } = useUniversitySearch(searchTerm)

  return (
    <div className="relative mt-8">
      {/* Search Input */}
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '-webkit-fill-available' }}
        className="py-2 px-4 border-2 border-neutral-300 rounded-full focus:outline-none focus:border-gray-500 w-full"
        type="text"
        placeholder="Search Institute"
      />

      {/* Error Handling */}
      {error && <div className="mt-2 text-red-500">Error fetching universities</div>}
      {/* Search Results */}
      {isLoading ? (
        <div className="absolute mt-2 w-full bg-white border border-neutral-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="p-4">
            <Skeleton className="bg-slate-300 h-4 w-40 my-2" />
            <Skeleton className="bg-slate-300 h-4 w-50 my-2" />
          </div>
        </div>
      ) : (
        universities &&
        universities.result.length > 0 && (
          <div className="absolute mt-2 w-full bg-white border border-neutral-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {universities.result.map((university: any, index: number) => (
              <div key={university.id} className=" bg-white rounded-lg hover:bg-gray-100 border-b border-neutral-200 last:border-b-0 text-black">
                <CollegeResult university={university} />
                {/*<h3 className="text-lg font-semibold">{university.name}</h3>
                <p className="text-sm">{university.country}</p>*/}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
