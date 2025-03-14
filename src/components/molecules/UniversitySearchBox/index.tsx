'use client'
import CollegeResult from '@/components/CollegeResult'
import { Skeleton } from '@/components/ui/Skeleton'
import { useUniversitySearch } from '@/services/universitySearch'
import { useState } from 'react'
import { PiMagnifyingGlassBold } from 'react-icons/pi'

export default function UniversitySearchBox() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: universities, isLoading, error } = useUniversitySearch(searchTerm)

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

      {/* Error Handling */}
      {/*{error && <div className="mt-2 text-red-500">Error fetching universities</div>}*/}
      {/* Search Results */}
      {isLoading ? (
        <div className="absolute mt-2 w-full bg-white border-4 border-neutral-500 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="p-4">
            <Skeleton className="bg-slate-300 h-4 w-40 my-2" />
            <Skeleton className="bg-slate-300 h-4 w-50 my-2" />
          </div>
        </div>
      ) : (
        searchTerm && (
          <div className="absolute px-4 py-2 mt-2 w-full bg-white border-2 border-neutral-500 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
            {universities && universities.result.length > 0 ? (
              <>
                {universities.result.map((university: any, index: number) => (
                  <div key={university?.id} className=" bg-white hover:bg-surface-primary-50 py-1">
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

//'use client'
//import { useState } from 'react'
//import { PiMagnifyingGlassBold } from 'react-icons/pi'

//const institutions = [
//  { name: 'Lorem Institute of Technology', icon: '🟢' },
//  { name: 'Lorem University', icon: '🔵' },
//  { name: 'Lorem State College', icon: '🟥' },
//  { name: 'Lorem Ipsum College', icon: '🟥' },
//  { name: 'Ipsum University', icon: '🟡' },
//  { name: 'Ipsum College', icon: '🟠' },
//]

//export default function SearchBar() {
//  const [query, setQuery] = useState('')
//  const [hovered, setHovered] = useState(false)

//  const filteredResults = query ? institutions.filter((inst) => inst.name.toLowerCase().includes(query.toLowerCase())) : []

//  return (
//    <div className="relative mt-8">
//      {/* Search Input */}
//      <div
//        className="flex items-center border-[3px] border-neutral-300 rounded-full px-4 py-2 transition focus-within:border-neutral-400 hover:border-neutral-400"
//        onMouseEnter={() => setHovered(true)}
//        onMouseLeave={() => setHovered(false)}
//      >
//        <PiMagnifyingGlassBold size={20} strokeWidth={5} className="text-neutral-400" />

//        {/*<input
//        value={searchTerm}
//        onChange={(e) => setSearchTerm(e.target.value)}
//        style={{ width: '-webkit-fill-available' }}
//        className="py-1 pl-10 border-[3px] border-neutral-300 rounded-full focus:outline-none focus:border-gray-500 w-full"
//        type="text"
//        placeholder="Search Institute"
//      />*/}
//        <input
//          type="text"
//          className="w-full bg-transparent outline-none ml-2 text-gray-700"
//          placeholder="Search institution"
//          value={query}
//          onChange={(e) => setQuery(e.target.value)}
//        />
//      </div>

//      {/* Search Dropdown */}
//      {hovered && query && (
//        <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
//          {filteredResults.length > 0 ? (
//            filteredResults.map((inst, index) => (
//              <div key={index} className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 ${index === 0 ? 'bg-gray-100' : ''}`}>
//                <span>{inst.icon}</span>
//                <span className="text-gray-700">{inst.name}</span>
//              </div>
//            ))
//          ) : (
//            <p className="p-3 text-gray-500">No results found</p>
//          )}
//        </div>
//      )}
//    </div>
//  )
//}
