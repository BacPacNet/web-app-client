import './SearchBar.css'

import Image from 'next/image'
import CollegeResult from '@components/CollegeResult'
import SearchHistoryBox from '@components/SearchHistoryBox/SearchHistoryBox'
import searchIcon from '../assets/search-icon.svg'
import { useEffect, useState } from 'react'
import { useUniversitySearch } from '@/services/universitySearch'
// import { cn } from '@/lib/utils'

interface FilteredCollege {
  id: string
  name: string
  score: string
  city?: string
  country?: string
  collegePage?: string
}
// interface SearchBarProps {
//   data: FilteredCollege[]
//   loading: boolean
// }
interface College {
  id: string
  name: string
  score: string
}

interface SearchBarProps {
  data: FilteredCollege[]
  loading: boolean
  className?: string
  iconDivStyle?: string
  iconStyle?: string
  iconSize?: string
  inputStyle?: string
  resultStyle?: string
  placeholderText?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  data,
  // loading,
  // className,
  // iconDivStyle,
  // iconStyle,
  // iconSize,
  // inputStyle,
  // resultStyle,
  // placeholderText,
}) => {
  const [open, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterData, setFilterData] = useState<FilteredCollege[]>([])
  const [searchHistoryShown, setSearchHistoryShown] = useState(true)

  const { isLoading, data } = useUniversitySearch(searchTerm)
  // console.log(data)

  useEffect(() => {
    if (data) {
      setFilterData(data?.result)
    }
  }, [data])

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim().toLowerCase()
    // const filterData = searchAlgorithm(input, data).sort((a, b) => +b.score - +a.score)
    setSearchTerm(input)
    setIsOpen(input.length !== 0)
    setSearchHistoryShown(false)
  }

  function handleSearchHistory() {
    if (!open) {
      // Only update history if the input is not already open
      const storedSelectedCollegeNames = localStorage.getItem('selectedCollegeNames')
      if (storedSelectedCollegeNames) {
        // Parse the string back into an array
        const selectedCollegeNamesArray = JSON.parse(storedSelectedCollegeNames).reverse()
        console.log('selected college history', selectedCollegeNamesArray)
        // Extract name and score from each object and create a new array
        const selectedCollegeInfoArray = selectedCollegeNamesArray.map((college: College) => ({
          name: college.name,
          score: college.score,
          id: college.id, // You may need to set the ID here if it's available
        }))
        setFilterData(selectedCollegeInfoArray)
        setIsOpen(true) // Open the input to show history
        setSearchHistoryShown(true) // Set search history shown to true
      }
    } else {
      // Close the search history if the input is already open
      setIsOpen(false)
      setSearchHistoryShown(false)
    }
  }
  let searchResults: JSX.Element[] = Array.isArray(filterData)
    ? filterData?.map((item, index) =>
        searchHistoryShown ? (
          <SearchHistoryBox info={item} serialNo={index} key={index} />
        ) : (
          <CollegeResult info={item} serialNo={index} key={index} />
        )
      )
    : []
  if (!isLoading && searchResults?.length === 0) searchResults = [<div key="no-results">No results found</div>]
  if (isLoading) searchResults = [<div key="loading">Loading....</div>]
  return (
    <div className="w-full text-center relative mt-2 h-12 rounded-3xl">
      <div className="relative mt-2 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">
            <Image src={searchIcon} alt="BACPAC LOGO" />
          </span>
        </div>
        <input
          type="text"
          name="price"
          id="price"
          onChange={handleSearch}
          onClick={handleSearchHistory}
          placeholder="Search institute"
          className={`block w-full h-12 rounded-xl border-0 py-1.5 pl-12 pr-20 text-gray-900 ring-1 ring-gray-light ring-inset ring-gray-300 placeholder:text-gray-400  text-sm lg:text-lg sm:leading-6 ${
            open ? 'search-input-open' : ''
          }`}
        />
      </div>

      {open && (
        <div className="searchBox overflow-auto h-auto max-h-80 border border-solid border-gray-light py-2  bg-white text-black relative">
          {searchResults}
        </div>
      )}
    </div>
  )
}

export default SearchBar
