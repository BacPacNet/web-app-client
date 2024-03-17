import './SearchBar.css'

import { AiOutlineSearch } from 'react-icons/ai'
import CollegeResult from '../app/components/CollegeResult'
import searchAlgorithm from '@/utils/searchAlgorithm'
import { useState } from 'react'

interface FilteredCollege {
  id: string
  name: string
  score: string
  city?: string
  country?: string
  collegePage?: string
}
interface SearchBarProps {
  data: FilteredCollege[]
  loading: boolean
}

const SearchBar: React.FC<SearchBarProps> = ({ data, loading }) => {
  const [open, setOpen] = useState(false)
  const [filterData, setFilterData] = useState<FilteredCollege[]>([])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim().toLowerCase()
    const filterData = searchAlgorithm(input, data).sort((a, b) => +b.score - +a.score)
    setOpen(input.length !== 0)
    setFilterData(filterData)
  }

  let searchResults: JSX.Element[] = filterData?.map((item, index) => <CollegeResult info={item} serialNo={index} key={index} />)

  if (!loading && searchResults.length === 0) searchResults = [<div key="no-results">No results found</div>]
  if (loading) searchResults = [<div key="loading">Loading....</div>]

  return (
    <div className="search-box mt-2 h-12 rounded-3xl">
      <div className="search-icon w-6 top-9 left-4 relative h-6 flex justify-center items-center">
        <AiOutlineSearch className="text-lg h-full w-full text-[#D4D4D4]" />
      </div>
      <input
        type="text"
        onChange={handleSearch}
        placeholder="Search institute"
        className="search-input w-full h-full rounded-2xl border border-solid border-gray-300 indent-14 text-black"
      />
      {open && (
        <div className="searchBox overflow-auto  w-full h-auto max-h-80 mt-4 rounded-2xl border border-solid border-gray-300 p-3 bg-white text-black relative">
          {searchResults}
        </div>
      )}
    </div>
  )
}

export default SearchBar
